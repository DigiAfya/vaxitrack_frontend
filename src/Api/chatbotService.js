import { api } from "./api";

export const askChatbot = async (question) => {
  try {
    const res = await api.post("/api/v1/vaxibot/ask", {
      question,
    });

    return res.data?.data?.answer || "No answer found.";
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Something went wrong while asking the assistant.";
  }
};