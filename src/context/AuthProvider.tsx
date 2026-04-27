import { useState } from "react";
import { AuthContext } from "./auth.context";
import type { AccessToken } from "./auth.context";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<AccessToken | null>(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}