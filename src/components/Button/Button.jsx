export function Button ({text, className }) {
    return(
        <div>
            <button className={className}>
                {text}
            </button>
        </div>
    );
}