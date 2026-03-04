import "./Dash-header.css";


export function DashHeader({head, description}) {
  return (
    <div className="dash-head">
      <div className="dash-text">
        <h1>{head} </h1>
        <p>{description} </p>
      </div>

        <div className="dash-btn">
          <button type="button" className="lorem">Lorem ipsum</button>
          <button type="button" className="switch">Switch Profile</button>
        </div>
    </div>
  );
}
