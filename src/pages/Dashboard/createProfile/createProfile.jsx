import { Navbar } from "../../Navbar/Navbar";
import { DashHeader } from "../Dash-header/Dash-header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Success } from "../success/Success.jsx";
import "./createProfile.css";
import { useContext } from "react";
import { ProfileContext } from "../../context/profileContext.jsx";
import { useNotification } from "../../../Notifications/NotificationContext";

export function CreateProfile() {
  const navigate = useNavigate();
  const { addProfile, profiles } = useContext(ProfileContext);
  const { notify } = useNotification();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");


  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const first = firstName.trim();
    const middle = middleName.trim();
    const last = lastName.trim();

    if (profiles.length >= 4) {
      alert("Maximum of 4 profiles allowed");
      return;
    }

    if (first.length < 3 || last.length < 3) {
      alert("First name and last name must be at least 3 characters.");
      return;
    }

    if (middle.length > 0 && middle.length < 3) {
      alert("Middle name must be at least 3 characters when provided.");
      return;
    }

    if (!gender || !category) {
      alert("Please select gender and category");
      return;
    }

    const profileData = {
      id: Date.now(),
      firstName: first,
      middleName: middle,
      lastName: last,
      date,
      gender,
      category,
    };

    setIsSubmitting(true);
    const result = await addProfile(profileData);
    setIsSubmitting(false);

    if (!result?.success) {
      notify.error(result?.message || "Unable to create profile. Please check your details or try again.");
      return;
    }

    localStorage.setItem('activeProfileCategory', category);
    console.log("Profile Created:", profileData);
    notify.success('Profile created for ' + first + ' ' + last);

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate("/vaccines");
    }, 2000);
  };

  return (
    <div className="create-profile-body">
      <Navbar />
      <DashHeader
        head="Profile Management"
        description="Manage profiles for yourself and your family"
      />

      <div className="create-profile-wrapper">
        <button className="close-btn" onClick={() => navigate("/dashboard")} aria-label="Close">
          &times;
        </button>

        <div className="form-profile-">
          <header className="profile-form-header">
            <h2>Create Profile</h2>
            <p>Add a profile for yourself or your child</p>
          </header>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter first name"
                required
                minLength={3}
                maxLength={100}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>
                Middle Name{" "}
                <span style={{ color: "#888", fontSize: "0.9em" }}>
                  (optional)
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter middle name (optional)"
                maxLength={100}
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter last name"
                required
                minLength={3}
                maxLength={100}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-input"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group gender">
              <label>Gender</label>
              <div className="button-group">
                <button
                  type="button"
                  className={gender === "male" ? "active-btn" : ""}
                  onClick={() => setGender("male")}
                >
                  Male
                </button>

                <button
                  type="button"
                  className={gender === "female" ? "active-btn" : ""}
                  onClick={() => setGender("female")}
                >
                  Female
                </button>

                <button
                  type="button"
                  className={gender === "na" ? "active-btn" : ""}
                  onClick={() => setGender("na")}
                >
                  Prefer not to say
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <div className="button-group">
                <button
                  type="button"
                  className={category === "child" ? "active-btn" : ""}
                  onClick={() => setCategory("child")}
                >
                  Child (Under 18)
                </button>

                <button
                  type="button"
                  className={category === "adult" ? "active-btn" : ""}
                  onClick={() => setCategory("adult")}
                >
                  Adult (18+)
                </button>

                <button
                  type="button"
                  className={category === "adolescent" ? "active-btn" : ""}
                  onClick={() => setCategory("adolescent")}
                >
                  Adolescent
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button type="submit" className="create-btn-profile" disabled={profiles.length >= 4 || isSubmitting}>
                {profiles.length >= 4 ? "Profile Limit Reached" : isSubmitting ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="success-overlay">
          <Success />
        </div>
      )}
    </div>
  );
}
