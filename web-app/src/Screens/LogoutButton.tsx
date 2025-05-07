import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export function LogoutButton() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="secondary"
      onClick={handleLogout}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : undefined}
    >
      Logout
    </Button>
  );
}
