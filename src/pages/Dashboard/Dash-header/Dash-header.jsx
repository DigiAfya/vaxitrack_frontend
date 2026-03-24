import "./Dash-header.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProfileContext } from "../../context/profileContext";


export function DashHeader({ head, description }) {
    const navigate = useNavigate();
    const { profiles } = useContext(ProfileContext);
    const hasTwoOrMoreProfiles = profiles.length >= 2;

    return (
        <div className="dash-head">
            <div className="vaccines-content">
                <section className="vaccines-intro">
                    <div className="vaccines-intro-text">
                        <h1>Vaccination Dashboard</h1>
                        <p>Track and manage vaccination schedules</p>
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
        </div>
    );
}
