import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Update this if your backend port is different
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getStatus: () => api.get("/auth/status"),
};

export const assesmentService = {
  getAssesments: () => api.get("/assessments/index"),
  // getAssessmentById: (id) => api.get(`/assessments/${id}`),
};

export const assementModuleService = {
  getAssesmentModule: (assessmentId) => api.get(`/module/${assessmentId}`),
};

export const quizService = {
  getQuiz: (quizId) => api.get(`/quiz/${quizId}`),
  // Send collected answers to backend which will call an LLM to generate learning suggestions
  resultAssesment: (payload) => api.post(`/quiz/resultAssessment`, payload),
};

export const adminService = {
  getDashboardStats: () => api.get("/admin/dashboard-stats"),
  getRecap: (assessmentId = null) => api.get(assessmentId ? `/admin/recap/${assessmentId}` : "/admin/recap"),
};

export default api;
