import '../General/App.css';
import './VaccineM.css';
import Tick from '../public/pictures/Tick.svg';
import { useEffect, useState } from 'react';

const toDateTimeLocal = (value) => {
    const raw = String(value ?? '').trim();

    if (!raw) {
        return '';
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) {
        return raw;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return `${raw}T09:00`;
    }

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const date = String(parsed.getDate()).padStart(2, '0');
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${date}T${hours}:${minutes}`;
};

export function SetReminderModal({
    isOpen,
    vaccineName,
    onClose,
    onSetReminder,
    initialReminderDate = '',
    title = 'Set a reminder',
    description = 'Set a reminder ahead of time so you do not miss your vaccine date',
    submitLabel = 'Set reminder',
}) {
    const [reminderDate, setReminderDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReminderDate(toDateTimeLocal(initialReminderDate));
        } else {
            setReminderDate('');
        }
    }, [isOpen, initialReminderDate]);

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
                <h2>{title}</h2>
                <p>{description}</p>
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

                    <button type="submit" id="setbtn" className="add-profile-button">{submitLabel}</button>
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