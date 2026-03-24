import { createContext, useEffect, useMemo, useState } from "react";
import { api } from "../../Api/api";

export const ProfileContext = createContext();

const PROFILE_FETCH_ENDPOINTS = [
  "/api/v1/profiles/my-profiles",
  "/api/v1/profiles/me",
];

const splitFullName = (fullName = "") => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", middleName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], middleName: "", lastName: "" };
  }

  if (parts.length === 2) {
    return { firstName: parts[0], middleName: "", lastName: parts[1] };
  }

  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
};

const normalizeGenderFromApi = (gender) => {
  const value = String(gender || "").trim().toLowerCase();

  if (value === "male") return "male";
  if (value === "female") return "female";
  return "na";
};

const normalizeCategoryFromApi = (category) => {
  const value = String(category || "").trim().toLowerCase();
  if (value === "child" || value === "adult" || value === "adolescent") {
    return value;
  }
  return "adult";
};

const normalizeProfile = (rawProfile) => {
  if (!rawProfile || typeof rawProfile !== "object") {
    return null;
  }

  const firstNameFromApi = rawProfile.first_name ?? rawProfile.firstName;
  const middleNameFromApi = rawProfile.middle_name ?? rawProfile.middleName;
  const lastNameFromApi = rawProfile.last_name ?? rawProfile.lastName;
  const parsedName = splitFullName(rawProfile.full_name ?? rawProfile.fullName ?? "");

  const firstName = firstNameFromApi ?? parsedName.firstName;
  const middleName = middleNameFromApi ?? parsedName.middleName;
  const lastName = lastNameFromApi ?? parsedName.lastName;

  const id = Number(rawProfile.profile_id ?? rawProfile.id);
  if (Number.isNaN(id)) {
    return null;
  }

  return {
    id,
    firstName: String(firstName || ""),
    middleName: String(middleName || ""),
    lastName: String(lastName || ""),
    date: rawProfile.dob ?? rawProfile.date_of_birth ?? rawProfile.date ?? "",
    gender: normalizeGenderFromApi(rawProfile.gender),
    category: normalizeCategoryFromApi(rawProfile.category),
    total: Number(rawProfile.total ?? 0),
    due: Number(rawProfile.due ?? 0),
    overdue: Number(rawProfile.overdue ?? 0),
  };
};

const normalizeGenderToApi = (gender) => {
  if (gender === "male") return "male";
  if (gender === "female") return "female";
  return "prefer not to say";
};

const buildCreateOrUpdatePayload = (profile) => ({
  first_name: String(profile.firstName || "").trim(),
  middle_name: String(profile.middleName || "").trim() || undefined,
  last_name: String(profile.lastName || "").trim(),
  date_of_birth: profile.date,
  gender: normalizeGenderToApi(profile.gender),
  category: String(profile.category || "").toLowerCase(),
});

const extractProfileArray = (payload) => {
  const source = payload?.data?.data ?? payload?.data ?? payload;

  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.profiles)) return source.profiles;
  if (Array.isArray(source?.items)) return source.items;

  return [];
};

const extractSingleProfile = (payload) => {
  const source = payload?.data?.data ?? payload?.data ?? payload;

  if (source?.profile && typeof source.profile === "object") {
    return source.profile;
  }

  if (typeof source === "object" && source !== null) {
    return source;
  }

  return null;
};

const extractApiErrorMessage = (error, fallbackMessage) => {
  const responseMessage =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message;

  if (typeof responseMessage === "string" && responseMessage.trim().length > 0) {
    return responseMessage;
  }

  return fallbackMessage;
};

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [profilesLoaded, setProfilesLoaded] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  const updateProfileCountsById = (profileId, updater) => {
    const safeProfileId = Number(profileId);

    if (!Number.isFinite(safeProfileId) || safeProfileId <= 0 || typeof updater !== "function") {
      return;
    }

    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) => {
        if (profile.id !== safeProfileId) {
          return profile;
        }

        const nextPatch = updater(profile);

        if (!nextPatch || typeof nextPatch !== "object") {
          return profile;
        }

        return {
          ...profile,
          ...nextPatch,
        };
      })
    );
  };

  const syncProfileCountsFromDashboard = (profileId, counts) => {
    const dueCount = Math.max(0, Number(counts?.due) || 0);
    const overdueCount = Math.max(0, Number(counts?.overdue) || 0);
    const takenCount = Math.max(0, Number(counts?.taken) || 0);

    updateProfileCountsById(profileId, () => ({
      due: dueCount,
      overdue: overdueCount,
      total: dueCount + overdueCount + takenCount,
    }));
  };

  const syncProfileCountsFromReminders = (profileId, reminders = []) => {
    const dueCount = reminders.filter((item) => item?.status === "due").length;
    const overdueCount = reminders.filter((item) => item?.status === "overdue").length;

    updateProfileCountsById(profileId, (profile) => {
      const previousTaken = Math.max(
        0,
        (Number(profile?.total) || 0) - (Number(profile?.due) || 0) - (Number(profile?.overdue) || 0)
      );

      return {
        due: dueCount,
        overdue: overdueCount,
        total: previousTaken + dueCount + overdueCount,
      };
    });
  };

  const registerReminderCountChange = (profileId, status = "due") => {
    const normalizedStatus = String(status ?? "due").toLowerCase();

    updateProfileCountsById(profileId, (profile) => {
      const currentDue = Math.max(0, Number(profile?.due) || 0);
      const currentOverdue = Math.max(0, Number(profile?.overdue) || 0);
      const currentTotal = Math.max(0, Number(profile?.total) || 0);

      if (normalizedStatus === "overdue") {
        return {
          overdue: currentOverdue + 1,
          total: currentTotal + 1,
        };
      }

      return {
        due: currentDue + 1,
        total: currentTotal + 1,
      };
    });
  };

  const fetchProfiles = async () => {
    for (const endpoint of PROFILE_FETCH_ENDPOINTS) {
      try {
        const response = await api.get(endpoint);
        const items = extractProfileArray(response)
          .map(normalizeProfile)
          .filter(Boolean)
          .slice(0, 4);

        setProfiles(items);

        if (items.length > 0) {
          setActiveProfile((prev) => prev ?? items[0].id);
          window.localStorage.setItem("activeProfileCategory", items[0].category);
        } else {
          setActiveProfile(null);
          window.localStorage.removeItem("activeProfileCategory");
        }

        setProfilesLoaded(true);
        return true;
      } catch {
        continue;
      }
    }

    setProfiles([]);
    setActiveProfile(null);
    window.localStorage.removeItem("activeProfileCategory");
    setProfilesLoaded(true);
    return false;
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const addProfile = async (profile) => {
    if (profiles.length >= 4) {
      setProfileError("Maximum of 4 profiles allowed");
      return { success: false, message: "Maximum of 4 profiles allowed" };
    }

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      const message = "You are not logged in. Please sign in again.";
      setProfileError(message);
      return { success: false, message };
    }

    try {
      setProfileError("");
      const response = await api.post("/api/v1/profiles", buildCreateOrUpdatePayload(profile));
      const createdProfile = normalizeProfile(extractSingleProfile(response));

      if (!createdProfile) {
        const message = "Profile created but response format was unexpected.";
        setProfileError(message);
        return { success: false, message };
      }

      setProfiles((prev) => [...prev, createdProfile]);
      setActiveProfile((prev) => prev ?? createdProfile.id);
      window.localStorage.setItem("activeProfileCategory", createdProfile.category);
      return { success: true };
    } catch (error) {
      const message = extractApiErrorMessage(error, "Unable to create profile.");
      setProfileError(message);
      return { success: false, message };
    }
  };

  const setActiveProfileWithCategory = (profileId) => {
    setActiveProfile(profileId);

    if (profileId === null) {
      window.localStorage.removeItem("activeProfileCategory");
      return;
    }

    const selectedProfile = profiles.find((profile) => profile.id === profileId);
    if (selectedProfile?.category) {
      window.localStorage.setItem("activeProfileCategory", selectedProfile.category);
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      setProfileError("");
      const response = await api.put(
        `/api/v1/profiles/my/${updatedProfile.id}`,
        buildCreateOrUpdatePayload(updatedProfile)
      );

      const normalized = normalizeProfile(extractSingleProfile(response));
      const nextProfile = normalized ?? updatedProfile;

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === updatedProfile.id ? { ...p, ...nextProfile } : p
        )
      );

      if (activeProfile === updatedProfile.id && nextProfile?.category) {
        window.localStorage.setItem("activeProfileCategory", nextProfile.category);
      }

      return { success: true };
    } catch (error) {
      const message = extractApiErrorMessage(error, "Unable to update profile.");
      setProfileError(message);
      return { success: false, message };
    }
  };

  const removeProfile = async (profileId) => {
    try {
      setProfileError("");
      await api.delete(`/api/v1/profiles/my/${profileId}`);

      setProfiles((prev) => {
        const nextProfiles = prev.filter((profile) => profile.id !== profileId);

        if (nextProfiles.length === 0) {
          window.localStorage.removeItem("activeProfileCategory");
        } else {
          window.localStorage.setItem("activeProfileCategory", nextProfiles[0].category);
        }

        return nextProfiles;
      });

      setActiveProfile((prev) => (prev === profileId ? null : prev));
      return { success: true };
    } catch (error) {
      const message = extractApiErrorMessage(error, "Unable to delete profile.");
      setProfileError(message);
      return { success: false, message };
    }
  };

  const notifyDashboardRefresh = () => {
    setDashboardRefreshKey((prev) => prev + 1);
  };

  const contextValue = useMemo(
    () => ({
      profiles,
      addProfile,
      updateProfile,
      removeProfile,
      fetchProfiles,
      profilesLoaded,
      profileError,
      activeProfile,
      dashboardRefreshKey,
      notifyDashboardRefresh,
      syncProfileCountsFromDashboard,
      syncProfileCountsFromReminders,
      registerReminderCountChange,
      setActiveProfile: setActiveProfileWithCategory,
    }),
    [profiles, activeProfile, profilesLoaded, profileError, dashboardRefreshKey]
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}




// import { createContext, useState } from "react";

// export const ProfileContext = createContext();

// export function ProfileProvider ({ children }) {
//     const [profiles, setProfiles] = useState([]);

//     const addProfile = (profile) => {
//         setProfiles((prev) => [...prev,profile]);

//     };

//    const updateProfile = (updatedProfile) => {
//   setProfiles((prev) => {
//     const exists = prev.some((p) => p.id === updatedProfile.id);

//     if (!exists) {
//       console.warn("Profile not found for update");
//       return prev;
//     }

//     return prev.map((p) =>
//       p.id === updatedProfile.id ? updatedProfile : p
//     );
//   });
// };

//     return (
//         <ProfileContext.Provider value={{ profiles, addProfile, updateProfile }} >
//             {children}
//         </ProfileContext.Provider>
//     )
// }