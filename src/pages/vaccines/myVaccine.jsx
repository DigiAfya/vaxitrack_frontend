import "./myVaccine.css";
import due from "../../public/pictures/image/due.svg";
import circle from "../../public/pictures/image/circle.svg"
import { useState } from "react";

export function MyVaccine ({header, text, onMarkTaken}) {
   
     const [taken, setTaken] = useState(false);

  function handleTaken() {
    setTaken(true);

    if (onMarkTaken) {
      onMarkTaken();   
    }
  }
   
    return (
        
        <div className="vaccine-com-container">
            <div className="vaccine-left">
                <div className="com-header">
                    <h2>{header} </h2>
                    <p className="compulsory">Compulsory</p>
                </div>

                <p>{text} </p>

                <div className="due-now">
                    <img src={due} alt="due vaccine" />
                    <p>Due Now</p>
                </div>
            </div>

           <div
        className={`mark-taken ${taken ? "active" : ""}`}
        onClick={handleTaken}
      >
                <div className="taken-circle"></div>
                <p>Mark as Taken</p>
            </div>
        </div>
    );
}