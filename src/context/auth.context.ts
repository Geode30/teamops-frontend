import { createContext } from "react";

export interface AccessToken {
  access: string;
}

export interface User {
  id: number,
  username: string,
  firstName: string,
  lastName: string,
}

export interface AuthContextType {
  token: AccessToken | null;
  setToken: (token: AccessToken | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);