import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

interface LocationState {
  from?: Location;
}

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated: access, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const state = location.state as LocationState;
  const from = state?.from?.pathname ?? "/reviews";

  // if you already have a token, no need to log in
  if (access) {
    return <p>You’re already logged in.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // this is your AuthProvider's mutateAsync
      await login(username, password);
      // after provider onSuccess, access is set → safe to navigate
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Platonica
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? "Logging in…" : "Log In"}
        </Button>
      </Box>
    </Container>
  );
}
