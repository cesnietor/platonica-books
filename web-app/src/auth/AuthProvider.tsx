import { useState, ReactNode, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, refreshToken, logout, TokenResponse } from "./auth";
import { AuthContext } from "./utils";

// AuthProvider Defines interface for JWT authentication
export function AuthProvider({ children }: { children: ReactNode }) {
  const [access, setAccess] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const loginMutation = useMutation<
    TokenResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess(data) {
      setAccess(data.access);
      setRefresh(data.refresh);
    },
  });

  const refreshMutation = useMutation<TokenResponse, Error, void>({
    mutationFn: () => {
      if (!refresh) throw new Error("No refresh token available");
      return refreshToken(refresh);
    },
    onSuccess(data) {
      setAccess(data.access);
      setRefresh(data.refresh);
    },
    onError() {
      // If refresh fails (expired/blacklisted), drop credentials
      setAccess(null);
      setRefresh(null);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: () => {
      if (!access || !refresh) return Promise.resolve();
      return logout(access, refresh);
    },
    onSuccess() {
      setAccess(null);
      setRefresh(null);
      queryClient.clear(); // clear any cached queries
    },
  });

  // pull out only the mutate function (its identity is stable)
  const { mutate: doRefresh } = refreshMutation;

  // auto‑refresh on mount (if authenticated, refresh token is set in cookies)
  useEffect(() => {
    doRefresh(); // browser will send the refresh cookie
  }, [doRefresh]);

  // Public API
  const loginFn = (username: string, password: string) =>
    loginMutation.mutateAsync({ username, password });
  const logoutFn = () => logoutMutation.mutateAsync();

  return (
    <AuthContext.Provider
      value={{
        access,
        login: loginFn,
        logout: logoutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
