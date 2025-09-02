import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true, // ✅ sent cookies auto
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
