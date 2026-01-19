import axios from "axios";

// Determine Base URL
// 1. If VITE_API_URL is set (e.g. from Docker), use it.
// 2. If in Production (PROD=true), default to relative path "/" because we use Nginx proxy.
// 3. If in Development, default to localhost:5000.
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/" : "http://localhost:5000");

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Automatically prepend /api if not present
  if (config.url && !config.url.startsWith("/api")) {
    config.url = config.url.startsWith("/") ? `/api${config.url}` : `/api/${config.url}`;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

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

export const crudService = {
  // Assessment
  createAssessment: (data) => api.post("/management/assessments", data),
  getAssessments: () => api.get("/management/assessments"),
  updateAssessment: (id, data) => api.put(`/management/assessments/${id}`, data),
  deleteAssessment: (id) => api.delete(`/management/assessments/${id}`),

  // Module
  createModule: (data) => api.post("/management/modules", data),
  getModules: (assessmentId) => api.get(`/management/assessments/${assessmentId}/modules`),
  updateModule: (id, data) => api.put(`/management/modules/${id}`, data),
  deleteModule: (id) => api.delete(`/management/modules/${id}`),

  // Learning Module
  createLearningModule: (data) => api.post("/management/learning-modules", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  getLearningModules: (moduleId) => api.get(`/management/modules/${moduleId}/learning-modules`),
  updateLearningModule: (id, data) => api.put(`/management/learning-modules/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  deleteLearningModule: (id) => api.delete(`/management/learning-modules/${id}`),

  // Question
  createQuestion: (data) => api.post("/management/questions", data),
  getQuestions: (moduleId) => api.get(`/management/modules/${moduleId}/questions`),
  updateQuestion: (id, data) => api.put(`/management/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/management/questions/${id}`),

  // Option
  createOption: (data) => api.post("/management/options", data),
  getOptions: (questionId) => api.get(`/management/questions/${questionId}/options`),
  updateOption: (id, data) => api.put(`/management/options/${id}`, data),
  deleteOption: (id) => api.delete(`/management/options/${id}`),
};

export default api;
