import './App.css'
import { SignUp, Footer as SignUpFooter } from '../SignUp/SignUp';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '../SignIn/SignIn';
import { PasswordReset } from '../SignIn/reset';
import { Instructions } from '../SignIn/Instructions';
import { RPassword } from '../SignIn/R-password';
import { LandingPage } from '../LandingPage/LandingPage';
import { Vaccines } from '../Vaccines/Vaccines';
import { ExistingProfile } from '../Vaccines/ExistingUser';
import { Reminder } from '../Reminder/Reminder';
import { Rnotifications } from '../Reminder/Rnotifications';
import { Dashboard } from "../pages/Dashboard/Dashboard.jsx";
import { CreateProfile } from "../pages/Dashboard/createProfile/createProfile.jsx";
import { EditProfile } from "../pages/Dashboard/EditProfile/EditProfile.jsx";
import { SwitchProfile } from "../pages/Dashboard/switchProfile/SwitchProfile.jsx";
import { Profile } from "../pages/Profile/Profile.jsx";
import { ProfileProvider } from "../pages/context/profileContext.jsx";

function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<><SignUp /><SignUpFooter /></>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/r-password" element={<RPassword />} />
        <Route path="/reset" element={<PasswordReset />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/switch-profile" element={<SwitchProfile />} />
        <Route path="/vaccines" element={<Vaccines />} />
        <Route path="/existing-profile" element={<ExistingProfile />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/rnotifications" element={<Rnotifications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProfileProvider>
  );
}

export default App
