import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { ProfileContext } from "../context/profileContext";
import { getTemporaryReminders } from "../../Api/reminders";
import writeIcon from "../../public/pictures/image/Write.svg";
import deleteIcon from "../../public/pictures/image/Delete.svg";
import shield from "../../public/pictures/image/shield.svg";
import { Delogout } from "./delogout";
import "../Dashboard/Dash-body/DashBody.css";
import "./Profile.css";

const getAge = (date) => {
    if (!date) return "N/A";

    const today = new Date();
    const birth = new Date(date);

    if (Number.isNaN(birth.getTime())) return "N/A";

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
    }

    return age >= 0 ? age : "N/A";
};

const formatValue = (value) => {
    if (typeof value !== "string") return "N/A";
    if (!value.trim()) return "N/A";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
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

export function Profile() {
    const navigate = useNavigate();
    const { profiles, profilesLoaded, setActiveProfile, removeProfile, dashboardRefreshKey } = useContext(ProfileContext);
    void dashboardRefreshKey; // consumed only to trigger re-render when reminders change
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const loggedInEmail = resolveLoggedInEmail();
    const profileCount = profiles?.length ?? 0;
    const hasTwoOrMoreProfiles = profileCount >= 2;

    if (!profilesLoaded) {
        return null;
    }

    const handleViewVaccines = (profile) => {
        setActiveProfile(profile.id);
        if (profile?.category) {
            localStorage.setItem("activeProfileCategory", profile.category);
        }
        navigate("/vaccines");
    };

    const openDeleteModal = (id) => {
        setSelectedProfileId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (isDeleting) return;
        setIsDeleteModalOpen(false);
        setSelectedProfileId(null);
    };

    const handleDeleteProfile = async () => {
        if (!selectedProfileId) return;
        setIsDeleting(true);
        const result = await removeProfile(selectedProfileId);
        setIsDeleting(false);

        if (!result?.success) {
            alert(result?.message || "Unable to delete profile. Please try again.");
            return;
        }

        closeDeleteModal();
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
                            <section className="switch-profile">
                                <button
                                    className={`switch-button${hasTwoOrMoreProfiles ? ' switch-button-active' : ''}`}
                                    onClick={() => navigate('/switch-profile')}
                                >
                                    Switch Profile
                                </button>
                            </section>
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
                        <section className="switch-profile">
                            <button
                                className={`switch-button${hasTwoOrMoreProfiles ? ' switch-button-active' : ''}`}
                                onClick={() => navigate('/switch-profile')}
                            >
                                Switch Profile
                            </button>
                        </section>
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

                <main className="switch-profile-main">
                    {profiles.slice(0, 4).map((profile) => {
                        const tempReminders = getTemporaryReminders(profile.id);
                        const tempDue = tempReminders.filter((r) => r.status === "due").length;
                        const tempOverdue = tempReminders.filter((r) => r.status === "overdue").length;
                        const total = Number(profile?.total ?? 0) + tempDue + tempOverdue;
                        const due = Number(profile?.due ?? 0) + tempDue;
                        const overdue = Number(profile?.overdue ?? 0) + tempOverdue;

                        return (
                            <article className="profile-card" key={profile.id}>
                                <section className="profile-card-identity">
                                    <div className="profile-identity-left">
                                        <div className="dash-body-avatar">
                                            {profile?.firstName
                                                ? profile.firstName.charAt(0).toUpperCase()
                                                : "U"}
                                        </div>
                                        <div className="profile-identity-text">
                                            <h2 className="profile-card-name">{profile?.firstName || "N/A"}</h2>
                                            <p className="profile-card-age">Age: {getAge(profile.date)}</p>
                                        </div>
                                    </div>

                                    <div className="profile-card-actions">
                                        <button
                                            type="button"
                                            className="icon-action"
                                            aria-label="Edit profile"
                                            onClick={() => navigate(`/edit-profile/${profile.id}`)}
                                        >
                                            <img src={writeIcon} alt="edit" />
                                        </button>
                                        <button
                                            type="button"
                                            className="icon-action"
                                            aria-label="Delete profile"
                                            onClick={() => openDeleteModal(profile.id)}
                                        >
                                            <img src={deleteIcon} alt="delete" />

                                        </button>
                                    </div>
                                </section>

                                <section className="gender-category-grid">
                                    <div className="detail-tile">
                                        <p className="gender-category-label">Gender</p>
                                        <h3 className="gender-category-value">{formatValue(profile.gender)}</h3>
                                    </div>
                                    <div className="detail-tile">
                                        <p className="gender-category-label">Category</p>
                                        <h3 className="gender-category-value">{formatValue(profile.category)}</h3>
                                    </div>
                                </section>

                                <section className="vaccination-status-section">
                                    <p className="vaccination-status-label">Vaccination Status</p>
                                    <div className="status-grid-inline">
                                        <div className="status-item-inline due-status">
                                            <p className="status-number">{due}</p>
                                            <p className="profile-label">Due</p>
                                        </div>
                                        <div className="divider-vertical" id="divider1"></div>
                                        <div className="status-item-inline overdue-status">
                                            <p className="status-number" >{overdue}</p>
                                            <p className="profile-label">Overdue</p>
                                        </div>
                                        <div className="divider-vertical" id="divider2"></div>
                                        <div className="status-item-inline">
                                            <p className="status-number" id="total20">{total}</p>
                                            <p className="profile-label">Total</p>
                                        </div>
                                    </div>
                                </section>

                                <button
                                    type="button"
                                    className="view-vaccines-btn"
                                    onClick={() => handleViewVaccines(profile)}
                                >
                                    View Vaccines
                                </button>
                            </article>
                        );
                    })}
                </main>
            </div>

            <Delogout
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteProfile}
                isDeleting={isDeleting}
            />
        </div>
    );
}