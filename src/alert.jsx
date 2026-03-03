import './index.css';
import './App.css';

export function AccountCreated({ onClose }) {
  return (
    <div className="custom-modal" id="customModal">
      <div className="custom-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Account created successfully!</h2>
        <section>
          <h5>Next Steps:</h5>
          <ol>
            <li>Sign in to your new account</li>
            <li>Create a profile for yourself or your child</li>
            <li>Start tracking your vaccinations</li>
          </ol>
        </section>
        <button type="button" className="signin-btn" onClick={onClose}>Continue to Sign In</button>
      </div>
    </div>
  );
}