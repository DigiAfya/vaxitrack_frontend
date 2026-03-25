import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { loginUser } from '../Api/auth';
import '../General/App.css';
import '../General/index.css';
import './SignIn.css';
import whiteLogo from '../public/pictures/WhiteLogo.svg';
import signInImage from '../public/pictures/SignInPic.webp';
import messageIcon from '../public/pictures/Message.svg';
import eyeOpenedIcon from '../public/pictures/eyeOpened.svg';
import eyeClosedIcon from '../public/pictures/eyeClosed.svg';
import googleIcon from '../public/pictures/google.svg';
import InvalidP from '../public/pictures/invalidP.svg';

export function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInClicked, setSignInClicked] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const formRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';
  const hasGoogleClientId = googleClientId.length > 0;

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

  function handleGoogleSignIn() {
    if (!hasGoogleClientId) {
      window.alert('Google sign-in is not configured yet. Add VITE_GOOGLE_CLIENT_ID to your .env file.');
      return;
    }

    setGoogleLoading(true);
    startGoogleLogin();
  }

  async function handleSignIn() {
    setSignInClicked(true);

    if (!formRef.current?.reportValidity()) {
      setTimeout(() => setSignInClicked(false), 7000);
      return;
    }

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
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

      window.dispatchEvent(new Event('auth:changed'));

      const normalizedEmail = email.trim();
      if (normalizedEmail.length > 0) {
        localStorage.setItem('userEmail', normalizedEmail);
        localStorage.setItem('email', normalizedEmail);
        localStorage.setItem('loggedInEmail', normalizedEmail);
      }

      setInvalidCredentials(false);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setInvalidCredentials(true);
      setSignInClicked(false);
    }
  }

  return (
    <div className="container">
      <div className="content">
        <div className="signIn-left">
          <section id="TopLeft">
            <div id="VT">
              <Link to="/">
                <img src={whiteLogo} alt="VaxiTrack" id="logo2" />
              </Link>
            </div>
            <h3 id="signin-description">
              Designed to help African families track <br />
              and understand their vaccination <br />
              journey.
            </h3>
          </section>
          <img
            src={signInImage}
            alt="A female African doctor attending to a female nurse"
            id="signIn-image"
          />
        </div>

        <div className="signIn-right" role="form">
          <div id="right-Layout">
            <div id="signIn-header">
              <div id="SignA">
                <h2 id="sign-account">Sign In to Your Account</h2>
              </div>
              <p>Access your vaccination records and reminders</p>
              {invalidCredentials && (
                <img src={InvalidP} alt="Invalid email or password" className="invalid-password-image" />
              )}
            </div>

            <form className="signin-form" autoComplete="on" ref={formRef}>
              <label htmlFor="email" className="emailB">
                <span>Email address</span>
              </label>
              <div className="input-wrapped">
                <img src={messageIcon} alt="Email icon" className="input-icon" />
                <input
                  required
                  type="email"
                  id="email"
                  className="emailB"
                  name="email"
                  placeholder="Enter your email"
                  minLength={14}
                  maxLength={60}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setInvalidCredentials(false);
                  }}
                  autoComplete="email"
                />
              </div>

              <label htmlFor="password" className="PassW">
                <span>Password</span>
              </label>
              <div className="password-wrapper">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`PassW ${invalidCredentials ? 'invalid-password' : ''}`}
                  name="password"
                  placeholder="Enter your password"
                  minLength={8}
                  maxLength={100}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setInvalidCredentials(false);
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  <img
                    src={showPassword ? eyeOpenedIcon : eyeClosedIcon}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    className="password-toggle-icon"
                  />
                </button>
              </div>


              <Link to="/reset" id="forgot-password">Forgot password?</Link>

              <div className="button-container">
                <button
                  type="button"
                  className={`signin-btn ${signInClicked ? 'clicked' : ''}`}
                  onClick={handleSignIn}
                >
                  <span>Sign in</span>
                </button>

                <p id="or">OR</p>

                <button
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  <img src={googleIcon} className="google-icon" alt="Google logo" />
                  <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>

                <p id="account">
                  Don't have an account? <Link to="/signup">Create one</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}