import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Nav } from "./components/Navigation/Nav.jsx";
import { Heading } from "./components/Heading/Heading.jsx";
import { Section } from "./components/SectionWhy/Section.jsx";
import { Solution } from "./components/Solution/Solution.jsx";
import { TakeControl } from "./components/TakeControl/TakeControl.jsx";
import { Trust } from "./components/Trust/Trust.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { SignUp } from './SignUp';
import { SignIn } from './SignIn';

function LandingPage() {
  return (
    <div>
      <Nav />
      <Heading />
      <Section />
      <Solution />
      <TakeControl />
      <Trust />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;