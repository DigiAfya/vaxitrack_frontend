import { SearchCard } from "../SearchCard/SearchCard";
import "./Section.css"
export function Section() {
  return (
    <div className="section-why">
      <h2 >Why Vaccine Tracking Matters</h2>
      <p>
        Without reminders or clear guidance, important immunisations may be <br />
        delayed or missed, leaving children and adults unprotected.
      </p>

      <div className="search-section">
        <SearchCard className="card" title="Lost Records" description="Paper vaccination cards can be misplaced or destroyed." />
        <SearchCard className="card" title="Missed Dates" description="Without reminders, vaccine schedules are easy to forget." />
        <SearchCard className="card" title="Vaccine Uncertainty" description="Many families are unsure which vaccines are recommended." />
      </div>
    </div>
  );
}
