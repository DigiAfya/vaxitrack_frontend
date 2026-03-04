import './Button.css';

export function Button({ text, className, onClick }) {
    return (
        <div>
            <button className={`button ${className ?? ''}`.trim()} onClick={onClick} >
                {text}
            </button>
        </div>
    );
}