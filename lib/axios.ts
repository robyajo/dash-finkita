import Axios from "axios"

const axios = Axios.create({
  baseURL: typeof window === "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") : "",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
})

axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("finkita_access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default axios
