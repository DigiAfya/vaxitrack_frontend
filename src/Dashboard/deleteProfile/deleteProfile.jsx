import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { DashHeader } from '../Dash-header/Dash-header';

export function DeleteProfile() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <DashHeader
                head="Profile Management"
                description="Manage profiles for yourself and your family"
            />
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Delete Profile</h2>
                <p>This page is coming soon.</p>
                <button type="button" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
