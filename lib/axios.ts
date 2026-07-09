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

export default axios
