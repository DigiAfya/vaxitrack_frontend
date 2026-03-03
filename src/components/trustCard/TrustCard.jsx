import "./TrustCard.css";

export function TrustCard ({icon, text}) {
    return (
        <div className="trust-card">
            <img src={icon} alt="icon" />
            <p> {text} </p>
        </div>
    );
}