import '../General/App.css';
import './Vaccines.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../pages/Navbar/Navbar';
import { ExistingProfile } from './ExistingUser';
import { ProfileContext } from '../pages/context/profileContext';
import Syringe from '../public/pictures/Syringe.svg';

/*export function Navboard() {
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const location = useLocation();

    function toggleProfileOptions() {
        setShowProfileOptions((prev) => !prev);
    }

    return (
        <header className="App-header">
            <nav>
                <img src={VaxitrackLogo} alt="VaxiTrack" id="logoB" />
                <section className="nav-links">
                    <ul>
                        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                        <li><NavLink to="/vaccines" className={({ isActive }) => isActive || location.pathname === '/existing-profile' ? 'active' : undefined}>Vaccines</NavLink></li>
                        <li><NavLink to="/reminder">Reminders</NavLink></li>
                        <li className="profile-item">
                            <button type="button" className="profile-trigger" onClick={toggleProfileOptions}>
                                Profile
                                <img src={ArrowDown} alt="" className="choose-icon" />
                            </button>
                            {showProfileOptions && (
                                <div className="profile-dropdown">
                                    <a href="/create-profile">Create New Profile</a>
                                    <a href="/switch-profile">Switch Profile</a>
                                    <a href="/delete-profile">Delete Profile</a>
                                </div>
                            )}
                        </li>
                    </ul>
                </section>
            </nav>
        </header>
    )
}*/

export function Vaccines() {
    const navigate = useNavigate();
    const { profiles, profilesLoaded } = useContext(ProfileContext);
    const hasTwoOrMoreProfiles = profiles.length >= 2;

    if (!profilesLoaded) {
        return null;
    }

    if (profiles.length > 0) {
        return <ExistingProfile />;
    }
    return (
        <>
            <Navbar />
            <main>
                <div className="Vaccines-page">
                    <div className="vaccines-content">
                        <section className="vaccines-intro">
                            <div className="vaccines-intro-text">
                                <h1>Vaccines</h1>
                                <p>Learn about different vaccines, their benefits, <br />
                                    and recommended schedules</p>
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

                        <section className="vaccine-container">
                            <img src={Syringe} alt="" className="vaccine-image" />
                            <h2 className="No-Vaccine">No Vaccines to Show</h2>
                            <p className="vaccine-description">Create a profile for yourself or your child to see a list of<br />
                                vaccines</p>
                            <button type="button" className="add-profile-button" onClick={() => navigate('/create-profile')}>
                                Create Your First Profile
                            </button>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}