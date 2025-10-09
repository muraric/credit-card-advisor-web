import axios from "axios";

const isEmulator =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("192.168.1.67") ||
        window.location.hostname.includes("localhost"));

const API_BASE = isEmulator
    ? "http://192.168.1.67:8080"
    : process.env.NEXT_PUBLIC_API_BASE ||  "http://localhost:8080";

console.log(isEmulator);
console.log(API_BASE);

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: interceptors for logging/debugging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
