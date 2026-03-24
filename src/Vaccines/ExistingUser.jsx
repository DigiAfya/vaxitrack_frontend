import { useContext, useEffect, useState } from 'react';
import '../General/App.css';
import './Vaccines.css';
import './ExistingUser.css';
import PlusBlack from '../public/pictures/PlusBlack.svg';
import PlusGrey from '../public/pictures/PlusGrey.svg';
import Search from '../public/pictures/Search.svg';
import { Navbar } from '../pages/Navbar/Navbar';
import { api } from '../Api/api';
import { createProfileReminder, saveTemporaryReminder } from '../Api/reminders';
import { VaccineModal } from './Explanation';
import { ReminderSuccessModal, SetReminderModal } from './VaccineM';
import { ProfileContext } from '../pages/context/profileContext';

export function ExistingProfile() {
    const { activeProfile, profiles, notifyDashboardRefresh } = useContext(ProfileContext);
    const [selectedVaccine, setSelectedVaccine] = useState(null);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [reminderVaccine, setReminderVaccine] = useState('');
    const [selectedReminderVaccine, setSelectedReminderVaccine] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [profileCategory] = useState(() => {
        const savedCategory = window.localStorage.getItem('activeProfileCategory');
        return savedCategory === 'adult' ? 'adult' : 'child';
    });

    const fallbackVaccines = [
        { name: 'BCG', ageRange: 'At birth', category: 'Child', type: 'Compulsory', doses: '1 dose' },
        { name: 'Hepatitis B', ageRange: 'At birth', category: 'Child', type: 'Compulsory', doses: '1 dose' },
        { name: 'OPV/IPV', ageRange: '6 weeks', category: 'Child', type: 'Compulsory', doses: '3 doses' },
        { name: 'Pentavalent', ageRange: '6 weeks', category: 'Child', type: 'Compulsory', doses: '3 doses' },
        { name: 'PCV', ageRange: '6 weeks', category: 'Child', type: 'Compulsory', doses: '3 doses' },
        { name: 'Rotavirus', ageRange: '6 weeks to 6 months', category: 'Child', type: 'Compulsory', doses: '2 doses' },
        { name: 'MMR', ageRange: '6 months', category: 'Child', type: 'Compulsory', doses: '1 dose' },
        { name: 'Yellow Fever', ageRange: '9 months', category: 'Child', type: 'Compulsory', doses: '1 dose' },
        { name: 'MCV', ageRange: '12 months', category: 'Child', type: 'Compulsory', doses: '1 dose' },
        { name: 'DTP Booster', ageRange: '15 months', category: 'Child', type: 'Compulsory', doses: '3 doses' },
        { name: 'HPV', ageRange: ' 9-14 years', category: 'Child', type: 'Compulsory', doses: '2 doses' },
        { name: 'Hepatitis B', ageRange: '18 and above', category: 'Adult', type: 'Not Compulsory', doses: '3 doses' },
        { name: 'Influenza', ageRange: '18 and above', category: 'Adult', type: 'Not Compulsory', doses: '5 doses' },
        { name: 'Covid-19', ageRange: '18 and above', category: 'Adult', type: 'Not Compulsory', doses: '1 dose' },
        { name: 'Tdap', ageRange: '11-12 years', category: 'Child', type: 'Not Compulsory', doses: '1 doses' },
        { name: 'Meningococcal ACWY', ageRange: '11-12 years', category: 'Child', type: 'Not Compulsory', doses: '2 doses' },
    ];

    const vaccineEndpoints = ['/api/v1/vaccines'];
    const normalizeCategory = (value) => {
        if (typeof value !== 'string' || value.trim().length === 0) return 'N/A';
        const trimmed = value.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    const normalizeDose = (value) => {
        if (typeof value === 'number') return `${value} dose${value > 1 ? 's' : ''}`;
        if (typeof value === 'string' && value.trim().length > 0) return value;
        return 'N/A';
    };

    const deriveType = (item) => {
        const explicitType = item?.type ?? item?.vaccineType;

        if (typeof explicitType === 'string' && explicitType.trim().length > 0) {
            return explicitType;
        }

        const categoryValue = String(item?.category ?? '').trim().toLowerCase();

        if (categoryValue === 'routine' || categoryValue === 'mandatory' || categoryValue === 'compulsory') {
            return 'Compulsory';
        }

        if (categoryValue === 'recommended' || categoryValue === 'optional') {
            return 'Not Compulsory';
        }

        return 'N/A';
    };

    const normalizeVaccine = (item) => {
        if (!item || typeof item !== 'object') {
            return null;
        }

        const name = item.name ?? item.vaccine_name ?? item.vaccineName ?? item.title;
        if (typeof name !== 'string' || name.trim().length === 0) {
            return null;
        }

        return {
            vaccineId: item.vaccine_id ?? item.vaccineId ?? item.id ?? null,
            name: name.trim(),
            ageRange: item.age_range ?? item.ageRange ?? item.recommended_age ?? item.schedule ?? item.age_group ?? 'N/A',
            category: normalizeCategory(item.category),
            type: deriveType(item),
            doses: normalizeDose(item.dose_sequence ?? item.doses ?? item.doseCount),
        };
    };

    const normalizeVaccineName = (value) =>
        String(value ?? '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

    const resolveVaccineId = async (vaccine) => {
        const candidateId = Number(vaccine?.vaccineId);
        if (Number.isFinite(candidateId) && candidateId > 0) {
            return candidateId;
        }

        const targetName = normalizeVaccineName(vaccine?.name);
        const targetCategory = String(vaccine?.category ?? '').toLowerCase();

        const localMatch = vaccines.find((item) => {
            const itemName = normalizeVaccineName(item?.name);
            const itemCategory = String(item?.category ?? '').toLowerCase();

            const exactNameMatch = itemName === targetName;
            const closeNameMatch = itemName.includes(targetName) || targetName.includes(itemName);
            const categoryMatch = !targetCategory || !itemCategory || targetCategory === itemCategory;

            return (exactNameMatch || closeNameMatch) && categoryMatch;
        });

        const localId = Number(localMatch?.vaccineId);
        if (Number.isFinite(localId) && localId > 0) {
            return localId;
        }

        try {
            const response = await api.get('/api/v1/vaccines');
            const rawVaccines = extractVaccines(response);
            const normalized = rawVaccines.map(normalizeVaccine).filter(Boolean);

            const remoteMatch = normalized.find((item) => {
                const itemName = normalizeVaccineName(item?.name);
                const itemCategory = String(item?.category ?? '').toLowerCase();

                const exactNameMatch = itemName === targetName;
                const closeNameMatch = itemName.includes(targetName) || targetName.includes(itemName);
                const categoryMatch = !targetCategory || !itemCategory || targetCategory === itemCategory;

                return (exactNameMatch || closeNameMatch) && categoryMatch;
            });

            const remoteId = Number(remoteMatch?.vaccineId);

            if (Number.isFinite(remoteId) && remoteId > 0) {
                return remoteId;
            }
        } catch {
            return null;
        }

        return null;
    };

    const extractVaccines = (payload) => {
        const source = payload?.data?.data ?? payload?.data ?? payload;

        if (Array.isArray(source)) return source;
        if (Array.isArray(source?.vaccines)) return source.vaccines;
        if (Array.isArray(source?.items)) return source.items;
        if (Array.isArray(source?.results)) return source.results;

        return [];
    };

    useEffect(() => {
        let isMounted = true;

        const loadVaccines = async () => {
            for (const endpoint of vaccineEndpoints) {
                try {
                    const response = await api.get(endpoint);
                    const rawVaccines = extractVaccines(response);
                    const normalized = rawVaccines.map(normalizeVaccine).filter(Boolean);

                    if (!isMounted) return;

                    if (normalized.length > 0) {
                        setVaccines(normalized);
                        return;
                    }
                } catch {
                    continue;
                }
            }

            if (isMounted) {
                setVaccines(fallbackVaccines);
            }
        };

        loadVaccines();

        return () => {
            isMounted = false;
        };
    }, []);

    const isEligible = (vaccineCategory) => {
        const normalizedCategory = vaccineCategory?.toLowerCase?.();

        if (normalizedCategory === 'adult' || normalizedCategory === 'child') {
            return normalizedCategory === profileCategory;
        }

        return true;
    };

    const getReminderVaccineLabel = (vaccineName, vaccineCategory) => {
        if (vaccineName === 'Hepatitis B') {
            return vaccineCategory.toLowerCase() === 'adult' ? 'Hepatitis B Adult' : 'Hepatitis B Child';
        }

        return vaccineName;
    };

    const handleAddReminderClick = (vaccine) => {
        if (!isEligible(vaccine.category)) {
            return;
        }

        setSelectedReminderVaccine(vaccine);
        setReminderVaccine(getReminderVaccineLabel(vaccine.name, vaccine.category));
        setIsReminderModalOpen(true);
    };

    const handleSetReminder = async (reminderDate) => {
        const profileId = activeProfile ?? profiles?.[0]?.id;

        if (!profileId) {
            window.alert('Select a profile first before setting a reminder.');
            return;
        }

        const persistTemporaryReminder = (resolvedVaccineId = null) => {
            saveTemporaryReminder({
                id: `temp-${Date.now()}-${resolvedVaccineId ?? 'no-id'}`,
                profileId: Number(profileId),
                vaccineId: resolvedVaccineId,
                vaccineName: selectedReminderVaccine?.name ?? reminderVaccine ?? 'Vaccine',
                dueDate: reminderDate,
                createdAt: new Date().toISOString(),
                status: 'due',
                reminderType: selectedReminderVaccine?.type,
            });

            setIsReminderModalOpen(false);
            setIsSuccessModalOpen(true);
            notifyDashboardRefresh();
        };

        const vaccineId = await resolveVaccineId(selectedReminderVaccine);

        if (!vaccineId) {
            persistTemporaryReminder();
            return;
        }

        try {
            await createProfileReminder(profileId, {
                vaccineId,
                dueDate: reminderDate,
                status: 'due',
            });

            persistTemporaryReminder(vaccineId);
        } catch (error) {
            persistTemporaryReminder(vaccineId);
        }
    };

    const handleVaccineClick = (event) => {
        const btn = event.target.closest('.V_N');
        if (!btn) return;

        const vaccineLabel = btn.dataset.vaccine?.trim() || btn.textContent.trim();
        const categoryText = btn.dataset.category?.trim().toLowerCase();

        if (vaccineLabel === 'Hepatitis B') {
            setSelectedVaccine(categoryText === 'adult' ? 'Hepatitis B Adult' : 'Hepatitis B Child');
            return;
        }

        setSelectedVaccine(vaccineLabel);
    };

    return (
        <>
            <Navbar />
            <main>
                <div className="Vaccines-page">
                    <div className="vaccines-content existing-user-content">
                        <section className="vaccines-intro existing-user-intro">
                            <div className="vaccines-intro-text">
                                <h1>Vaccines</h1>
                                <p>Learn about different vaccines, their benefits, <br />
                                    and recommended schedules</p>
                            </div>
                        </section>
                        <div className="vaccines-table-container">
                            <div className='existing-user-instruction'>
                                <p>Click on each vaccine to learn more</p>
                                <section className="search-vaccine">
                                    <input type="text" className="search-input" placeholder="Search vaccines by name or description..." />
                                    <img src={Search} alt="" id="search-icon" />
                                </section>
                            </div>
                            <section className="existing-user-table-section">
                                <table className="vaccines-table" onClick={handleVaccineClick}>
                                    <thead>
                                        <tr>
                                            <th className='thead1'><h5>Vaccine Name</h5></th>
                                            <th className='thead2'><h5>Age Range</h5></th>
                                            <th className='thead3'><h5>Category</h5></th>
                                            <th className='thead4'><h5>Type</h5></th>
                                            <th className='thead5'><h5>Doses</h5></th>
                                            <th className='thead6'><h5>Add</h5></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vaccines.map((vaccine) => {
                                            const eligible = isEligible(vaccine.category);

                                            return (
                                                <tr key={vaccine.vaccineId ?? `${vaccine.name}-${vaccine.ageRange}-${vaccine.category}`}>
                                                    <td>
                                                        <button
                                                            className='V_N'
                                                            data-vaccine={vaccine.name}
                                                            data-category={vaccine.category}
                                                        >
                                                            {vaccine.name}
                                                        </button>
                                                    </td>
                                                    <td>{vaccine.ageRange}</td>
                                                    <td><span className='Child'>{vaccine.category} </span></td>
                                                    <td><span className='Compulsory'>{vaccine.type}</span></td>
                                                    <td>{vaccine.doses}</td>
                                                    <td>
                                                        <button
                                                            type='button'
                                                            className='add-vaccine-icon-button'
                                                            onClick={() => handleAddReminderClick(vaccine)}
                                                            disabled={!eligible}
                                                            aria-label={eligible ? `Add reminder for ${vaccine.name}` : `${vaccine.name} is not eligible for this profile`}
                                                        >
                                                            <img
                                                                src={eligible ? PlusBlack : PlusGrey}
                                                                alt={eligible ? 'Eligible vaccine' : 'Not eligible vaccine'}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    </div>
                </div>
                {selectedVaccine && (
                    <VaccineModal
                        vaccine={selectedVaccine}
                        onClose={() => setSelectedVaccine(null)}
                    />
                )}
                <SetReminderModal
                    isOpen={isReminderModalOpen}
                    vaccineName={reminderVaccine}
                    onClose={() => setIsReminderModalOpen(false)}
                    onSetReminder={handleSetReminder}
                />
                <ReminderSuccessModal
                    isOpen={isSuccessModalOpen}
                    vaccineName={reminderVaccine}
                    onClose={() => setIsSuccessModalOpen(false)}
                />
            </main>
        </>
    )
}