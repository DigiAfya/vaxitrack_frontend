import { Link } from "react-router-dom";

import { Button } from "../Button/Button.jsx";
import "./footer.css";
import whiteIcon from "../../public/pictures/image/whiteicon.svg";

export function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="help" id="help-support">
        <h4>
          Need Help? <br /> We're Here for you{" "}
        </h4>
        <p>
          Find quick answers about schedules, <br />
          reminders, and your account at <br /> <a href="#" target='_blank' id='help-desk'>helpdesk.vaxitrack@gmail.com</a>
        </p>

        <Button text="Visit Help Center" className="footer-btn" />
      </div>
      <div className="footer-list">
        <ul className="list-foot">
          <li>
            <a href="#">How it Works</a>
          </li>
          <li>
            <a href="#">Vaccine Guide</a>
          </li>
          <li>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
          </li>
          <li className="footer-spacer" aria-hidden="true"></li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Health Disclaimer</a>
          </li>
        </ul>
      </div>
      <div className="footer-logo">
        <img src={whiteIcon} alt="logo" />
        <p>
          Personal Vaccination Tracking & Awareness System <br />
          Helping African families stay protected.
        </p>

        <span className="span">
          {" "}
          &copy; 2026 VaxiTrack. All rights reserved.{" "}
        </span>
      </div>
    </div>
  );
}
