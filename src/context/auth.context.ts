import { createContext } from "react";

export interface AccessToken {
  access: string;
}

export interface AuthContextType {
  token: AccessToken | null;
  setToken: (token: AccessToken | null) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);