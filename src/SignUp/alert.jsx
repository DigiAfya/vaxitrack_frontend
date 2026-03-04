import './SignUp.css';
import '../General/App.css';
import { useNavigate } from 'react-router-dom';
import successIcon from '../public/pictures/Tick.svg';

export function AccountCreated({ onClose }) {
  const navigate = useNavigate();

  function handleContinueToSignIn() {
    onClose();
    navigate('/signin');
  }

  return (
    <div className="custom-modal" id="customModal">
      <div className="custom-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <img src={successIcon} alt="Success icon" className="success-icon" />
        <h2>Account created successfully!</h2>
        <section>
          <h5>Next Steps:</h5>
          <ol>
            <li>Sign in to your new account</li>
            <li>Create a profile for yourself or your child</li>
            <li>Start tracking your vaccinations</li>
          </ol>
        </section>
        <button type="button" className="signin-btn" onClick={handleContinueToSignIn}>Continue to Sign In</button>
      </div>
    </div>
  );
}