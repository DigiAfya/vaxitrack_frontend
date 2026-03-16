import { Button } from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import "./TakeControl.css";

export function TakeControl() {
  const navigate = useNavigate();

  return (
    <div className="control">
      <h1>Take Control of Your Vaccination  <br /> Journey Today </h1>

      <p>
        Create your free account and stay protected <br /> with smart reminders and
        clear vaccine guidance.
      </p>

      <Button text="Get Started for Free" className="start-btn" onClick={() => navigate('/signup')} />
    </div>
  );
}
