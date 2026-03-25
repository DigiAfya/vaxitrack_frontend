import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Navbar/Navbar";
import { ProfileContext } from "../../context/profileContext";
import shield from "../../../public/pictures/image/shield.webp";
import "../Dash-body/DashBody.css";
import "./SwitchProfile.css";

const getAgeText = (date) => {
    if (!date) return "N/A";
    const today = new Date();
    const birth = new Date(date);
    if (Number.isNaN(birth.getTime())) return "N/A";
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        years -= 1;
    }

    if (years < 1) {
        const totalMonths =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth()) -
            (today.getDate() < birth.getDate() ? 1 : 0);

        if (totalMonths < 0) return "N/A";
        return totalMonths === 1 ? "1 month old" : `${totalMonths} months old`;
    }

    return years === 1 ? "1 year old" : `${years} years old`;
};

const decodeJwtPayload = (token) => {
    if (typeof token !== "string" || !token.includes(".")) {
        return null;
    }

    try {
        const payloadBase64Url = token.split(".")[1];
        if (!payloadBase64Url) return null;

        const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const decoded = window.atob(padded);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

const persistResolvedEmail = (value) => {
    const normalizedEmail = String(value ?? "").trim();

    if (!normalizedEmail.includes("@")) {
        return "";
    }

    localStorage.setItem("userEmail", normalizedEmail);
    localStorage.setItem("email", normalizedEmail);
    localStorage.setItem("loggedInEmail", normalizedEmail);

    return normalizedEmail;
};

const resolveLoggedInEmail = () => {
    const directCandidates = [
        localStorage.getItem("userEmail"),
        localStorage.getItem("email"),
        localStorage.getItem("loggedInEmail"),
    ];

    const directEmail = directCandidates.find(
        (candidate) => typeof candidate === "string" && candidate.includes("@")
    );

    if (directEmail) {
        return persistResolvedEmail(directEmail);
    }

    try {
        const googleRaw = localStorage.getItem("googleUser");
        const googleUser = JSON.parse(googleRaw ?? "{}");
        if (typeof googleUser?.email === "string" && googleUser.email.includes("@")) {
            return persistResolvedEmail(googleUser.email);
        }
    } catch {
    }

    const accessToken = localStorage.getItem("accessToken");
    const jwtPayload = decodeJwtPayload(accessToken);
    const jwtEmailCandidates = [
        jwtPayload?.email,
        jwtPayload?.email_address,
        jwtPayload?.mail,
        jwtPayload?.user_email,
        jwtPayload?.preferred_username,
        jwtPayload?.upn,
        jwtPayload?.unique_name,
        jwtPayload?.sub,
    ];

    const jwtEmail = jwtEmailCandidates.find(
        (candidate) => typeof candidate === "string" && candidate.includes("@")
    );

    if (jwtEmail) {
        return persistResolvedEmail(jwtEmail);
    }

    return "No email found";
};

const getDisplayName = (profile) => {
    const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim();
    return fullName || profile?.firstName || "N/A";
};

export function SwitchProfile() {
    const navigate = useNavigate();
    const { profiles, profilesLoaded, activeProfile, setActiveProfile } = useContext(ProfileContext);
    const loggedInEmail = resolveLoggedInEmail();
    const profileCount = profiles?.length ?? 0;

    if (!profilesLoaded) {
        return null;
    }

    const currentProfile = profiles?.find((profile) => profile.id === activeProfile) ?? profiles?.[0] ?? null;
    const otherProfiles = (profiles ?? []).filter((profile) => profile.id !== currentProfile?.id);

    const handleSwitchProfile = (profile) => {
        setActiveProfile(profile.id);
        if (profile?.category) {
            localStorage.setItem("activeProfileCategory", profile.category);
        }
    };

    if (!profiles || profiles.length === 0) {
        return (
            <div className="switch-profile-page">
                <Navbar />
                <div className="Vaccines-page">
                    <div className="vaccines-content">
                        <section className="vaccines-intro">
                            <div className="vaccines-intro-text">
                                <h1>Profile Management</h1>
                                <p>Manage profiles for yourself and your family</p>
                            </div>
                        </section>
                    </div>

                    <main className="switch-body">
                        <section className="vaccine-container">
                            <img src={shield} alt="" className="vaccine-image" />
                            <h2 className="No-Vaccine">No Profiles Yet</h2>
                            <p className="vaccine-description">Create a profile for yourself or your child to start <br />
                                tracking vaccination</p>
                            <button type="button" className="add-profile-button" onClick={() => navigate('/create-profile')}>
                                Create Your First Profile
                            </button>
                        </section>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="switch-profile-page">
            <Navbar />
            <div className="Vaccines-page">
                <div className="vaccines-content">
                    <section className="vaccines-intro">
                        <div className="vaccines-intro-text">
                            <h1>Profile Management</h1>
                            <p>Manage profiles for yourself and your family</p>
                        </div>
                    </section>
                </div>

                <section className="ProfileEmail">
                    <div className="profile-email-header">
                        <p className="Profile1">Profiles</p>
                    </div>
                    <div className="profile-email-summary">
                        <p className="profile-email-text">{loggedInEmail}</p>
                        <p className="profile-email-count">
                            Managing {profileCount} {profileCount === 1 ? "profile" : "profiles"}.
                        </p>
                    </div>
                </section>

                <main className="switch-profile-main switch-profile-main-centered">
                    <h2 className="switch-selector-title" id="sst">Switch Profiles</h2>
                    <section className="switch-selector-card">

                        <div className="switch-profile-section">
                            <p className="switch-profile-section-label" id="sst2">Current profile</p>
                            <div className="switch-profile-row switch-profile-row-current">
                                <div className="switch-profile-avatar switch-profile-avatar-current">
                                    {currentProfile?.firstName?.charAt(0).toUpperCase() ?? "U"}
                                </div>
                                <div className="switch-profile-info">
                                    <h2 className="switch-profile-name">{getDisplayName(currentProfile)}</h2>
                                    <p className="switch-profile-age">{getAgeText(currentProfile?.date)}</p>
                                </div>
                            </div>
                        </div>

                        {otherProfiles.length > 0 && (
                            <div className="switch-profile-section switch-profile-section-list">
                                <p className="switch-profile-section-label" id="sst3">Switch to</p>
                                {otherProfiles.map((profile) => (
                                    <button
                                        type="button"
                                        key={profile.id}
                                        className={`switch-profile-row switch-profile-row-button${profile.id === activeProfile ? " is-highlighted" : ""}`}
                                        onClick={() => handleSwitchProfile(profile)}
                                    >
                                        <div className="switch-profile-avatar switch-profile-avatar-other">
                                            {profile.firstName?.charAt(0).toUpperCase() ?? "U"}
                                        </div>
                                        <div className="switch-profile-info">
                                            <p className="switch-profile-name">{getDisplayName(profile)}</p>
                                            <p className="switch-profile-age">{getAgeText(profile.date)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
