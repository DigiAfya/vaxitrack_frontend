import './Reminder.css';
import './Rnotifications.css';
import '../Vaccines/Vaccines.css';
import { useContext, useEffect, useMemo, useState } from 'react';
import { clearSyncedTemporaryReminders, countRemindersByStatus, fetchProfileReminders, getDoseProgressItemKey, getStoredDoseProgress, getTemporaryReminders, mergeReminderLists, updateProfileReminder, updateTemporaryReminder, withEffectiveReminderStatus } from '../Api/reminders';
import { SetReminderModal } from '../Vaccines/VaccineM';
import { Navbar } from '../pages/Navbar/Navbar';
import ColoredInfo from '../public/pictures/ColoredInfo.svg';
import GreyBell from '../public/pictures/GreyBell.svg';
import Overdue from '../public/pictures/Overdue.svg';
import Ytime from '../public/pictures/Ytime.svg';
import { Navigate, useNavigate } from 'react-router-dom';
import { ProfileContext } from '../pages/context/profileContext';

const toDateKey = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return '';
    return text.includes('T') ? text.split('T')[0] : text.slice(0, 10);
};

const formatReminderDate = (value) => {
    if (!value) return 'Date unavailable';

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatReminderTime = (value) => {
    if (!value || !String(value).includes('T')) {
        return 'All day';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return 'Time unavailable';
    }

    return parsed.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    }).toLowerCase();
};

const getStatusLabel = (status) => {
    if (status === 'overdue') return 'Overdue';
    if (status === 'taken') return 'Taken';
    return 'Due';
};

const getReminderTypeLabel = (type) => (type === 'recommended' ? 'Recommended' : 'Compulsory');

const MULTI_DOSE_TOTALS = {
    'opv/ipv': 3,
    pentavalent: 3,
    pcv: 3,
    rotavirus: 2,
    'dtp booster': 3,
    dtap: 3,
    hpv: 2,
    influenza: 5,
    flu: 5,
    'hepatitis b': 3,
    'meningococcal acwy': 2,
};

const normalizeVaccineKey = (value) => String(value ?? '').trim().toLowerCase();

const resolveTotalDoses = (item) => {
    const explicitTotal = Number(item?.totalDoses);

    if (Number.isFinite(explicitTotal) && explicitTotal > 1) {
        return Math.floor(explicitTotal);
    }

    const vaccineName = normalizeVaccineKey(item?.vaccineName);

    const exact = MULTI_DOSE_TOTALS[vaccineName];
    if (exact) {
        return exact;
    }

    const fuzzy = Object.entries(MULTI_DOSE_TOTALS).find(([key]) =>
        vaccineName.includes(key) || key.includes(vaccineName)
    )?.[1];

    return fuzzy ?? 1;
};

const buildDoseProgress = (item, allItems, storedProgressMap = {}) => {
    const total = resolveTotalDoses(item);

    if (!Number.isFinite(total) || total <= 1) {
        return null;
    }

    const vaccineName = normalizeVaccineKey(item?.vaccineName);
    const relatedItems = (Array.isArray(allItems) ? allItems : []).filter(
        (candidate) => normalizeVaccineKey(candidate?.vaccineName) === vaccineName
    );
    const takenCount = relatedItems.filter((candidate) => candidate?.status === 'taken').length;
    const storedCount = Math.max(0, Number(storedProgressMap?.[getDoseProgressItemKey(item)]) || 0);
    const completed = Math.min(total, Math.max(0, Math.max(takenCount, storedCount)));
    const remaining = Math.max(0, total - completed);

    return {
        completed,
        total,
        remaining,
        ratio: total > 0 ? completed / total : 0,
    };
};

const buildDoseSummaryText = (item, progress) => {
    if (!progress) {
        return item?.ageRange ?? 'Vaccination reminder';
    }

    const vaccineName = item?.vaccineName ?? 'vaccine';
    const remainingLabel = progress.remaining === 1 ? 'dose' : 'doses';
    const intro = `You have completed ${progress.completed} of ${progress.total} ${vaccineName} doses.`;

    if (progress.remaining === 0) {
        return `${intro} All doses completed.`;
    }

    return `${intro} ${progress.remaining} more ${remainingLabel} remaining. Next dose due soon.`;
};

export function Rnotifications() {
    const navigate = useNavigate();
    const { profiles, profilesLoaded, activeProfile, dashboardRefreshKey, notifyDashboardRefresh, syncProfileCountsFromReminders } = useContext(ProfileContext);
    const hasTwoOrMoreProfiles = profiles.length >= 2;
    const [reminders, setReminders] = useState([]);
    const [statusClock, setStatusClock] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('compulsory');
    const [activeStatFilter, setActiveStatFilter] = useState('total');
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [doseProgressMap, setDoseProgressMap] = useState({});

    const selectedProfileId = activeProfile ?? profiles?.[0]?.id ?? null;

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setStatusClock(Date.now());
        }, 60000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (!selectedProfileId) {
            setDoseProgressMap({});
            return;
        }

        setDoseProgressMap(getStoredDoseProgress(selectedProfileId));
    }, [selectedProfileId, dashboardRefreshKey]);

    const isSameReminder = (left, right) => {
        if (!left || !right) return false;

        const leftId = String(left?.id ?? '');
        const rightId = String(right?.id ?? '');

        if (leftId && rightId && leftId === rightId) {
            return true;
        }

        return String(left?.vaccineName ?? '').toLowerCase() === String(right?.vaccineName ?? '').toLowerCase()
            && toDateKey(left?.dueDate) === toDateKey(right?.dueDate);
    };

    const handleOpenRescheduleModal = (reminder) => {
        setSelectedReminder(reminder);
        setIsRescheduleModalOpen(true);
    };

    const handleCloseRescheduleModal = () => {
        setIsRescheduleModalOpen(false);
        setSelectedReminder(null);
    };

    const handleRescheduleReminder = async (updatedDateTime) => {
        if (!selectedReminder || !selectedProfileId) {
            return;
        }

        try {
            if (selectedReminder.isTemporary) {
                const updatedTemporaryReminder = updateTemporaryReminder(selectedProfileId, selectedReminder.id, {
                    dueDate: updatedDateTime,
                });

                if (!updatedTemporaryReminder) {
                    throw new Error('Unable to update temporary reminder.');
                }
            } else {
                await updateProfileReminder(selectedProfileId, selectedReminder.id, {
                    dueDate: updatedDateTime,
                    status: selectedReminder.status,
                    vaccineId: selectedReminder.vaccineId,
                });
            }

            setReminders((prev) =>
                prev
                    .map((item) => (isSameReminder(item, selectedReminder)
                        ? { ...item, dueDate: updatedDateTime }
                        : item))
                    .sort((left, right) => String(left?.dueDate ?? '').localeCompare(String(right?.dueDate ?? '')))
            );

            notifyDashboardRefresh();
            handleCloseRescheduleModal();
        } catch {
            setError('Unable to reschedule reminder right now. Please try again.');
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadReminders = async () => {
            if (!profilesLoaded || profiles.length === 0 || !selectedProfileId) {
                if (isMounted) {
                    setReminders([]);
                    setError('');
                    setLoading(false);
                }
                return;
            }

            setLoading(true);

            const temporaryReminders = getTemporaryReminders(selectedProfileId);

            if (isMounted) {
                setReminders(temporaryReminders);
            }

            try {
                const backendReminders = await fetchProfileReminders(selectedProfileId);
                clearSyncedTemporaryReminders(selectedProfileId, backendReminders);
                const latestTemporaryReminders = getTemporaryReminders(selectedProfileId);

                if (isMounted) {
                    setReminders(mergeReminderLists(backendReminders, latestTemporaryReminders));
                    setError('');
                }
            } catch (loadError) {
                if (isMounted) {
                    const statusCode = Number(loadError?.response?.status);
                    const backendMessage = loadError?.response?.data?.message;
                    const fallbackMessage =
                        statusCode === 500
                            ? `Reminder service error for profile ${selectedProfileId}. Please try again shortly.`
                            : (backendMessage ?? 'Unable to load reminders right now.');

                    setReminders(temporaryReminders);
                    setError(
                        temporaryReminders.length > 0
                            ? ''
                            : fallbackMessage
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadReminders();

        return () => {
            isMounted = false;
        };
    }, [profilesLoaded, profiles.length, selectedProfileId, dashboardRefreshKey]);

    const now = useMemo(() => new Date(statusClock), [statusClock]);
    const todayKey = new Date().toISOString().slice(0, 10);
    const effectiveReminders = useMemo(
        () => reminders.map((item) => withEffectiveReminderStatus(item, now)),
        [reminders, now]
    );

    const statusCounts = useMemo(
        () => countRemindersByStatus(effectiveReminders, now),
        [effectiveReminders, now]
    );

    const totalCount = statusCounts.total;
    const todayCount = effectiveReminders.filter((item) => toDateKey(item.dueDate) === todayKey).length;
    const dueCount = statusCounts.due;
    const overdueCount = statusCounts.overdue;
    const compulsoryCount = effectiveReminders.filter((item) => item.reminderType !== 'recommended').length;
    const recommendedCount = effectiveReminders.filter((item) => item.reminderType === 'recommended').length;

    useEffect(() => {
        if (!selectedProfileId) return;
        syncProfileCountsFromReminders(selectedProfileId, effectiveReminders);
    }, [selectedProfileId, effectiveReminders, syncProfileCountsFromReminders]);

    const filteredReminders = useMemo(() => {
        const typeFiltered = effectiveReminders.filter((item) => {
            if (activeFilter === 'recommended') {
                return item.reminderType === 'recommended';
            }

            return item.reminderType !== 'recommended';
        });

        if (activeStatFilter === 'today') {
            return typeFiltered.filter((item) => toDateKey(item.dueDate) === todayKey);
        }

        if (activeStatFilter === 'due') {
            return typeFiltered.filter((item) => item.status === 'due');
        }

        if (activeStatFilter === 'overdue') {
            return typeFiltered.filter((item) => item.status === 'overdue');
        }

        return typeFiltered;
    }, [activeFilter, activeStatFilter, effectiveReminders, todayKey]);

    const recentNotifications = useMemo(
        () => [...effectiveReminders].sort((left, right) => String(right?.dueDate ?? '').localeCompare(String(left?.dueDate ?? ''))).slice(0, 3),
        [effectiveReminders]
    );

    if (!profilesLoaded) {
        return null;
    }

    if (profiles.length === 0) {
        return <Navigate to="/reminder" replace />;
    }

    return (
        <div className="reminder">
            <Navbar />
            <div className="Vaccines-page">
                <div className="vaccines-content">
                    <section className="vaccines-intro">
                        <div className="vaccines-intro-text">
                            <h1>Reminders & Notifications</h1>
                            <p>Stay on top of vaccination Schedules</p>
                        </div>
                        <section className="switch-profile">
                            <button
                                className={`switch-button${hasTwoOrMoreProfiles ? ' switch-button-active' : ''}`}
                                onClick={() => navigate('/switch-profile')}
                            >
                                Switch Profile
                            </button>
                        </section>
                    </section>
                </div>
                <main>
                    <div className='R1'>
                        <section className='statscard'>
                            <button
                                type='button'
                                className={`stat11 ${activeStatFilter === 'total' ? 'active' : ''}`}
                                onClick={() => setActiveStatFilter('total')}
                            >
                                <div className='stat-topline'>
                                    <img src={Ytime} alt="" id='ytime' />
                                    <span className='stat-number'>{totalCount}</span>
                                </div>
                                <p>Total</p>
                            </button>
                            <button
                                type='button'
                                className={`stat11 ${activeStatFilter === 'today' ? 'active' : ''}`}
                                onClick={() => setActiveStatFilter('today')}
                            >
                                <div className='stat-topline'>
                                    <img src={GreyBell} alt="" id='greybell' />
                                    <span className='stat-number'>{todayCount}</span>
                                </div>
                                <p>Today</p>
                            </button>
                            <button
                                type='button'
                                className={`stat11 ${activeStatFilter === 'due' ? 'active' : ''}`}
                                onClick={() => setActiveStatFilter('due')}
                            >
                                <div className='stat-topline'>
                                    <img src={ColoredInfo} alt="" id='coloredinfo2' />
                                    <span className='stat-number'>{dueCount}</span>
                                </div>
                                <p>Due</p>
                            </button>
                            <button
                                type='button'
                                className={`stat11 ${activeStatFilter === 'overdue' ? 'active' : ''}`}
                                onClick={() => setActiveStatFilter('overdue')}
                            >
                                <div className='stat-topline'>
                                    <img src={Overdue} alt="" id='overdue2' />
                                    <span className='stat-number'>{overdueCount}</span>
                                </div>
                                <p>Overdue</p>
                            </button>
                        </section>

                        <section className='reminder-section'>
                            <h2>Reminders</h2>
                            <div className='rec'>
                                <button
                                    type='button'
                                    className={activeFilter === 'compulsory' ? 'compulsory-button' : 'recommended-button'}
                                    onClick={() => setActiveFilter('compulsory')}
                                >
                                    Compulsory ({compulsoryCount})
                                </button>
                                <button
                                    type='button'
                                    className={activeFilter === 'recommended' ? 'compulsory-button' : 'recommended-button'}
                                    onClick={() => setActiveFilter('recommended')}
                                >
                                    Recommended ({recommendedCount})
                                </button>
                            </div>

                            {!!error && <p className='reminder-meta'>{error}</p>}

                            <div className='reminder-list'>
                                {loading ? (
                                    <p className='reminder-empty-message'>Loading reminders...</p>
                                ) : filteredReminders.length === 0 ? (
                                    <p className='reminder-empty-message'>No {activeFilter} reminders for this profile yet.</p>
                                ) : (
                                    filteredReminders.map((item) => {
                                        const doseProgress = buildDoseProgress(item, effectiveReminders, doseProgressMap);

                                        return (
                                            <article className='reminder-item-card' key={`${item.id}-${item.dueDate}`}>
                                                <div className='reminder-item-header'>
                                                    <div className='reminder-name-row'>
                                                        <h3>{item.vaccineName}</h3>
                                                        <span className={`reminder-type-badge ${item.reminderType}`}>{getReminderTypeLabel(item.reminderType)}</span>
                                                    </div>
                                                    <span className={`reminder-badge ${item.status}`}>{getStatusLabel(item.status)}</span>
                                                </div>
                                                <p className='reminder-item-date'>To be taken: {formatReminderDate(item.dueDate)}</p>
                                                <p className='reminder-item-subtitle'>{buildDoseSummaryText(item, doseProgress)}</p>

                                                {doseProgress && (
                                                    <div className='reminder-dose-progress'>
                                                        <div className='reminder-dose-progress-header'>
                                                            <span>Dose Progress</span>
                                                            <span>{doseProgress.completed} of {doseProgress.total} doses</span>
                                                        </div>
                                                        <div className='reminder-dose-progress-track'>
                                                            <div
                                                                className='reminder-dose-progress-fill'
                                                                style={{ width: `${Math.round(doseProgress.ratio * 100)}%` }}
                                                            />
                                                        </div>
                                                        <p className='reminder-dose-progress-left'>
                                                            {doseProgress.remaining === 0
                                                                ? 'All doses completed'
                                                                : `${doseProgress.remaining} dose${doseProgress.remaining === 1 ? '' : 's'} remaining`}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className='reminder-item-footer'>
                                                    <span>{formatReminderTime(item.dueDate)}</span>
                                                    <div className='reminder-item-actions'>
                                                        {item.isTemporary && <span className='reminder-syncing'>Syncing...</span>}
                                                        <button
                                                            type='button'
                                                            className='reschedule-button'
                                                            onClick={() => handleOpenRescheduleModal(item)}
                                                        >
                                                            Reschedule
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    })
                                )}
                            </div>
                        </section>
                    </div>
                    <div className='no-reminder'>
                        <h3>Recent Notifications</h3>
                        {recentNotifications.length === 0 ? (
                            <p>You have no notifications. All recent<br />
                                notifications will appear here.</p>
                        ) : (
                            <div className='notification-list'>
                                {recentNotifications.map((item) => (
                                    <article className='notification-item' key={`notice-${item.id}-${item.dueDate}`}>
                                        <div>
                                            <h4>{item.vaccineName}</h4>
                                            <p>{getStatusLabel(item.status)} on {formatReminderDate(item.dueDate)}</p>
                                        </div>
                                        {item.isTemporary && <span className='reminder-syncing'>Syncing...</span>}
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <SetReminderModal
                isOpen={isRescheduleModalOpen}
                vaccineName={selectedReminder?.vaccineName ?? 'Vaccine'}
                initialReminderDate={selectedReminder?.dueDate ?? ''}
                title='Reschedule reminder'
                description='Choose a new reminder date and time for this vaccine.'
                submitLabel='Save changes'
                onClose={handleCloseRescheduleModal}
                onSetReminder={handleRescheduleReminder}
            />
        </div>
    );
}

/*export function RVaccines() {
        return (
                <>
            <Rnotifications />
            <section className='statscard'>
                    <div className='total1'>
                        <img src= {Ytime} alt="" id='ytime'/>
                        <p>Total</p>
                        </div>
                    <div className='unread1'>
                        <img src={GreyBell} alt="" id='unread'/>
                        <p>Unread</p>
                    </div>
                    <div className='due1'>
                        <img src={ColoredInfo} alt="" id='due1'/>
                        <p>Due</p>
                    </div>
                    <div className='Overdue1'>
                        <img src={Overdue} alt="" id='overdue'/>
                        <p>Overdue</p>
                    </div>
            </section>
            
            <section>
                <h2>Reminders</h2>
                <button className='compulsory-button'>Compulsory</button>
                <button className='recommended-button'>Recommended</button>
            </section>
                </>
        );
    }*/