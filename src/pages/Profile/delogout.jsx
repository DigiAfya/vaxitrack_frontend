import deleteIcon from "../../public/pictures/image/Delete.svg";
import "./delogout.css";
import littleDelete from "../../public/pictures/littleDelete.svg";
import logouts from "../../public/pictures/logouts.svg";
import logout1 from "../../public/pictures/logout1.svg";

export function Delogout({
    isOpen,
    onClose,
    onConfirm,
    isDeleting = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="delogout-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-profile-title">
            <div className="delogout-modal">
                <div className="delogout-icon-wrap" aria-hidden="true">
                    <img src={deleteIcon} alt="" className="delogout-icon" />
                </div>

                <h2 id="delete-profile-title" className="delogout-title">Delete profile?</h2>
                <p className="delogout-text">
                    Are you sure you want to delete this profile? This action cannot be <br />
                    undone and all vaccination records will be permanently removed.
                </p>

                <button
                    type="button"
                    className="delogout-btn delogout-btn-danger"
                    onClick={onConfirm}
                    disabled={isDeleting}
                >
                    <img src={littleDelete} alt="" className="delogout-btn-icon" />
                    <span>{isDeleting ? "Deleting..." : "Yes, delete"}</span>
                </button>

                <button
                    type="button"
                    className="delogout-btn delogout-btn-cancel"
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export function Logout({
    isOpen,
    onClose,
    onConfirm,
    isLoggingOut = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="delogout-overlay" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <div className="delogout-modal delogout-modal-drop">
                <div className="delogout-icon-wrap" aria-hidden="true">
                    <img src={logout1} alt="" className="delogout-icon delogout-icon-fill" />
                </div>

                <h2 id="logout-title" className="delogout-title">Are you sure?</h2>
                <p className="delogout-text">
                    Are you sure you want to log out of your account?
                </p>

                <button
                    type="button"
                    className="delogout-btn delogout-btn-danger"
                    onClick={onConfirm}
                    disabled={isLoggingOut}
                >
                    <img src={logouts} alt="" className="delogout-btn-icon" />
                    <span>{isLoggingOut ? "Logging out..." : "Yes, Logout"}</span>
                </button>

                <button
                    type="button"
                    className="delogout-btn delogout-btn-cancel"
                    onClick={onClose}
                    disabled={isLoggingOut}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
