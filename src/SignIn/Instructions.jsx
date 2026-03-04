import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../General/App.css';
import './Instructions.css';
import inbox from '../public/pictures/inbox.svg';

export function Instructions() {
    const navigate = useNavigate();
    const location = useLocation();
    const stateResetPath = location.state?.resetPath;
    const storedResetPath = window.localStorage.getItem('pendingResetLink');
    const resetPath = stateResetPath || storedResetPath || '/r-password';

    function handleContinueToSignIn() {
        navigate('/signin');
    }

    function handleResendEmail() {
        navigate('/reset');
    }

    function handleOpenResetLink() {
        if (/^https?:\/\//i.test(resetPath)) {
            window.location.assign(resetPath);
            return;
        }

        navigate(resetPath);
    }

    return (
        <div className="instructions-page">
            <div className="instructions-container">
                <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={handleContinueToSignIn}
                >
                    &times;
                </button>
                <img src={inbox} alt="Inbox icon" className="inbox-icon" />
                <section className="instructions-header">
                    <h2>Check Your Email</h2>
                    <p>We've sent password reset instructions to<br />
                        your email.</p>
                </section>
                <section id="instructions-list">
                    <h5 className="instructions-note">What's next?</h5>
                    <ul id='list'>
                        <li>Check your email inbox (and spam folder)</li>
                        <li>
                            Click the reset link in the email.
                            <button type="button" className="mail-link-btn" onClick={handleOpenResetLink}>
                                Open reset link
                            </button>
                        </li>
                        <li>Create a new password</li>
                        <li>Sign in with your new password</li>
                    </ul>
                </section>
                <section id="instructions-button">
                    <Link to="/signin" id="signid-btn">
                        Return to Sign in
                    </Link>
                    <button className="resend-btn" onClick={handleResendEmail}>
                        I didn&apos;t receive an email
                    </button>
                </section>
            </div>
        </div>
    );
}