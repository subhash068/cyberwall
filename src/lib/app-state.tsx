/**
 * Client-side app state: mock authentication session and workspace selection.
 * This is a demonstration-only session — it provides no real security.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoUser, UserRole, WorkspaceId } from "@/types";

const SESSION_KEY = "cyberwall.demo.session";
const WORKSPACE_KEY = "cyberwall.demo.workspace";

const DEMO_USERS: Record<string, DemoUser> = {
  "admin@zyntrava.io": {
    id: "u-001",
    name: "Alex Moreau",
    email: "admin@zyntrava.io",
    role: "Super Administrator",
    initials: "AM",
  },
  "analyst@zyntrava.io": {
    id: "u-002",
    name: "Priya Raman",
    email: "analyst@zyntrava.io",
    role: "Security Analyst",
    initials: "PR",
  },
  "auditor@zyntrava.io": {
    id: "u-003",
    name: "Sam Okafor",
    email: "auditor@zyntrava.io",
    role: "Read Only Auditor",
    initials: "SO",
  },
};

/** Any username + password combination signs in; the email maps to a demo persona. */
export function resolveDemoUser(identifier: string): DemoUser {
  const key = identifier.trim().toLowerCase();
  return (
    DEMO_USERS[key] ??
    (key.includes("analyst")
      ? DEMO_USERS["analyst@zyntrava.io"]
      : key.includes("auditor")
        ? DEMO_USERS["auditor@zyntrava.io"]
        : DEMO_USERS["admin@zyntrava.io"])
  );
}

export const demoPersonas = Object.values(DEMO_USERS);

export const roleCanEdit: Record<UserRole, boolean> = {
  "Super Administrator": true,
  "Network Administrator": true,
  "Security Analyst": true,
  "Read Only Auditor": false,
};

interface AppState {
  user: DemoUser | null;
  signIn: (identifier: string) => DemoUser;
  signOut: () => void;
  workspace: WorkspaceId;
  setWorkspace: (w: WorkspaceId) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [workspace, setWorkspaceState] = useState<WorkspaceId>("admin");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as DemoUser);
      const ws = localStorage.getItem(WORKSPACE_KEY);
      if (ws === "soc" || ws === "admin") setWorkspaceState(ws);
    } catch {
      // Ignore malformed demo storage.
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((identifier: string) => {
    const resolved = resolveDemoUser(identifier);
    setUser(resolved);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(resolved));
    } catch {
      // Storage unavailable — session lives in memory for this page.
    }
    return resolved;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  const setWorkspace = useCallback((w: WorkspaceId) => {
    setWorkspaceState(w);
    try {
      localStorage.setItem(WORKSPACE_KEY, w);
    } catch {
      // Ignore.
    }
  }, []);

  const value = useMemo(
    () => ({ user, signIn, signOut, workspace, setWorkspace }),
    [user, signIn, signOut, workspace, setWorkspace],
  );

  return (
    <AppStateContext.Provider value={{ ...value, ...(hydrated ? {} : {}) }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
