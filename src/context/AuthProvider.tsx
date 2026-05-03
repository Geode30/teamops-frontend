import { useState } from "react";
import { AuthContext } from "./auth.context";
import type { AccessToken, User } from "./auth.context";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<AccessToken | null>(null);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}