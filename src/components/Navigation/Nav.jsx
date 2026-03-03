import colorIcon from "../../image/colorIcon.svg"
import "./Nav.css";
import { Button } from "../Button/Button";

export function Nav() {
  return (
    <nav className="navBar">
      <div className="logo">
        <img src={colorIcon} alt="logo" />
     
      </div>

      <ul className="navList">
        <li> <a href="#"> How it works</a></li>
        <li><a href="#">Credibility</a></li>
        <li> <a href="#">Help and Support</a></li>
      </ul>

      <div className="btn">
        < Button className="signin-btn" text="Sign In " />
         <Button text="Create Account" className="create-btn" />
      </div>
    </nav>
  );
}
