import { Navbar } from "../Navbar/Navbar";
import { DashHeader } from "../Dash-header/Dash-header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createProfile.css";

export function CreateProfile() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gender || !category) {
      alert("Please select gender and category");
      return;
    }

    const profileData = {
      fullName,
      date,
      gender,
      category,
    };

    console.log("Profile Created:", profileData);

    navigate("/dashboard");
  };

  return (
    <div>
      <Navbar />
      <DashHeader
        head="Profile Management"
        description="Manage profiles for yourself and your family"
      />

      <div className="create-profile-wrapper">
        <header>
          <h2>Create Profile</h2>
          <p>Add a profile for yourself or your child</p>
        </header>

        <form className="profile-form" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Gender Buttons */}
          <div className="form-group">
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

          {/* Category Buttons */}
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="create-btn">
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}