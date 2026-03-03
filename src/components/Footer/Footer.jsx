import { Button } from "../Button/Button";
import "./footer.css";
import whiteicon from "../../image/whiteicon.svg";

export function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="help">
        <h4>Need Help? <br /> We're Here for you </h4>
        <p>Find quick answers about schedules, <br />
reminders, and your account at <br /> heldesk.vaxitrack@gmail.com</p>

        <Button text="Visit Help Center" className="footer-btn" />
      </div>
      <div className="footer-list">
        <ul className="list-foot">
            <li><a href="#">How it Works</a></li>
            <li><a href="#">Vaccine Guide</a></li>
            <li><a href="#"> Dashboard</a></li>
            <br />
            <br />
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Health Disclaimer</a></li>
        </ul>
      </div>
      <div className="footer-logo">
        <img src={whiteicon} alt="logo" />
        <p>Personal Vaccination Tracking & Awareness System <br />
Helping African families stay protected.</p>

        <span className="span"> &copy; 2026 VaxiTrack. All rights reserved. </span>
      </div>
    </div>
  );
}
