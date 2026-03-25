import { TrustCard } from "../trustCard/TrustCard";
import "./Trust.css";
import based from "../../public/pictures/image/based.svg";
import align from "../../public/pictures/image/align.svg";
import design from "../../public/pictures/image/design.svg";
import advice from "../../public/pictures/image/advice.svg";
import warning from "../../public/pictures/image/warning.svg";

export function Trust() {
  return (
    <div className="trust-wrapper" id="credibility">
      <h2>Trust & Credibility</h2>

      <div className="trust-trust">
        <TrustCard
          icon={based}
          text={<>Based on <wbr />national immunization schedules</>}
        />
        <TrustCard icon={align} text={<>Aligned with WHO recommen<wbr />dations</>} />
        <TrustCard
          icon={design}
          text="Designed for clarity and accessibility"
        />
        <TrustCard
          icon={advice}
          text="Does not replace professional medical advice"
        />
      </div>


    </div>
  );
}
