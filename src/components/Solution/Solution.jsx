import "./Solution.css"
import { SolutionComp } from "../SolutionComponent/SolutionComp";
import profile from "../../image/profile.svg";
import Schedule from "../../image/Schedule.svg";
import track from "../../image/track.svg";

export function Solution () {
    return (
        <div className="solution-container">
            <h2>The Solution - How VaxiTrack Works</h2>

            <div className="profile">
                <SolutionComp 
                    icon={profile}
                    text={"Create Your Profile"}
                    solution={"Register safely with encrypted protection to see your vaccines."}
                />

                 <SolutionComp 
                    icon={Schedule}
                    text={"Review Your Schedule"}
                    solution={"See vaccines you should have taken and those you still need."}
                />

                <SolutionComp 
                    icon={track}
                    text={"Stay on Track"}
                    solution={"Mark vaccines as taken and receive reminders for upcoming doses."}
                />
            </div> 
        </div>
    );
}