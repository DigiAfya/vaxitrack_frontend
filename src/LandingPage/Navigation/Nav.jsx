import "./Nav.css";
import { Button } from "../Button/Button.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import colorIcon from "../../public/pictures/image/colorIcon.svg";
import threeLines from "../../public/pictures/ThreeLines.svg";

export function Nav() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navBar">
      <div className="logo">
        <img src={colorIcon} alt="logo" />
      </div>

      <button
        type="button"
        className="menuToggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <img src={threeLines} alt="menu" />
      </button>

      <div className={`navMenu ${isMobileMenuOpen ? "open" : ""}`}>
        <ul className="navList">
          <li><a href="#how-it-works" onClick={closeMobileMenu}>How it works</a></li>
          <li><a href="#credibility" onClick={closeMobileMenu}>Credibility</a></li>
          <li><a href="#help-support" onClick={closeMobileMenu}>Help and Support</a></li>
        </ul>

        <div className="btn">
          <Button className="signin-btn" text="Sign In" onClick={() => { closeMobileMenu(); navigate('/signin'); }} />
          <Button text="Create Account" className="create-btn" onClick={() => { closeMobileMenu(); navigate('/signup'); }} />
        </div>
      </div>
    </nav>
  );
}