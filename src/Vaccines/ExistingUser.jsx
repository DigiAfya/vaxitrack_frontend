import { useState } from 'react';
import '../General/App.css';
import './Vaccines.css';
import './ExistingUser.css';
import PlusBlack from '../public/pictures/PlusBlack.svg';
import PlusGrey from '../public/pictures/PlusGrey.svg';
import Search from '../public/pictures/Search.svg';
import { Navboard } from './Vaccines';
import { VaccineModal } from './Explanation';

export function ExistingProfile() {
    const [selectedVaccine, setSelectedVaccine] = useState(null);

    const handleVaccineClick = (event) => {
        const btn = event.target.closest('.V_N');
        if (!btn) return;

        const vaccineLabel = btn.textContent.trim();
        const row = btn.closest('tr');
        const categoryText = row?.children?.[2]?.textContent?.trim().toLowerCase();

        if (vaccineLabel === 'Hepatitis B') {
            setSelectedVaccine(categoryText === 'adult' ? 'Hepatitis B Adult' : 'Hepatitis B Child');
            return;
        }

        setSelectedVaccine(vaccineLabel);
    };

    return (
        <>
            <Navboard />
            <main>
                <div className="Vaccines-page">
                    <div className="vaccines-content existing-user-content">
                        <section className="vaccines-intro existing-user-intro">
                            <div className="vaccines-intro-text">
                                <h1>Vaccines</h1>
                                <p>Learn about different vaccines, their benefits, <br />
                                    and recommended schedules</p>
                            </div>
                            <section className="search-vaccine">
                                <input type="text" className="search-input" placeholder="Search vaccines by name or description..." />
                                <img src={Search} alt="" id="search-icon" />
                            </section>
                        </section>
                        <div className="vaccines-table-container">
                            <div className='existing-user-instruction'>
                                <p>Click on each vaccine to learn more</p>
                            </div>
                            <section className="existing-user-table-section">
                                <table className="vaccines-table" onClick={handleVaccineClick}>
                                    <thead>
                                        <tr>
                                            <th className='thead1'><h5>Vaccine Name</h5></th>
                                            <th className='thead2'><h5>Age Range</h5></th>
                                            <th className='thead3'><h5>Category</h5></th>
                                            <th className='thead4'><h5>Type</h5></th>
                                            <th className='thead5'><h5>Doses</h5></th>
                                            <th className='thead6'><h5>Add</h5></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><button className='V_N'>BCG</button></td>
                                            <td>At birth</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>1 dose</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Hepatitis B</button></td>
                                            <td>At birth</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>1 dose</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>OPV/IPV</button></td>
                                            <td>6 weeks</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>3 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Pentavalent</button></td>
                                            <td>6 weeks</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>3 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>PCV</button></td>
                                            <td>6 weeks</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>3 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Rotavirus</button></td>
                                            <td>6 weeks to 6 months</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>2 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>MMR</button></td>
                                            <td>6 months</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>1 dose</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Yellow Fever</button></td>
                                            <td>9 months</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>1 dose</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>MCV</button></td>
                                            <td>12 months</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>1 dose</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>DTP Booster</button></td>
                                            <td>15 months</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>3 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>HPV</button></td>
                                            <td> 9-14 years</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Compulsory</span></td>
                                            <td>2 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Hepatitis B</button></td>
                                            <td>18 and above</td>
                                            <td><span className='Child'>Adult </span></td>
                                            <td><span className='Compulsory'>Not Compulsory</span></td>
                                            <td>3 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Influenza</button></td>
                                            <td>18 and above</td>
                                            <td><span className='Child'>Adult </span></td>
                                            <td><span className='Compulsory'>Not Compulsory</span></td>
                                            <td>5 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Covid-19</button></td>
                                            <td>18 and above</td>
                                            <td><span className='Child'>Adult </span></td>
                                            <td><span className='Compulsory'>Not Compulsory</span></td>
                                            <td>1 dose</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Tdap</button></td>
                                            <td>11-12 years</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Not Compulsory</span></td>
                                            <td>1 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><button className='V_N'>Meningococcal ACWY</button></td>
                                            <td>11-12 years</td>
                                            <td><span className='Child'>Child </span></td>
                                            <td><span className='Compulsory'>Not Compulsory</span></td>
                                            <td>2 doses</td>
                                            <td><img src={PlusBlack} alt="Add" />
                                                <img src={PlusGrey} alt="Add" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    </div>
                </div>
                {selectedVaccine && (
                    <VaccineModal
                        vaccine={selectedVaccine}
                        onClose={() => setSelectedVaccine(null)}
                    />
                )}
            </main>
        </>
    )
}