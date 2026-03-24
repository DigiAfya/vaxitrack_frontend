import './Reminder.css';
import './Rnotifications.css';
import '../Vaccines/Vaccines.css';
import { useContext, useEffect, useMemo, useState } from 'react';
import { clearSyncedTemporaryReminders, fetchProfileReminders, getTemporaryReminders, mergeReminderLists } from '../Api/reminders';
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

export function Rnotifications() {
    const navigate = useNavigate();
    const { profiles, profilesLoaded, activeProfile, dashboardRefreshKey } = useContext(ProfileContext);
    const hasTwoOrMoreProfiles = profiles.length >= 2;
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('compulsory');
    const [activeStatFilter, setActiveStatFilter] = useState('total');

    const selectedProfileId = activeProfile ?? profiles?.[0]?.id ?? null;

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

    const todayKey = new Date().toISOString().slice(0, 10);
    const totalCount = reminders.length;
    const todayCount = reminders.filter((item) => toDateKey(item.dueDate) === todayKey).length;
    const dueCount = reminders.filter((item) => item.status === 'due').length;
    const overdueCount = reminders.filter((item) => item.status === 'overdue').length;
    const compulsoryCount = reminders.filter((item) => item.status !== 'taken').length;
    const recommendedCount = reminders.filter((item) => item.status === 'taken').length;

    const filteredReminders = useMemo(() => {
        const typeFiltered = reminders.filter((item) => {
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
    }, [activeFilter, activeStatFilter, reminders, todayKey]);

    const recentNotifications = useMemo(
        () => [...reminders].sort((left, right) => String(right?.dueDate ?? '').localeCompare(String(left?.dueDate ?? ''))).slice(0, 3),
        [reminders]
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
                                    filteredReminders.map((item) => (
                                        <article className='reminder-item-card' key={`${item.id}-${item.dueDate}`}>
                                            <div className='reminder-item-header'>
                                                <div className='reminder-name-row'>
                                                    <h3>{item.vaccineName}</h3>
                                                    <span className={`reminder-type-badge ${item.reminderType}`}>{getReminderTypeLabel(item.reminderType)}</span>
                                                </div>
                                                <span className={`reminder-badge ${item.status}`}>{getStatusLabel(item.status)}</span>
                                            </div>
                                            <p className='reminder-item-date'>To be taken: {formatReminderDate(item.dueDate)}</p>
                                            <p className='reminder-item-subtitle'>{item.ageRange}</p>
                                            <div className='reminder-item-footer'>
                                                <span>{formatReminderTime(item.dueDate)}</span>
                                                <div className='reminder-item-actions'>
                                                    {item.isTemporary && <span className='reminder-syncing'>Syncing...</span>}
                                                    <button type='button' className='reschedule-button'>Reschedule</button>
                                                </div>
                                            </div>
                                        </article>
                                    ))
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