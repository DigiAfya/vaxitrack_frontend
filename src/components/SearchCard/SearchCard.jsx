import Search from "../../image/Search.svg";
import "./SearchCard.css";
export function SearchCard({ title, description, className= "" }) {
  return (
    <div className={`search-card ${className}`} >
      <img src={Search} alt="search icon" className="search-icon" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
