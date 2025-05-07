import { useState, ReactNode, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, refreshToken, logout, TokenResponse } from "./auth";
import { AuthContext } from "./utils";

// AuthProvider Defines interface for JWT authentication
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const queryClient = useQueryClient();

  const loginMutation = useMutation<
    TokenResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess() {
      setIsAuthenticated(true);
    },
  });

  const refreshMutation = useMutation<TokenResponse, Error, void>({
    mutationFn: () => refreshToken(), // reads cookie, returns 200/401
    onSuccess() {
      setIsAuthenticated(true);
    },
    onError() {
      // If refresh fails (expired/blacklisted), drop credentials
      setIsAuthenticated(false);
    },
    onSettled: () => {
      // whether success or failure, we’re done checking
      setIsAuthLoading(false);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: () => logout(),
    onSuccess() {
      setIsAuthenticated(false);
      queryClient.clear(); // clear any cached queries
    },
  });

  // pull out only the mutate function (its identity is stable)
  const { mutate: doRefresh } = refreshMutation;

  // auto‑refresh on mount (if authenticated, refresh token is set in cookies)
  useEffect(() => {
    console.log("doRefresh");
    doRefresh();
  }, [doRefresh]);

  // Public API
  const loginFn = (username: string, password: string) =>
    loginMutation.mutateAsync({ username, password });
  const logoutFn = () => logoutMutation.mutateAsync();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        login: loginFn,
        logout: logoutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
