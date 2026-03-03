import "./SolutionComp.css";

export function SolutionComp({ icon, text, solution }) {
  return (
    <div className="solution-comp">
      <img src={icon} alt={text} className="solution-icon" />
      <h4 className="solution-title">{text}</h4>
      <p className="solution-text">{solution}</p>
    </div>
  );
}
