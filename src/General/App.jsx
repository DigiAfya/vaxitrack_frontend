import './App.css'
import { SignUp, Footer as SignUpFooter } from '../SignUp/SignUp';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '../SignIn/SignIn';
import { PasswordReset } from '../SignIn/reset';
import { Instructions } from '../SignIn/Instructions';
import { RPassword } from '../SignIn/R-password';
import { Dashboard } from '../Dashboard/Dashboard';
import { CreateProfile } from '../Dashboard/createProfile/createProfile';
import { SwitchProfile } from '../Dashboard/switchProfile/switchProfile';
import { DeleteProfile } from '../Dashboard/deleteProfile/deleteProfile';
import { LandingPage } from '../LandingPage/LandingPage';
import { Vaccines } from '../Vaccines/Vaccines';
import { ExistingProfile } from '../Vaccines/ExistingUser';
import { Reminder } from '../Reminder/Reminder';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<><SignUp /><SignUpFooter /></>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/r-password" element={<RPassword />} />
        <Route path="/reset" element={<PasswordReset />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/switch-profile" element={<SwitchProfile />} />
        <Route path="/delete-profile" element={<DeleteProfile />} />
        <Route path="/vaccines" element={<Vaccines />} />
        <Route path="/existing-profile" element={<ExistingProfile />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App
