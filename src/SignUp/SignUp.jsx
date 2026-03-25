import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { registerUser } from '../Api/auth';
import './SignUp.css';
import '../General/App.css';
import { AccountCreated } from './alert'
import whiteLogo from '../public/pictures/WhiteLogo.svg';
import signupImage from '../public/pictures/Signup.webp';
import messageIcon from '../public/pictures/Message.svg';
import eyeOpenedIcon from '../public/pictures/eyeOpened.svg';
import eyeClosedIcon from '../public/pictures/eyeClosed.svg';
import plusWhiteIcon from '../public/pictures/plusWhite.svg';
import googleIcon from '../public/pictures/google.svg';
import { useNotification } from '../Notifications/NotificationContext';

export function SignUp() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [createAccountClicked, setCreateAccountClicked] = useState(false);
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const formRef = useRef(null);
  const { notify } = useNotification();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';
  const hasGoogleClientId = googleClientId.length > 0;

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*]/.test(password);
  const hasMinLength = password.length >= 8;
  const isStrongPassword = hasLowercase && hasUppercase && hasNumber && hasSpecialCharacter && hasMinLength;

  function validatePasswords() {
    if (!isStrongPassword) {
      setError("Password must include uppercase, lowercase, number, special character, and at least 8 characters");
      return false;
    }

    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  }

  async function handleCreateAccount() { /* REPLACED */

    setCreateAccountClicked(true);

    if (!formRef.current?.reportValidity()) {
      setTimeout(() => setCreateAccountClicked(false), 7000);
      return;
    }

    if (!validatePasswords()) {
      setTimeout(() => setCreateAccountClicked(false), 7000);
      return;
    }

    try {
      const formData = new FormData(formRef.current);

      const emailValue = String(formData.get('email') ?? '').trim();

      const response = await registerUser({
        email: emailValue,
        password: password,
        role: 'user',
      });

      const responseData = response?.data?.data ?? response?.data ?? {};
      const accessToken =
        responseData?.accessToken ??
        responseData?.access_token ??
        responseData?.token ??
        response?.data?.accessToken ??
        response?.data?.access_token ??
        response?.data?.token;
      const refreshToken =
        responseData?.refreshToken ??
        responseData?.refresh_token ??
        response?.data?.refreshToken ??
        response?.data?.refresh_token;

      if (typeof accessToken === 'string' && accessToken.length > 0) {
        localStorage.setItem('accessToken', accessToken);
      }

      if (typeof refreshToken === 'string' && refreshToken.length > 0) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      if (emailValue.length > 0) {
        localStorage.setItem('userEmail', emailValue);
        localStorage.setItem('email', emailValue);
        localStorage.setItem('loggedInEmail', emailValue);
      }

      setError('');
      setCreateAccountClicked(false);
      notify.success('Account created successfully');
      setAccountCreated(true);

    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Registration failed. Please try again.';

      notify.error(errorMessage);
      setError(
        errorMessage
      );

      setError(
        errorMessage
      );

      setCreateAccountClicked(false);
    }
  }

  const startGoogleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const googleUser = response.data;
        window.localStorage.setItem('googleUser', JSON.stringify(googleUser));
        window.alert(`Signed in with Google as ${googleUser.email}.`);
      } catch {
        window.alert('Google sign-in succeeded, but user profile could not be loaded.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setGoogleLoading(false);
      window.alert('Google sign-in failed. Please try again.');
    },
    onNonOAuthError: () => {
      setGoogleLoading(false);
      window.alert('Google sign-in was cancelled or could not be completed.');
    },
  });

  function handleGoogleSignUp() {
    if (!hasGoogleClientId) {
      window.alert('Google sign-up is not configured yet. Add VITE_GOOGLE_CLIENT_ID to your .env file.');
      return;
    }

    setGoogleLoading(true);
    startGoogleLogin();
  }

  return (
    <>
      <div className="signup-page">
        {/* left side  */}
        <div className="signup-left">
          <section id="left-top">
            <div id="VaxT">
              <img src={whiteLogo} alt="VaxiTrack" id="logo" />
            </div>

            <h3 id="signup-description">Designed to help African families track <br />
              and understand their vaccination <br />
              journey.</h3>
          </section>
          <img src={signupImage} alt="A female African doctor attending to an African child" id="sign-image" />

        </div>
        {/* right side  */}
        <div className="signup-right" role="form">
          <div id="signup-header">
            <div id="createA">
              <h2 id="create-account"> Create Your Free Account</h2>
            </div>
            <p>Start tracking vaccinations the smart way</p>
          </div>
          {/* form  */}
          <form className="signup-form" autoComplete="on" ref={formRef}>

            <label htmlFor="fullname" className='form-name'><span> Full name</span> </label>
            <input required type="text" className='form-name' id="fullname" name="name" placeholder="Enter your name" minLength={4} maxLength={70} autoComplete="name" />

            <label htmlFor="email" className="emailA"><span> Email address</span> </label>
            <div className='input-wrapper'>
              <img src={messageIcon} alt="Email icon" className='input-icon' />
              <input required type="email" id="email" className="emailA" name="email" placeholder="Enter your email" minLength={14} maxLength={60} autoComplete="email" />
            </div>

            <label htmlFor="password" className='Pass'><span>Password</span> </label>
            <div className="password-input-wrapper">
              <input
                required
                type={showPassword ? "text" : "password"}
                id="password"
                className='Pass'
                name="password"
                placeholder="Enter your password"
                minLength={8}
                maxLength={100}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordMessage(true)}
                onBlur={() => setShowPasswordMessage(false)}
                autoComplete="new-password"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
                title="Must contain at least one number, one uppercase letter, one lowercase letter, one special character and at least 8 or more characters"
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((previousState) => !previousState)}
              >
                <img
                  src={showPassword ? eyeOpenedIcon : eyeClosedIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="password-toggle-icon"
                />
              </button>
            </div>
            <p id="password-help">Password should contain at least 8 characters</p>
            {showPasswordMessage && (
              <div id="message">
                <h3>Password must contain the following:</h3>
                <p id="letter" className={hasLowercase ? "valid" : "invalid"}>A <b>lowercase</b> letter</p>
                <p id="capital" className={hasUppercase ? "valid" : "invalid"}>A <b>capital (uppercase)</b> letter</p>
                <p id="number" className={hasNumber ? "valid" : "invalid"}>A <b>number</b></p>
                <p id="special-character" className={hasSpecialCharacter ? "valid" : "invalid"}>A <b>special character</b> (!@#$%^&*)</p>
                <p id="length" className={hasMinLength ? "valid" : "invalid"}>Minimum <b>8 characters</b></p>
              </div>
            )}
            <label htmlFor="confirm-password" className='Pass'><span> Confirm password</span> </label>
            <div className="password-input-wrapper">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className='Pass'
                name="confirm-password"
                placeholder="Re-enter your password"
                minLength={8}
                maxLength={100}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirmPassword((previousState) => !previousState)}
              >
                <img
                  src={showConfirmPassword ? eyeOpenedIcon : eyeClosedIcon}
                  alt={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  className="password-toggle-icon"
                />
              </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className='checkbox-container'>
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms" > I agree to the <a href="#" target='_blank'>Terms and Privacy Policy</a></label>
            </div>

            <div className='button-container'>
              <button
                type="button"
                className={`signin-btn ${createAccountClicked ? 'clicked' : ''}`}
                onClick={handleCreateAccount}
              >
                <span>Create free account</span>
                <img src={plusWhiteIcon} className="btn-icon" alt="plus icon" />
              </button>
              <p id="or"> OR </p>
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
              >
                <img src={googleIcon} className="google-icon" alt="Google logo" />
                <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
              <p id="account">Already have an account? <Link to="/signin">Sign in</Link></p>
            </div>
          </form >
          {accountCreated && <AccountCreated onClose={() => setAccountCreated(false)} onContinue={() => navigate("/signin")} />}
        </div>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <>
      <div className="foot">
        <footer>
          <section className='help'>

            <div id="NeedHelp">
              <h4 id="need-help-header">Need Help?<br />
                We're Here for You</h4>
              <p> Find quick answers about schedules,<br />
                reminders, and your account at<br />
                <a href="#" target='_blank'>helpdesk.vaxitrack@gmail.com</a></p>
            </div>

            <button type="button" className="contact-btn" onClick={() => window.open('https://helpcenter.vaxitrack.com', '_blank')}>Visit Help Center</button>
          </section>
          <section className='Information'>
            <ul id="Information1">
              <li><a href='#' target='_blank'>How it Works</a></li>
              <br />
              <li><a href='#' target='_blank'>Vaccine Guide</a></li>
              <br />
              <li><a href='#' target='_blank'>Dashboard</a></li>
            </ul>
            <ul id="Information2">
              <li><a href='#' target='_blank'>Privacy Policy</a></li>
              <br />
              <li><a href='#' target='_blank'>Health Disclaimer</a></li>
            </ul>
          </section>
          <section className="vaxiTrack">
            <img src={whiteLogo} alt="VaxiTrack" id="logo1" />
            <br />
            <br />
            <p id="motto">Personal Vaccination Tracking & Awareness System<br />
              Helping African families stay protected.</p>
            <br />
            <br />
            <br />
            <div>
              <p id="copy">&copy; 2026 VaxiTrack. All rights reserved.</p>
            </div>
          </section>
        </footer>
      </div>
    </>
  )
}




