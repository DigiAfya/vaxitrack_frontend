import "./Heading.css";
import { Button } from "../Button/Button";
import vaccineImage from "../../public/pictures/image/Vaccine.svg";
import { useNavigate } from "react-router-dom";

export function Heading() {
  const navigate = useNavigate();

  return (
    <div className="heading-container">
      <h1 className="heading">
        Stay Protected. Track Your Vaccines <br /> With Confidence.
      </h1>
      <p className="heading-p">
        VaxiTrack is a simple digital platform that helps individuals and
        families track vaccination history, <br /> view Due and Overdue
        vaccines, and stay informed with personalised vaccine guidance.
      </p>

      <div className="heading-btn">
        <Button className="more-btn" text="Learn More" />
        <Button
          className="create-free"
          text="Create Free Account"
          onClick={() => navigate("/signup")}
        />
      </div>

      <img src={vaccineImage} alt="Vaccine" />
    </div>
  );
}
