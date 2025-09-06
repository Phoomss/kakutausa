import axios from "axios";

const instance = axios.create({
  baseURL: "https://kakutausa.onrender.com",
  withCredentials: true, // ✅ sent cookies auto
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
