import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, TokenResponse } from "../auth/auth";
import { useMutation } from "@tanstack/react-query";

export function LoginScreen() {
  const navigate = useNavigate();
  const { access } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation<
    TokenResponse, // TData
    Error,
    { username: string; password: string } // TVariables
  >({
    mutationFn: ({ username, password }) => apiLogin(username, password),
    onSuccess: () => {
      // navigate once login succeeds
      navigate("/reviews");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginMutation.mutateAsync({ username, password });
  };

  if (access) {
    return <p>You’re already logged in.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {loginMutation.error && (
        <div style={{ color: "crimson" }}>{loginMutation.error.message}</div>
      )}
      <div>
        <label>
          Username
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
