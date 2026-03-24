import { Navbar } from '../pages/Navbar/Navbar';
import MedicalRecord from '../public/pictures/MedicalRecord.svg';
import './Reminder.css';
import '../Vaccines/Vaccines.css';
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ProfileContext } from '../pages/context/profileContext';


export function Reminder() {
    const navigate = useNavigate();
    const { profiles, profilesLoaded } = useContext(ProfileContext);
    const hasTwoOrMoreProfiles = profiles.length >= 2;

    if (!profilesLoaded) {
        return null;
    }

    if (profiles.length > 0) {
        return <Navigate to="/rnotifications" replace />;
    }

    return (
        <div className="reminder">
            <Navbar />
            <>
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
                    <div className="Vaccines-page">
                        <div className="reminder-container">
                            <img src={MedicalRecord} alt="" className="vaccine-image" />
                            <h2 className="No-Vaccine">No Reminders Yet</h2>
                            <p className="vaccine-description">You have no pending vaccine notifications. All<br />
                                schedules are up to date.</p>
                            <button className="add-profile-button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

