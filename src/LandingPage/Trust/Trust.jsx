import { TrustCard } from "../trustCard/TrustCard";
import "./Trust.css";
import based from "../../public/pictures/image/based.svg";
import align from "../../public/pictures/image/align.svg";
import design from "../../public/pictures/image/design.svg";
import advice from "../../public/pictures/image/advice.svg";
import warning from "../../public/pictures/image/warning.svg";

export function Trust() {
  return (
    <div className="trust-wrapper">
      <h2>Trust & Credibility</h2>

      <div className="trust-trust">
        <TrustCard
          icon={based}
          text="Based on national immunization schedules"
        />
        <TrustCard icon={align} text="Aligned with WHO recommendations" />
        <TrustCard
          icon={design}
          text="Designed for clarity and accessibility"
        />
        <TrustCard
          icon={advice}
          text="Does not replace professional medical advice"
        />
      </div>

      <div className="disclaimer">
        <div className="title">
          <img src={warning} alt="icon" />
          <h4>Medical Disclaimer</h4>
        </div>
        <p>
          VaxiTrack provides vaccine schedule guidance and general educational
          information. <br />
          It does not replace professional medical advice, diagnosis, or
          treatment. <br />
          Always consult a qualified healthcare provider regarding medical
          decisions.
        </p>
      </div>
    </div>
  );
}
