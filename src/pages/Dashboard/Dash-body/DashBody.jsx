import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { ProfileContext } from "../../context/profileContext.jsx";
import { Button } from "../../../LandingPage/Button/Button.jsx";
import { api } from "../../../Api/api.js";
import shield from "../../../public/pictures/image/shield.svg";
import taken from "../../../public/pictures/image/taken.svg";
import due from "../../../public/pictures/image/due.svg";
import overdue from "../../../public/pictures/image/overdue.svg";
import plus from "../../../public/pictures/image/plus.svg";
import edit from "../../../public/pictures/image/edit.svg";
import share from "../../../public/pictures/image/share.svg";
import Btime from "../../../public/pictures/BTime.svg";
import "./DashBody.css";

/* 🔥 SINGLE SOURCE OF TRUTH */
const getFullName = (profile) =>
  [profile?.firstName, profile?.middleName, profile?.lastName]
    .filter(Boolean)
    .join(" ");

const TEMP_REMINDERS_KEY = "temporaryDashboardReminders";

export function DashBody() {
  const navigate = useNavigate();

  const { profiles, profilesLoaded, activeProfile, setActiveProfile, dashboardRefreshKey } =
    useContext(ProfileContext);

  const [activeStatus, setActiveStatus] = useState("all");
  const [dashboardData, setDashboardData] = useState({ taken: [], due: [], overdue: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [takenToggleByCard, setTakenToggleByCard] = useState({});

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeProfile) ?? null,
    [profiles, activeProfile]
  );

  const normalizeStatusItems = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map((item, index) => ({
      id: item?.vaccine_id ?? `${item?.Vaccine?.name ?? "vaccine"}-${index}`,
      name: item?.Vaccine?.name ?? item?.name ?? "Vaccine",
      subtitle:
        item?.Vaccine?.age_range ??
        item?.recommended_age ??
        item?.status ??
        "Vaccination record",
      status: item?.status ?? "",
    }));
  };

  const normalizeRecommendations = (payload) => {
    const source = payload?.data?.data ?? payload?.data ?? payload;

    if (Array.isArray(source)) {
      return source.map((item, index) => ({
        id: item?.recommendation_id ?? item?.vaccine_id ?? `recommendation-${index}`,
        name: item?.Vaccine?.name ?? item?.name ?? item?.title ?? "Recommendation",
        subtitle: item?.message ?? item?.description ?? item?.reason ?? "Recommended for this profile",
      }));
    }

    if (Array.isArray(source?.recommendations)) {
      return source.recommendations.map((item, index) => ({
        id: item?.recommendation_id ?? item?.vaccine_id ?? `recommendation-${index}`,
        name: item?.Vaccine?.name ?? item?.name ?? item?.title ?? "Recommendation",
        subtitle: item?.message ?? item?.description ?? item?.reason ?? "Recommended for this profile",
      }));
    }

    return [];
  };

  const buildFallbackStatusItems = (count, status) => {
    const safeCount = Math.max(0, Number(count) || 0);

    return Array.from({ length: safeCount }, (_, index) => ({
      id: `fallback-${status}-${index + 1}`,
      name: `Vaccine ${index + 1}`,
      subtitle: "Details unavailable until backend date/time fields are fixed",
      status,
    }));
  };

  const buildFallbackDashboardData = (profile) => {
    const total = Math.max(0, Number(profile?.total) || 0);
    const due = Math.max(0, Number(profile?.due) || 0);
    const overdue = Math.max(0, Number(profile?.overdue) || 0);
    const taken = Math.max(0, total - due - overdue);

    return {
      taken: buildFallbackStatusItems(taken, "taken"),
      due: buildFallbackStatusItems(due, "due"),
      overdue: buildFallbackStatusItems(overdue, "overdue"),
    };
  };

  const getTemporaryDueReminders = (profileId) => {
    const safeProfileId = Number(profileId);
    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(TEMP_REMINDERS_KEY);
      const parsed = JSON.parse(raw ?? "[]");
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item) => Number(item?.profileId) === safeProfileId)
        .map((item, index) => ({
          id: item?.id ?? `temp-reminder-${safeProfileId}-${index + 1}`,
          name: item?.vaccineName ?? "Vaccine",
          subtitle: item?.dueDate
            ? `Reminder set for ${item.dueDate}`
            : "Reminder set",
          status: "due",
        }));
    } catch {
      return [];
    }
  };

  const cleanupTemporaryDueReminders = (profileId, dueItems) => {
    const safeProfileId = Number(profileId);
    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0) {
      return;
    }

    if (!Array.isArray(dueItems) || dueItems.length === 0) {
      return;
    }

    const backendDueNames = new Set(
      dueItems
        .map((item) => String(item?.name ?? "").trim().toLowerCase())
        .filter(Boolean)
    );

    if (backendDueNames.size === 0) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(TEMP_REMINDERS_KEY);
      const parsed = JSON.parse(raw ?? "[]");

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return;
      }

      const nextList = parsed.filter((item) => {
        const itemProfileId = Number(item?.profileId);

        if (itemProfileId !== safeProfileId) {
          return true;
        }

        const normalizedName = String(item?.vaccineName ?? "").trim().toLowerCase();
        return !backendDueNames.has(normalizedName);
      });

      if (nextList.length !== parsed.length) {
        window.localStorage.setItem(TEMP_REMINDERS_KEY, JSON.stringify(nextList));
      }
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (!activeProfile && profiles.length > 0) {
      setActiveProfile(profiles[0].id);
    }
  }, [activeProfile, profiles, setActiveProfile]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      if (!activeProfile) {
        if (isMounted) {
          setDashboardData({ taken: [], due: [], overdue: [] });
          setRecommendations([]);
          setDashboardError("");
        }
        return;
      }

      const token = window.localStorage.getItem("accessToken");
      if (!token) {
        if (isMounted) {
          setDashboardData({ taken: [], due: [], overdue: [] });
          setRecommendations([]);
          setDashboardError("You are not authenticated. Please sign in again.");
        }
        return;
      }

      const profileId = Number(activeProfile);
      if (!Number.isFinite(profileId) || profileId <= 0) {
        if (isMounted) {
          setDashboardData({ taken: [], due: [], overdue: [] });
          setRecommendations([]);
          setDashboardError("Invalid profile selected. Please switch profile and try again.");
        }
        return;
      }

      setLoadingDashboard(true);
      setDashboardError("");

      const dashboardEndpoint = `/api/v1/dashboard/${profileId}`;
      const recommendationEndpoint = `/api/v1/recommendations/${profileId}`;

      const dashboardRequest = api.get(dashboardEndpoint);
      const recommendationRequest = api.get(recommendationEndpoint);

      const [dashboardResult, recommendationResult] = await Promise.allSettled([
        dashboardRequest,
        recommendationRequest,
      ]);

      if (!isMounted) return;

      if (dashboardResult.status === "fulfilled") {
        const payload = dashboardResult.value?.data?.data ?? {};
        const normalizedDashboardData = {
          taken: normalizeStatusItems(payload?.taken),
          due: normalizeStatusItems(payload?.due),
          overdue: normalizeStatusItems(payload?.overdue),
        };

        cleanupTemporaryDueReminders(profileId, normalizedDashboardData.due);
        setDashboardData({
          taken: normalizedDashboardData.taken,
          due: normalizedDashboardData.due,
          overdue: normalizedDashboardData.overdue,
        });
      } else {
        setDashboardData(buildFallbackDashboardData(selectedProfile));
        setDashboardError("Unable to load full dashboard details right now.");
      }

      if (recommendationResult.status === "fulfilled") {
        setRecommendations(normalizeRecommendations(recommendationResult.value));
      } else {
        setRecommendations([]);
      }

      setLoadingDashboard(false);
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [activeProfile, dashboardRefreshKey, selectedProfile]);

  const allDashboardItems = useMemo(
    () => [...dashboardData.due, ...dashboardData.overdue, ...dashboardData.taken],

    [dashboardData]
  );

  const dashboardDataWithTemporaryReminders = useMemo(() => {
    const tempDueItems = getTemporaryDueReminders(activeProfile);

    if (tempDueItems.length === 0) {
      return dashboardData;
    }

    const dueNameSet = new Set(
      dashboardData.due.map((item) => String(item?.name ?? "").trim().toLowerCase())
    );

    const uniqueTempDue = tempDueItems.filter(
      (item) => !dueNameSet.has(String(item?.name ?? "").trim().toLowerCase())
    );

    return {
      ...dashboardData,
      due: [...dashboardData.due, ...uniqueTempDue],
    };
  }, [dashboardData, activeProfile]);

  const allDashboardItemsWithTemporaryReminders = useMemo(
    () => [
      ...dashboardDataWithTemporaryReminders.due,
      ...dashboardDataWithTemporaryReminders.overdue,
      ...dashboardDataWithTemporaryReminders.taken,
    ],
    [dashboardDataWithTemporaryReminders]
  );

  function calculateAge(birthDate) {
    if (!birthDate) return "N/A";

    const today = new Date();
    const birth = new Date(birthDate);

    if (Number.isNaN(birth.getTime())) {
      return "N/A";
    }

    let age = today.getFullYear() - birth.getFullYear();

    const monthDifference = today.getMonth() - birth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : "N/A";
  }

  const getDisplayStatus = (status) => {
    const normalizedStatus = String(status ?? "").trim().toLowerCase();

    if (normalizedStatus === "due") return "Due";
    if (normalizedStatus === "overdue") return "Overdue";
    return "Taken";
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = String(status ?? "").trim().toLowerCase();

    if (normalizedStatus === "due") return due;
    if (normalizedStatus === "overdue") return overdue;
    return taken;
  };

  const getActionLabel = (isTaken) => (isTaken ? "Mark as Not Taken" : "Mark as Taken");

  const renderDashboardCards = (items, keyPrefix, fallbackStatus) => (
    <ul className="dashboard-list">
      {items.map((item) => {
        const status = String(item?.status ?? fallbackStatus ?? "taken").toLowerCase();
        const displayStatus = getDisplayStatus(status);
        const cardKey = `${keyPrefix}-${item.id}`;
        const isTaken = takenToggleByCard[cardKey] ?? status === "taken";

        return (
          <li key={`${keyPrefix}-${item.id}`} className="dashboard-list-item">
            <div className="dashboard-card-content">
              <div className="dashboard-card-main">
                <div className="dashboard-card-title-row">
                  <h3 className="dashboard-vaccine-name">{item.name}</h3>
                  <p className="dashboard-badge">Compulsory</p>
                </div>

                <p className="dashboard-card-subtitle">{item.subtitle}</p>

                <div className="dashboard-card-footer">
                  <div className="dashboard-card-status">
                    <img src={getStatusIcon(status)} alt={`${displayStatus} status`} />
                    <p>{displayStatus}</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-card-actions">
                <button
                  type="button"
                  className="dashboard-action-btn"
                  onClick={() => {
                    setTakenToggleByCard((previousState) => ({
                      ...previousState,
                      [cardKey]: !isTaken,
                    }));
                  }}
                >
                  <span
                    className={`dashboard-action-check ${isTaken ? "checked" : ""}`}
                    aria-hidden="true"
                  >
                    {isTaken ? "✓" : ""}
                  </span>
                  <span className="dashboard-action-label">{getActionLabel(isTaken)}</span>
                </button>

                <button type="button" className="dashboard-remove-btn">
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  if (!profilesLoaded) {
    return null;
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="dash-body">
        <div className="body-wrapper">
          <img src={shield} alt="shield" />

          <div className="body-text">
            <h2>No Profiles Yet</h2>
            <p>Create a profile for yourself or your child to start<br />
              to start tracking vaccinations</p>
          </div>

          <button
            className="body-btn"
            onClick={() => navigate("/create-profile")}
          >
            Create Your First Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-body" id="dash2">
      <div className="profile-grid">

        {/* LEFT SIDE */}
        <div className="add-profile-btn">
          <div className="profile-header">
            <p>Profiles</p>

            <div className="header-img">
              <img src={share} alt="share button" />
              <img
                src={plus}
                alt="add profile"
                onClick={() => navigate("/create-profile")}
              />
            </div>
          </div>

          {profiles.map((profile) => {
            const id = profile.id; // ✅ NO index usage

            return (
              <div
                key={id}
                className="profile-summary"
                onClick={() =>
                  setActiveProfile(activeProfile === id ? null : id)
                }
              >
                <div className="user-main">
                  <div className="user-info-left">

                    {/* ✅ FIXED AVATAR */}
                    <div className="dash-body-avatar">
                      {profile?.firstName
                        ? profile.firstName.charAt(0).toUpperCase()
                        : "U"}
                    </div>

                    <div className="user-info">
                      {/* ✅ FIXED NAME */}
                      <h4>{getFullName(profile)}</h4>
                      <p>{profile.category}</p>
                    </div>
                  </div>

                  <div className="user-edit">
                    <img
                      src={edit}
                      alt="edit symbol"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-profile/${id}`);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE PROFILE CARD */}
        {profiles.map((profile) => {
          const id = profile.id;

          if (activeProfile !== id) return null;

          return (
            <div key={id} className="profile-card">
              <div id="profile-space">
                <h3>{profile?.firstName || "N/A"}</h3>

                <div className="profile-detail">
                  {(() => {
                    const age = calculateAge(profile.date);
                    const ageText = age === "N/A" ? "N/A" : `${age} years`;

                    return (
                      <p>
                        {ageText} • {profile.gender} • {profile.category}
                      </p>
                    );
                  })()}
                </div>

                <div className="profile-vaccine">
                  <div className="vaccine-item">
                    <img src={taken} alt="taken vaccines" />
                    <p>Taken ({dashboardDataWithTemporaryReminders.taken.length})</p>
                  </div>
                  <div className="vaccine-item">
                    <img src={due} alt="due vaccines" />
                    <p>Due ({dashboardDataWithTemporaryReminders.due.length})</p>
                  </div>

                  <div className="vaccine-item">
                    <img src={overdue} alt="overdue vaccines" />
                    <p>Overdue ({dashboardDataWithTemporaryReminders.overdue.length})</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* STATUS BUTTONS */}
        <div className="status-btn">
          <Button
            text="My Vaccines"
            className={activeStatus === "all" ? "status active" : "status"}
            onClick={() => setActiveStatus("all")}
          />
          <Button
            text="Taken"
            className={activeStatus === "taken" ? "status active" : "status"}
            onClick={() => setActiveStatus("taken")}
          />
          <Button
            text="Due"
            className={activeStatus === "due" ? "status active" : "status"}
            onClick={() => setActiveStatus("due")}
          />
          <Button
            text="OverDue"
            className={activeStatus === "overdue" ? "status active" : "status"}
            onClick={() => setActiveStatus("overdue")}
          />
        </div>

        {/* VACCINE SECTION */}
        <div className="vaccine-section">
          {loadingDashboard && <p className="dashboard-meta">Loading dashboard data...</p>}
          {!!dashboardError && <p className="dashboard-meta error">{dashboardError}</p>}

          {activeStatus === "all" && (
            <div className="dashboard-group">
              {allDashboardItemsWithTemporaryReminders.length === 0 ? (
                <div className="no-vaccines-empty">
                  <p>No vaccines in this category</p>
                </div>
              ) : (
                renderDashboardCards(allDashboardItemsWithTemporaryReminders, "all")
              )}

              {recommendations.length > 0 && (
                <div className="dashboard-recommendations">
                  <p>Recommendations</p>
                  <ul className="dashboard-list">
                    {recommendations.map((item) => (
                      <li key={`recommend-${item.id}`} className="dashboard-list-item">
                        <h3>{item.name}</h3>
                        <p>{item.subtitle}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeStatus === "taken" && (
            <div className="dashboard-group">
              {dashboardData.taken.length === 0 ? (
                <div className="no-vaccines-empty">
                  <p>No vaccines in this category</p>
                </div>
              ) : (
                renderDashboardCards(dashboardData.taken, "taken", "taken")
              )}
            </div>
          )}

          {activeStatus === "due" && (
            <div className="dashboard-group">
              {dashboardDataWithTemporaryReminders.due.length === 0 ? (
                <div className="no-vaccines-empty">
                  <p>No vaccines in this category</p>
                </div>
              ) : (
                renderDashboardCards(dashboardDataWithTemporaryReminders.due, "due", "due")
              )}
            </div>
          )}

          {activeStatus === "overdue" && (
            <div className="dashboard-group">
              {dashboardData.overdue.length === 0 ? (
                <div className="no-vaccines-empty">
                  <p>No vaccines in this category</p>
                </div>
              ) : (
                renderDashboardCards(dashboardData.overdue, "overdue", "overdue")
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}





// import { useNavigate } from "react-router-dom";
// import { useContext, useState } from "react";
// import { ProfileContext } from "../../context/profileContext.jsx";
// import { Button } from "../../../components/Button/Button.jsx";

// import add from "../../../image/add.svg";
// import taken from "../../../image/taken.svg";
// import due from "../../../image/due.svg";
// import overdue from "../../../image/overdue.svg";
// import plus from "../../../image/plus.svg";
// import edit from "../../../image/edit.svg";
// import share from "../../../image/share.svg";

// import "./DashBody.css";
// import { MyVaccine } from "../../vaccines/myVaccine.jsx";

// export function DashBody() {
//   const navigate = useNavigate();
//   // const { profiles } = useContext(ProfileContext);
//   const { profiles, activeProfile, setActiveProfile } = useContext(ProfileContext);
//   // const [activeProfile, setActiveProfile] = useState(null);
//   const [activeStatus, setActiveStatus] = useState("all");
//   const [takenVaccines, setTakenVaccines] = useState([]);

//   function calculateAge(birthDate) {
//     const today = new Date();
//     const birth = new Date(birthDate);

//     let age = today.getFullYear() - birth.getFullYear();

//     const monthDifference = today.getMonth() - birth.getMonth();

//     if (
//       monthDifference < 0 ||
//       (monthDifference === 0 && today.getDate() < birth.getDate())
//     ) {
//       age--;
//     }

//     return age;
//   }

//   if (!profiles || profiles.length === 0) {
//     return (
//       <div className="dash-body">
//         <div className="body-wrapper">
//           <img src={add} alt="plus sign" />

//           <div className="body-text">
//             <h3>No Profiles Yet</h3>
//             <p>Create a profile to start tracking vaccinations</p>
//           </div>

//           <button
//             className="body-btn"
//             onClick={() => navigate("/create-profile")}
//           >
//             Create Your First Profile
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dash-body">
//       <div className="profile-grid">
//         <div className="add-profile-btn">
//           <div className="profile-header">
//             <p>Profiles</p>

//             <div className="header-img">
//               <img src={share} alt="share button" />
//               <img
//                 src={plus}
//                 alt="add profile"
//                 onClick={() => navigate("/create-profile")}
//               />
//             </div>
//           </div>

//           {profiles.map((profile, index) => {
//             const id = profile.id || index;

//             return (
//               <div
//                 key={id}
//                 className="profile-summary"
//                 onClick={() =>
//                   setActiveProfile(activeProfile === id ? null : id)
//                 }
//               >
//                 <div className="user-main">
//                   <div className="user-info-left">
//                    <div className="user-avatar">
//                       {profile?.firstName
//                         ? profile.firstName.charAt(0).toUpperCase()
//                         : "U"}
//                     </div>

//                     <div className="user-info">
//                       <h4>{profile.firstName}</h4>
//                       <p>{profile.category}</p>
//                     </div>
//                   </div>
//                   <div className="user-edit">
//                     <img
//                       src={edit}
//                       alt="edit symbol"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/edit-profile/${id}`);
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {profiles.map((profile, index) => {
//           const id = profile.id || index;

//           if (activeProfile !== id) return null;

//           return (
//             <div key={id} className="profile-card">
//               <h3>{profile.firstName}</h3>

//               <div className="profile-detail">
//                 <p>
//                   {calculateAge(profile.date)} years • {profile.gender} •{" "}
//                   {profile.category}
//                 </p>
//               </div>

//               <div className="profile-vaccine">
//                 <div className="vaccine-item">
//                   <img src={taken} alt="taken vaccines" />
//                   <p>Taken</p>
//                 </div>

//                 <div className="vaccine-item">
//                   <img src={due} alt="due vaccines" />
//                   <p>Due</p>
//                 </div>

//                 <div className="vaccine-item">
//                   <img src={overdue} alt="overdue vaccines" />
//                   <p>Overdue</p>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         <div className="status-btn">
//           <Button
//             text="My Vaccines"
//             className={activeStatus === "all" ? "status active" : "status"}
//             onClick={() => setActiveStatus("all")}
//           />
//           <Button
//             text="Taken"
//             className={activeStatus === "taken" ? "status active" : "status"}
//             onClick={() => setActiveStatus("taken")}
//           />
//           <Button
//             text="Due"
//             className={activeStatus === "due" ? "status active" : "status"}
//             onClick={() => setActiveStatus("due")}
//           />
//           <Button
//             text="OverDue"
//             className={activeStatus === "overdue" ? "status active" : "status"}
//             onClick={() => setActiveStatus("overdue")}
//           />
//         </div>

//         <div className="vaccine-section">
//           {activeStatus === "all" && (
//             <div>
//               <MyVaccine
//                 header="Td (Tetanus-Diphtheria) Booster"
//                 text="Tetanus and Diphtheria booster for adults. Recommended every 10 years."
//                 onMarkTaken={() => setActiveStatus("taken")}
//               />
//               <MyVaccine
//                 header="Influenza (Flu) Vaccine"
//                 text="Annual flu vaccine to protect against seasonal influenza."
//                 onMarkTaken={() => setActiveStatus("taken")}
//               />

//               <MyVaccine
//                 header="Hepatitis B (Adult)"
//                 text="Hepatitis B vaccine series for adults who were not vaccinated as children."
//                 onMarkTaken={() => setActiveStatus("taken")}
//               />

//               <MyVaccine
//                 header="MMR (Adult)"
//                 text="Measles, Mumps, and Rubella vaccine for adults who missed childhood vaccination."
//                 onMarkTaken={() => setActiveStatus("taken")}
//               />

//               <MyVaccine
//                 header="Varicella (Adult)"
//                 text="Chickenpox vaccine for adults who never had chickenpox or the vaccine."
//                 onMarkTaken={() => setActiveStatus("taken")}
//               />

//               <MyVaccine
//                 header="HPV (Adult)"
//                 text="HPV vaccine for adults up to age 26 (or 45 with doctor consultation)."
//                 onMarkTaken={() => setActiveStatus("taken")}
//               />

//               <MyVaccine
//                 header="COVID-19 Vaccine"
//                 text="COVID-19 vaccine to protect against coronavirus disease."
//                 onMarkTaken={() => setActiveStatus("taken")}
//               />
//             </div>
//           )}

//           {activeStatus === "taken" && (
//             <div>
//               {takenVaccines.map((vaccine, index) => (
//                 <p key={index}>{vaccine}</p>
//               ))}
//             </div>
//           )}
//           {activeStatus === "due" && <p>Due vaccines will appear here</p>}

//           {activeStatus === "overdue" && (
//             <p>Overdue vaccines will appear here</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
