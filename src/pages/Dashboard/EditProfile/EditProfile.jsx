import { Navbar } from "../../Navbar/Navbar.jsx";
import { DashHeader } from "../Dash-header/Dash-header.jsx";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Success } from "../success/Success.jsx";
import "../createProfile/createProfile.css";
import { ProfileContext } from "../../context/profileContext.jsx";

export function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profiles, updateProfile } = useContext(ProfileContext);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const profile = profiles.find((p) => p.id === Number(id));
    if (profile) {
      setFirstName(profile.firstName || "");
      setMiddleName(profile.middleName || "");
      setLastName(profile.lastName || "");
      setDate(profile.date);
      setGender(profile.gender);
      setCategory(profile.category);
    }
  }, [id, profiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const first = firstName.trim();
    const middle = middleName.trim();
    const last = lastName.trim();

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

    const updatedProfile = {
      id: Number(id),
      firstName: first,
      middleName: middle,
      lastName: last,
      date,
      gender,
      category,
    };

    const result = await updateProfile(updatedProfile);
    if (!result?.success) {
      alert(result?.message || "Unable to update profile. Please try again.");
      return;
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="create-profile-body">
      <Navbar />
      <DashHeader
        head="Edit Profile"
        description="Update your profile information"
      />

      <div className="create-profile-wrapper">
        <button className="close-btn" onClick={() => navigate("/dashboard")} aria-label="Close">
          &times;
        </button>

        <div className="form-profile-">
          <header className="profile-form-header">
            <h2>Edit Profile</h2>
            <p>Update existing info on your profile</p>
          </header>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                minLength={3}
                maxLength={100}
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
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
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

              <button type="submit" className="create-btn-profile">
                Save Update
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
