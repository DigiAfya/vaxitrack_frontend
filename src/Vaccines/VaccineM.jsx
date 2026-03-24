import '../General/App.css';
import './VaccineM.css';
import Tick from '../public/pictures/Tick.svg';
import { useEffect, useState } from 'react';

export function SetReminderModal({ isOpen, vaccineName, onClose, onSetReminder }) {
    const [reminderDate, setReminderDate] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setReminderDate('');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${date}T${hours}:${minutes}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!reminderDate) {
            return;
        }
        onSetReminder(reminderDate);
    };

    return (
        <div className="reminder-modal-overlay" role="dialog" aria-modal="true">
            <div className="reminder-modal-card">
                <div className='closeBtn'>
                    <button type="button" className="reminder-modal-close" onClick={onClose} aria-label="Close reminder modal">×</button>
                </div>
                <h2>Set a reminder</h2>
                <p>Set a reminder ahead of time so you do not<br />
                    miss your vaccine date</p>
                <form onSubmit={handleSubmit} className="reminder-form">
                    <label htmlFor="vaccine-name">Vaccine name</label>
                    <input
                        type="text"
                        id="vaccine-name"
                        name="vaccine-name"
                        value={vaccineName}
                        disabled
                    />

                    <label htmlFor="reminder-date">Choose reminder date</label>
                    <input
                        type="datetime-local"
                        id="reminder-date"
                        name="reminder-date"
                        value={reminderDate}
                        onChange={(event) => setReminderDate(event.target.value)}
                        required
                        placeholder='dd/mm/yyyy'
                        min={getCurrentDateTimeLocal()}
                    />

                    <button type="submit" id="setbtn" className="add-profile-button">Set reminder</button>
                </form>
            </div>
        </div>
    );
}

export function ReminderSuccessModal({ isOpen, vaccineName, onClose }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="reminder-c" role="dialog" aria-modal="true">
            <div className="reminder-modal" id="reminder-s">
                <img src={Tick} alt="" className="TickIcon" />
                <h2 id='s2'>Success</h2>
                <p>{vaccineName} reminder was set and added successfully.<br />
                    Check your dashboard to see updated list.</p>
                <button type="button" className="add-profile-button" onClick={onClose}>Great!</button>
            </div>
        </div>
    );
}