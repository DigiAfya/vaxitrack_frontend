import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../General/App.css';
import './R-password.css';
import eyeOpenedIcon from '../public/pictures/eyeOpened.svg';
import eyeClosedIcon from '../public/pictures/eyeClosed.svg';
import successIcon from '../public/pictures/Tick.svg';

export function RPassword() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasMinLength = newPassword.length >= 8;
    const isStrongPassword = hasLowercase && hasUppercase && hasNumber && hasMinLength;

    function handleContinueToSignIn() {
        navigate('/signin');
    }

    function handleSavePassword() {
        if (!isStrongPassword) {
            window.alert('Password must include uppercase, lowercase, number, and at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            window.alert('Passwords do not match.');
            return;
        }

        setShowSuccessModal(true);
    }

    function handleModalClose() {
        setShowSuccessModal(false);
        navigate('/signin');
    }

    return (
        <div className="password-page">
            <div className="password-container">
                <button
                    type="button"
                    className="close1"
                    aria-label="Close"
                    onClick={handleContinueToSignIn}
                >
                    &times;
                </button>

                <section className="password-header">
                    <h2>Reset Your Password</h2>
                    <p>Enter your new password</p>
                </section>

                <form className="password-form">
                    <label htmlFor="new-password" className="passwordD" id="new-password-label">
                        <span>Password<span className="required-asterisk">*</span></span>
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            required
                            type={showPassword ? 'text' : 'password'}
                            id="new-password"
                            className="passwordD"
                            name="new-password"
                            placeholder="Enter new password"
                            minLength={8}
                            maxLength={100}
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            onFocus={() => setShowPasswordMessage(true)}
                            onBlur={() => setShowPasswordMessage(false)}
                            pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
                        />
                        <button
                            type="button"
                            className="reset-password-toggle"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((previousState) => !previousState)}
                        >
                            <img
                                src={showPassword ? eyeOpenedIcon : eyeClosedIcon}
                                alt={showPassword ? 'Hide password' : 'Show password'}
                                className="password-toggle-icon"
                            />
                        </button>
                    </div>
                    <p id="Passw-p">Password should contain at least 8 characters</p>
                    {showPasswordMessage && (
                        <div id="message">
                            <h3>Password must contain the following:</h3>
                            <p id="letter" className={hasLowercase ? "valid" : "invalid"}>A <b>lowercase</b> letter</p>
                            <p id="capital" className={hasUppercase ? "valid" : "invalid"}>A <b>capital (uppercase)</b> letter</p>
                            <p id="number" className={hasNumber ? "valid" : "invalid"}>A <b>number</b></p>
                            <p id="special" className={hasSpecialChar ? "valid" : "invalid"}>A <b>special character (!@#$%^&*)</b></p>
                            <p id="length" className={hasMinLength ? "valid" : "invalid"}>Minimum <b>8 characters</b></p>
                        </div>
                    )}

                    <label htmlFor="confirm-new-password" className="passwordD" id="confirm-new-password-label">
                        <span>Confirm password<span className="required-asterisk">*</span></span>
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            required
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirm-new-password"
                            className="passwordD"
                            name="confirm-new-password"
                            placeholder="Confirm new password"
                            minLength={8}
                            maxLength={100}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        <button
                            type="button"
                            className="reset-password-toggle"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            onClick={() => setShowConfirmPassword((previousState) => !previousState)}
                        >
                            <img
                                src={showConfirmPassword ? eyeOpenedIcon : eyeClosedIcon}
                                alt={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                className="password-toggle-icon"
                            />
                        </button>
                    </div>
                </form>

                <button
                    type="button"
                    className="password-btn"
                    onClick={handleSavePassword}
                >
                    Create Password
                </button>
            </div>

            {showSuccessModal && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <div className="success-modal-content">
                           <img src={successIcon} alt="Success icon" className="success-icon" />
                            <h2>Password Reset Successfully!</h2>
                            <p>Your password has been changed. You can<br/>
                            now sign in with your new password.</p>
                            <button
                                type="button"
                                className="modal-ok-btn"
                                onClick={handleModalClose}
                            >
                                Continue to Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
