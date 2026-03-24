import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
});

const getNormalizedAccessToken = () => {
  const rawValue = localStorage.getItem("accessToken");

  if (typeof rawValue !== "string") {
    return "";
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }

  const withoutQuotes = trimmed.replace(/^"|"$/g, "");
  const withoutBearerPrefix = withoutQuotes.replace(/^Bearer\s+/i, "");

  return withoutBearerPrefix.trim();
};

api.interceptors.request.use((config) => {
  const token = getNormalizedAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});