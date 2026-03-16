import '../General/App.css';
import './Vaccines.css';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import VaxitrackLogo from '../public/pictures/VaxitrackLogo.svg';
import Syringe from '../public/pictures/Syringe.svg';
import ArrowDown from '../public/pictures/ArrowDown.svg';

export function Navboard() {
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
                        <li><NavLink to="/dashboard"><p>Dashboard</p></NavLink></li>
                        <li><NavLink to="/vaccines" className={({ isActive }) => isActive || location.pathname === '/existing-profile' ? 'active' : undefined}><p>Vaccines</p></NavLink></li>
                        <li><NavLink to="/reminder"><p>Reminders</p></NavLink></li>
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
}

export function Vaccines() {
    return (
        <>
            <Navboard />
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
                                <button className="switch-button">Switch Profile</button>
                            </section>
                        </section>

                        <section className="vaccine-container">
                            <img src={Syringe} alt="" className="vaccine-image" />
                            <h2 className="No-Vaccine">No Vaccines to Show</h2>
                            <p className="vaccine-description">Create a profile for yourself or your child to see a list of<br />
                                vaccines</p>
                            <button className="add-profile-button">Create Your First Profile</button>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}