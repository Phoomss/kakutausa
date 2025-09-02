import { useEffect, useState } from "react";
import authService from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.userInfo()
      .then(res => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, setUser, loading };
};
