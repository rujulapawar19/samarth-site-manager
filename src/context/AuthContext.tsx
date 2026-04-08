import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "manager" | "supervisor";

interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
}

const DEMO_USERS: Record<string, { password: string; name: string; role: UserRole }> = {
  "manager@samarth.com": { password: "Samarth@123", name: "Manager", role: "manager" },
  "supervisor@samarth.com": { password: "Site@123", name: "Supervisor", role: "supervisor" },
};

// Supervisor can only access these routes
export const SUPERVISOR_ROUTES = ["/dashboard", "/attendance", "/materials", "/new-delivery"];

const AuthContext = createContext<AuthContextType>({ user: null, login: () => null, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("sitesync_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("sitesync_user", JSON.stringify(user));
    else localStorage.removeItem("sitesync_user");
  }, [user]);

  const login = (email: string, password: string): string | null => {
    const entry = DEMO_USERS[email.toLowerCase().trim()];
    if (!entry) return "Invalid email address";
    if (entry.password !== password) return "Incorrect password";
    setUser({ email: email.toLowerCase().trim(), name: entry.name, role: entry.role });
    return null;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
