import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import colorIcon from "../../public/pictures/VaxitrackLogo.svg";
import downarrow from "../../public/pictures/plus.svg";
import create from "../../public/pictures/plus.svg";
import switchP from "../../public/pictures/plus.svg";
import deleteP from "../../public/pictures/plus.svg";
import logout from "../../public/pictures/plus.svg";

import "./Navbar.css";

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Ref for detecting outside clicks
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar-container">
      <div className="logo">
        <img src={colorIcon} alt="logo" />
      </div>

      <ul className="dash-nav">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
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
          >
            Reminder
          </NavLink>
        </li>

        {/* Profile with dropdown */}
        <li className="profile-menu" ref={dropdownRef}>
          <div
            className="navbar-link"
            onClick={() => setOpen(!open)}
          >
            Profile
            <img
              src={downarrow}
              alt="arrow"
              className={open ? "rotate" : ""}
            />
          </div>

          {open && (
            <div className="dropdown">
              <NavLink
                to="/create-profile"
                className="create"
                onClick={() => setOpen(false)}
              >
                <img src={create} alt="create profile" />
                Create New Profile
              </NavLink>

              <NavLink
                to="/switch-profile"
                className="switchp"
                onClick={() => setOpen(false)}
              >
                <img src={switchP} alt="switch profile" />
                Switch Profile
              </NavLink>

              <NavLink
                to="/delete-profile"
                className="delete"
                onClick={() => setOpen(false)}
              >
                <img src={deleteP} alt="delete profile" />
                Delete Profile
              </NavLink>

              <NavLink
                to="/"
                className="logout"
                onClick={() => setOpen(false)}
              >
                <img src={logout} alt="logout" />
                Logout
              </NavLink>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}