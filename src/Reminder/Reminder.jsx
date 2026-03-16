import { Navboard } from '../Vaccines/Vaccines';
import Bell from '../public/pictures/Gbell.svg';
import './Reminder.css';
import Bmessage from '../public/pictures/Bmessage.svg';
import Time from '../public/pictures/Time.svg';
import Obell from '../public/pictures/Obell.svg';


export function Reminder() {
    return (
        <div className="reminder">
            <Navboard />
            <main >
                <div className="reminder-content">
                    <h2>Vaccination Reminders</h2>
                    <p> Never miss a vaccination date</p>
                    <img src={Bell} alt="Bell Icon" className="bell-icon" />
                </div>
                <section className="reminder-section">
                    <h2>Set Up Your First Reminder</h2>
                    <p>Take control of your health journey. Craete personlized reminders<br />
                        and never miss an important vaccination appointment again</p>
                    <button className="set-reminder-button">Create Your First Reminder</button>
                </section>
                <div className='infoBox'>
                    <section className="multiple-channels">
                        <h5>Multiple Channels</h5>
                        <p>Choose from emails,<br />
                            SMS or push<br />
                            notifications to receive<br />
                            reminders.</p>
                        <img src={Bmessage} alt="" className="Bmessage-icon" />
                    </section>
                    <section className="Perfect-Timing">
                        <h5>Perfect Timing</h5>
                        <p>Set reminders from 1 day to 1 month before vaccination due date.</p>
                        <img src={Time} alt="" className="Time-icon" />
                    </section>
                    <section className="Stay-On-Track">
                        <h5>Stay On Track</h5>
                        <p>Manage all your vaccinations in one place and stay protected.</p>
                        <img src={Obell} alt="" className="Obell-icon" />
                    </section>
                </div>
            </main>
        </div>
    );
}