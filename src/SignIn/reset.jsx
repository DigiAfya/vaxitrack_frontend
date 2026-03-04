import '../SignUp/SignUp.css';
import '../General/App.css';
import './reset.css';
import './SignIn.css';
import messageIcon from '../public/pictures/Message.svg';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from './passwordResetApi';

export function PasswordReset() {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    function handleContinueToSignIn() {
        navigate('/signin');
    }

    async function handleSendResetInstructions() {
        if (!formRef.current?.reportValidity()) {
            return;
        }

        setIsSending(true);

        try {
            const result = await requestPasswordReset(email);
            const fallbackResetPath = `/r-password?email=${encodeURIComponent(email)}`;
            const resetPath = result.resetPath || fallbackResetPath;

            if (/^https?:\/\//i.test(resetPath)) {
                window.location.assign(resetPath);
                return;
            }

            navigate(resetPath);
        } catch (error) {
            window.alert(error.message || 'Unable to send reset email. Please try again.');
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="reset-page">
            <div className="reset-container">
                <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={handleContinueToSignIn}
                >
                    &times;
                </button>
                <section className="reset-header">
                    <h2> Reset Your Password</h2>
                    <p>Enter your email address and we'll send you<br />
                        instructions to reset your password</p>
                </section>
                <form className="reset-form" ref={formRef}>
                    <label htmlFor="emails" className="emailC" id="reset-email">
                        <span>Email address<span className="required-asterisk">*</span></span>
                    </label>

                    <div className="reset-input-wrapper">
                        <input
                            required
                            type="email"
                            id="emails"
                            className="emailC"
                            name="email"
                            placeholder="Enter your email"
                            minLength={14}
                            maxLength={60}
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <img src={messageIcon} alt="Email icon" className="Reset-icon" />
                    </div>
                    <p id="reset-p">Password should contain at least 8 characters</p>
                </form>
                <button
                    type="button"
                    className="signin-btn"
                    onClick={handleSendResetInstructions}
                    disabled={isSending}
                >
                    {isSending ? 'Sending...' : 'Send Reset Instructions'}
                </button>
                <p id="remember"> Remember your password? <span className="signin-link" onClick={handleContinueToSignIn}>Sign In</span></p>
            </div>
        </div>
    );
}
