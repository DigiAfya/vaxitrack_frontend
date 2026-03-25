import { api } from "./api";

export const askChatbot = async (question) => {
  try {
    const res = await api.post("/v1/faqs/ask", {
      question,
      targetType: "vaccine", // or "general"
    });

    return res.data?.data?.answer || "No answer found.";
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Something went wrong while asking the assistant.";
  }
};






// import { api } from "./api";

// export const askChatbot = async (question) => {
//   const res = await api.post("/v1/faqs/ask", {
//     question,
//     targetType: "vaccine",
//   });

//   return res.data?.data?.answer;
// };