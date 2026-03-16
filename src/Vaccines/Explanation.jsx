import { useEffect } from 'react';
import ColoredInfo from '../public/pictures/ColoredInfo.svg';
import InfoSquare from '../public/pictures/InfoSquare.svg';
import './Explanation.css';
import Disclaimer from '../public/pictures/Disclaimer.svg';

export function BCG({ onClose }) {

    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>BCG</h2>
                <h5>Bacillus Calmette-Guérin Vaccine</h5>
                <p>The BCG vaccine helps protect against tuerculosis (TB), a serious infection
                    that mainly affects the lungs but can also affect other parts of the body. </p>
                <p>The BCG vaccine is typically given at birth or within the first few weeks of life.</p>
                    <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}

export function pentavelent({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Pentavalent</h2>
                <h5>Pentavalent</h5>
                <p>Protection against Diphtheria, Tetanus, Pertussis(DTP), Hepatitis B (Hep B) and
                    Haemophilus influenzae type B(Hi b)</p>
                <p>Combined vaccine, usually taken by infants at about 6, 10 and 14 weeks in three doses</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function MMR({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>MMR</h2>
                <h5>Mumps, measles and rubella</h5>
                <p>It serves as protection from mumps, measles and rubella(German measles),
                    which are viral diseases.</p>
                <p>Taken at 6 months</p>
               <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function DTPBooster({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>DTP Booster</h2>
                <h5>Diphteria, Tetanus, Pertussis</h5>
                <p>This is booster protection for Diphteria, Tetanus, Pertussis(DTP) and is<br />
                    administered to babies about 15months of age or older. </p>
                <p>Taken at 15 months</p>
               <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function Influenza({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Influenza</h2>
                <h5>Influenza</h5>
                <p>The annual seasonal flu vaccine is he most effective way to prevent influenza and<br />
                    its severe complications. Vaccination is recommended for everyone aged 6<br />
                    months and older, particularly high-risk groups like the elderly, pregnant <br />
                    individuals, and those with chronic conditions </p>
                <p>Recommended for everyone aged 6 months and older.</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function Meningococcal({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Meningococcal ACWY</h2>
                <h5>Meningococcal ACWY</h5>
                <p>A booster vaccine for adolescents that protects against tetanus, diphteria, and<br />
                    pertussis (whooping cough). Recommended at ages 11-12 to maintain immunity<br />
                    from childhood DTP vaccines.</p>
                <p>Recommended at ages 11-12.</p>
              <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function HepatitisB({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Hepatitis B</h2>
                <h5>Hepatitis B</h5>
                <p>It is usually given at birth and protects against Hepatitis B infection, which is a 
                    serious, often chronic, liver infection caused by the Hepatitis B Virus (HBV).</p>
                <p>The vaccine is typically given at birth or within the first few weeks of life.</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}

export function PCV({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>PCV</h2>
                <h5>Pneumococcal Vaccine</h5>
                <p>Pneumococcal disease is a serious infection caused by Streptococcus
                    pneumoniae bacteria, which can lead to pneumonia, meneningitis, bloodstream
                    infections(sepsis) and ear/sinus infections.</p>
                <p>Three doses taken in three doses at about 6, 10 and 14 weeks of age to prevent
                    pneumococcal disease.</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function YellowFever({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Yellow Fever</h2>
                <h5>Yellow Fever</h5>
                <p>It prevents yellow fever, which is an acute viral hemorrhagic disease transmitted
                    by Aedes mosquitoes in tropical Africa and South America</p>
                <p>Usually taken by babies who are 9months old or older.</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function HPV({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>HPV Vaccine</h2>
                <h5>Human Papiloma Virus</h5>
                <p>Protects against Human Papiloma Virus (HPV) which causes almost all cervical<br />
                    cancers, specifically high-risk types 16 an 18, which are responsible for 70% of<br />
                    cases. Prevention is highly effective through the HPV vaccine, which reduces risk<br />
                    by up to 90%, and regular screening (Pap/HPV tests)</p>
                <p>Taken at adolescence age</p>
               <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function Covid({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>COVID-19 vaccine</h2>
                <h5>Corona Virus Disease 2019</h5>
                <p>COVID-19 vaccine causes the immune system to create proteins called antibodies.<br />
                    These proteins fight infection with the COVID-19 virus.</p>
                <p>Taken at adulthood.</p>
               <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}

export function OpvIpv({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>OPV/IPV</h2>
                <h5>Oral Poliovirus Vaccine/Inactivated Poliovirus Vaccine</h5>
                <p>It serves as protection from poliomyelitis, a highly contagious disease caused by
                    poliovirus.</p>
                <p>The Oral polio vaccine is usually taken in three doses at about 6, 19 and 14 weeks
                    of age.</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function Rotavirus({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Rotavirus</h2>
                <h5>Rotavirus</h5>
                <p>It prevents severe diarrhea in infants and young children caused by the rotavirus.</p>
                <p>This vaccination is taken in two doses at about 6 and 10 weeks of age.</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function MCV({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>MCV</h2>
                <h5>Meningitis Vaccine</h5>
                <p>Meningitis is an infection. It causes swelling, called inflammation, of the fluid and
                    membranes around the brain and spinal cord which most often triggers
                    symptoms such as headache, fever and a stiff neck.</p>
                <p>This vaccine can be given as a standalone vaccination at about 1 year of age to 
                    prevent Meningitis.</p>
              <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function Hepatitis({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Hepatitis B</h2>
                <h5>Hepatitis B</h5>
                <p>Adult Hepatitis B protection recommended for all adults who have not previously
                    received the vaccine. It is highly effective and safe, taken in 2- or 3-dose series that
                    provides lifelong protection.</p>
                <p>Taken at adulthood</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}


export function Tdap({ onClose }) {
    return (
        <>
            <div className="vaccine-info-container">
                <img src={ColoredInfo} alt="Info" className="vaccine-info-icon" />
                <h2>Tdap</h2>
                <h5>Tetanus, diphteria and pertussis</h5>
                <p>Booster for tetanus, diphteria and pertussis</p>
                <p>Taken at adolescence age.</p>
                <img src={Disclaimer} alt="Disclaimer"/>
            </div>
        </>
    )
}

const vaccineComponentMap = {
    'BCG': BCG,
    'Hepatitis B Child': HepatitisB,
    'OPV/IPV': OpvIpv,
    'Pentavalent': pentavelent,
    'PCV': PCV,
    'Rotavirus': Rotavirus,
    'MMR': MMR,
    'Yellow Fever': YellowFever,
    'MCV': MCV,
    'DTP Booster': DTPBooster,
    'HPV': HPV,
    'Hepatitis B Adult': Hepatitis,
    'Influenza': Influenza,
    'Covid-19': Covid,
    'Tdap': Tdap,
    'Meningococcal ACWY': Meningococcal,
};

export function VaccineModal({ vaccine, onClose }) {
    const SelectedVaccine = vaccineComponentMap[vaccine];

    useEffect(() => {
        if (!SelectedVaccine) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose, SelectedVaccine]);

    if (!SelectedVaccine) {
        return null;
    }

    return (
        <div className="vaccine-modal-overlay" onClick={onClose} role="presentation">
            <section
                className="vaccine-modal-shell"
                role="dialog"
                aria-modal="true"
                aria-label={vaccine}
                onClick={(event) => event.stopPropagation()}
            >
                <button className="vaccine-modal-close" type="button" onClick={onClose} aria-label="Close vaccine details">
                    ×
                </button>
                <SelectedVaccine onClose={onClose} />
            </section>
        </div>
    );
}
