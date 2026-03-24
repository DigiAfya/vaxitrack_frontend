import success from "../../../public/pictures/image/success.svg";
import { Button } from "../../../LandingPage/Button/Button.jsx";
import "./Success.css";

export function Success () {
    return (
        <div className="success-container">
            <img src={success} alt=""  />
            <h2>Success</h2>
            <p>Your profile was created successfully.</p>
            <Button text="Great !" className="success-btn" />
        </div>
    );
}