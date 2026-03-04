import "./Nav.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
import colorIcon from "../../public/pictures/image/colorIcon.svg";

export function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="navBar">
      <div className="logo">
        <img src={colorIcon} alt="logo" />
      </div>

      <ul className="navList">
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#credibility">Credibility</a></li>
        <li><a href="#help-support">Help and Support</a></li>
      </ul>

      <div className="btn">
        <Button className="signin-btn" text="Sign In" onClick={() => navigate('/signin')} />
        <Button text="Create Account" className="create-btn" onClick={() => navigate('/signup')} />
      </div>
    </nav>
  );
}