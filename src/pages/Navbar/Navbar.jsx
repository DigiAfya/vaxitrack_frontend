
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { ProfileContext } from "../context/profileContext";

import colorIcon from "../../public/pictures/image/colorIcon.svg";
import downarrow from "../../public/pictures/image/downarrow.svg";
import create from "../../public/pictures/image/create.svg";
import switchP from "../../public/pictures/image/switchP.svg";
import Blueswap from "../../public/pictures/image/Blueswap.svg";
import logout from "../../public/pictures/image/logout.svg";
import threeLines from "../../public/pictures/ThreeLines.svg";
import { Logout as LogoutModal } from "../Profile/delogout";

import "./Navbar.css";


const getNavbarInitials = (profile) => {
  if (!profile) return "";
  const first = String(profile.firstName ?? "").trim();
  const last = String(profile.lastName ?? "").trim();
  if (first && last) return (first[0] + last[0]).toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  return "?";
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const { profiles, activeProfile } = useContext(ProfileContext);
  const activeProfileData =
    profiles.find((p) => p.id === activeProfile) ?? profiles[0] ?? null;
  const navbarInitials = getNavbarInitials(activeProfileData);
  const hasProfile = profiles.length > 0;

  // Ref for detecting outside clicks
  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
    closeMobileMenu();
    setOpen(false);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isProfileRoute =
    location.pathname === "/profile" ||
    location.pathname === "/create-profile" ||
    location.pathname === "/switch-profile" ||
    location.pathname === "/delete-profile" ||
    location.pathname.startsWith("/edit-profile/");

  return (
    <nav className="navbar-container" ref={navRef}>
      <div className="logo">
        <img src={colorIcon} alt="logo" />
      </div>

      <div className="mobile-right">
        {hasProfile && (
          <div className="user-avatar user-avatar--mobile" aria-label={`Active profile: ${activeProfileData?.firstName ?? ""}`}>
            {navbarInitials}
          </div>
        )}
        <button
          type="button"
          className="menuToggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <img src={threeLines} alt="menu" />
        </button>
      </div>

      <ul className={`dash-nav ${isMobileMenuOpen ? "open" : ""}`}>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            onClick={closeMobileMenu}
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/vaccines"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            onClick={closeMobileMenu}
          >
            Vaccines
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reminder"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            onClick={closeMobileMenu}
          >
            Reminder
          </NavLink>
        </li>

        {/* Profile with dropdown */}

        <li className="profile-menu" ref={dropdownRef}>
          <div className="profile-trigger-row">
            <NavLink
              to="/profile"
              className={`navbar-link profile-link-label ${isProfileRoute ? "active" : ""}`}
              onClick={() => {
                closeMobileMenu();
                setOpen(false);
              }}
            >
              Profile
            </NavLink>
            <button
              type="button"
              className="profile-toggle"
              aria-label="Toggle profile menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <img
                src={downarrow}
                alt="arrow"
                className={open ? "rotate" : ""}
              />
            </button>
          </div>

          {open && (
            <div className="dropdown">
              <div className="create"
                onClick={() => {
                  navigate("/create-profile");
                  closeMobileMenu();
                  setOpen(false);
                }}
              >
                <img src={create} alt="create profile" className="Prof1" />
                <span className="Prof2">Create new profile</span>
              </div>

              <div className="switchp"
                onClick={() => {
                  navigate("/switch-profile");
                  closeMobileMenu();
                  setOpen(false);
                }}
              >
                <img src={switchP} alt="switch profile" className="Prof1" />
                <span className="Prof2">Switch Profiles</span>
              </div>

              <div className="delete"
                onClick={() => {
                  navigate("/reset");
                  closeMobileMenu();
                  setOpen(false);
                }}
              >
                <img src={Blueswap} alt="delete profile" className="Prof1" />
                <span className="Prof2">Change Password</span>
              </div>

              <div className="logout"
                onClick={openLogoutModal}
              >
                <img src={logout} alt="logout" className="Prof1" />
                <span className="Prof2">Logout</span>
              </div>
            </div>
          )}



        </li>
      </ul>

      {hasProfile && (
        <div className="user-avatar" aria-label={`Active profile: ${activeProfileData?.firstName ?? ""}`}>
          {navbarInitials}
        </div>
      )}

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
      />
    </nav>
  );
}