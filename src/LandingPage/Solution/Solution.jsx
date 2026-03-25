import "./Solution.css";
import { SolutionComp } from "../SolutionComponent/SolutionComp";
import profileIcon from "../../public/pictures/image/profile.svg";
import scheduleIcon from "../../public/pictures/image/Schedule.svg";
import trackIcon from "../../public/pictures/image/track.svg";

export function Solution() {
  return (
    <div className="solution-container" id="how-it-works">
      <h2>The Solution - How VaxiTrack Works</h2>

      <div className="profile">
        <SolutionComp
          icon={profileIcon}
          text="Create Your Profile"
          solution="Register safely with encrypted protection to see your vaccines."
        />

        <SolutionComp
          icon={scheduleIcon}
          text="Review Your Schedule"
          solution="See vaccines you should have taken and those you still need."
        />

        <SolutionComp
          icon={trackIcon}
          text="Stay on Track"
          solution="Mark vaccines as taken and receive reminders for upcoming doses."
        />
      </div>
    </div>
  );
}