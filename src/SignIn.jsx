import { Link } from 'react-router-dom';

export function SignIn() {
    return (
        <div className="signup-page">
            <div className="signup-right" style={{ margin: '0 auto' }}>
                <div id="signup-header">
                    <h2 id="create-account">Sign In</h2>
                    <p>Welcome back to VaxiTrack</p>
                </div>
                <form className="signup-form" autoComplete="on">
                    <label htmlFor="email" className="emailA"><span>Email address</span></label>
                    <input required type="email" id="email" className="emailA" name="email" placeholder="Enter your email" autoComplete="email" />

                    <label htmlFor="password" className="Pass"><span>Password</span></label>
                    <input required type="password" id="password" className="Pass" name="password" placeholder="Enter your password" autoComplete="current-password" />

                    <div className="button-container">
                        <button type="submit" className="signin-btn">
                            <span>Sign in</span>
                        </button>
                        <p id="account">Don&apos;t have an account? <Link to="/signup">Create one</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
