import { createContext } from "react";
import { TokenResponse } from "./auth";

type AuthContextValue = {
  access: string | null;
  login: (username: string, password: string) => Promise<TokenResponse>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
