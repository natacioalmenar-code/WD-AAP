import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type Role = "admin" | "instructor" | "member" | "pending";
export type Status = "pending" | "active";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;

  // dades de soci/a
  certification?: string;

  // Necessari pel Navbar
  level: string;
  avatarUrl: string; // buit si no hi ha foto
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  location: string;
  levelRequired: string;
  maxSpots: number;
  createdBy: string;
  participants: string[];

  // extra (si existeixen a les teves dades)
  description?: string;
  time?: string;
  depth?: string;
  imageUrl?: string;
  locationUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  date: string;
  schedule: string;
  description: string;
  price: string;
  levelRequired: string;
  createdBy: string;
  participants: string[];
}

export interface ClubSettings {
  logoUrl: string;
  navbarPreTitle: string;
  heroTitle: string;
  appBackgroundUrl?: string;
}

interface AppState {
  users: User[];
  trips: Trip[];
  courses: Course[];
  currentUser: User | null;
  clubSettings: ClubSettings;
}

interface AppContextValue extends AppState {
  // auth
  loginAsDemoAdmin: () => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;

  // persones sòcies
  registerUser: (data: { name: string; email: string; certification: string }) => void;
  approveUser: (userId: string) => void;
  setUserRole: (userId: string, role: Role) => void;

  // permisos
  canManageTrips: () => boolean;
  canManageSystem: () => boolean;

  // sortides / cursos
  createTrip: (data: Omit<Trip, "id" | "createdBy" | "participants">) => void;
  joinTrip: (tripId: string) => void;
  leaveTrip: (tripId: string) => void;

  createCourse: (data: Omit<Course, "id" | "createdBy" | "participants">) => void;
  joinCourse: (courseId: string) => void;
  leaveCourse: (courseId: string) => void;
}

const STORAGE_KEY = "westdivers-app-state-v4";
const AppContext = createContext<AppContextValue | undefined>(undefined);

const defaultClubSettings: ClubSettings = {
  logoUrl: "/westdivers-logo.png",
  navbarPreTitle: "CLUB DE BUSSEIG",
  heroTitle: "WEST DIVERS",
  appBackgroundUrl: "",
};

const initialAdmin: User = {
  id: "admin-1",
  name: "Administració West Divers",
  email: "admin@westdivers.local",
  role: "admin",
  status: "active",
  level: "ADMIN",
  avatarUrl: "",
  certification: "ADMIN",
};

const initialState: AppState = {
  users: [initialAdmin],
  trips: [],
  courses: [],
  currentUser: initialAdmin,
  clubSettings: defaultClubSettings,
};

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  // carregar estat del navegador
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<AppState>;

      const safeUsers = (parsed.users ?? initialState.users).map((u: any) => ({
        ...u,
        level: u.level ?? (u.role === "admin" ? "ADMIN" : "B1"),
        avatarUrl: u.avatarUrl ?? "",
        certification: u.certification ?? "",
      }));

      const safeCurrentUser = parsed.currentUser
        ? ({
            ...(parsed.currentUser as any),
            level:
              (parsed.currentUser as any).level ??
              ((parsed.currentUser as any).role === "admin" ? "ADMIN" : "B1"),
            avatarUrl: (parsed.currentUser as any).avatarUrl ?? "",
            certification: (parsed.currentUser as any).certification ?? "",
          } as User)
        : null;

      setState({
        ...initialState,
        ...parsed,
        users: safeUsers,
        currentUser: safeCurrentUser,
        clubSettings: {
          ...defaultClubSettings,
          ...(parsed.clubSettings ?? {}),
        },
      });
    } catch {
      // ignorem errors
    }
  }, []);

  // guardar estat cada vegada que canvia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const loginAsDemoAdmin = () => {
    setState((prev) => ({ ...prev, currentUser: initialAdmin }));
  };

  const loginWithEmail = (email: string): boolean => {
  const trimmed = email.trim().toLowerCase();

  const user = state.users.find((u) => u.email.toLowerCase() === trimmed);

  if (!user) {
    alert("No hi ha cap persona sòcia amb aquest correu.");
    return false;
  }

  if (user.status !== "active") {
    alert("Aquest compte encara està pendent d’aprovació.");
    return false;
  }

  setState((prev) => ({ ...prev, currentUser: user }));
  return true;
};
      }
      return { ...prev, currentUser: user };
    });
  };

  const logout = () => setState((prev) => ({ ...prev, currentUser: null }));

  const registerUser: AppContextValue["registerUser"] = ({ name, email, certification }) => {
    setState((prev) => {
      const trimmed = email.trim().toLowerCase();
      if (prev.users.some((u) => u.email.toLowerCase() === trimmed)) {
        alert("Ja existeix una persona usuària amb aquest correu.");
        return prev;
      }

      const user: User = {
        id: createId(),
        name: name.trim(),
        email: trimmed,
        role: "pending",
        status: "pending",
        level: "PENDENT",
        avatarUrl: "",
        certification: certification.trim(),
      };

      alert("Sol·licitud enviada. L’administració revisarà i aprovarà l’accés.");
      return { ...prev, users: [...prev.users, user] };
    });
  };

  const approveUser: AppContextValue["approveUser"] = (userId) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, status: "active", role: "member", level: "B1" } : u
      ),
    }));
  };

  const setUserRole: AppContextValue["setUserRole"] = (userId, role) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              role,
              level:
                role === "admin"
                  ? "ADMIN"
                  : role === "instructor"
                  ? "INSTRUCTOR"
                  : role === "pending"
                  ? "PENDENT"
                  : "B1",
            }
          : u
      ),
    }));
  };

  const canManageTrips = useMemo(() => {
    return () =>
      !!state.currentUser &&
      (state.currentUser.role === "admin" || state.currentUser.role === "instructor");
  }, [state.currentUser]);

  const canManageSystem = useMemo(() => {
    return () => !!state.currentUser && state.currentUser.role === "admin";
  }, [state.currentUser]);

  const canCreate = () => {
    if (!state.currentUser) {
      alert("Has d’iniciar sessió.");
      return false;
    }
    if (state.currentUser.role !== "admin" && state.currentUser.role !== "instructor") {
      alert("Només administració o equip instructor poden crear això.");
      return false;
    }
    return true;
  };

  const createTrip: AppContextValue["createTrip"] = (data) => {
    if (!canCreate()) return;
    setState((prev) => ({
      ...prev,
      trips: [
        ...prev.trips,
        { ...data, id: createId(), createdBy: prev.currentUser!.id, participants: [] },
      ],
    }));
  };

  const createCourse: AppContextValue["createCourse"] = (data) => {
    if (!canCreate()) return;
    setState((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        { ...data, id: createId(), createdBy: prev.currentUser!.id, participants: [] },
      ],
    }));
  };

  const joinTrip: AppContextValue["joinTrip"] = (tripId) => {
    if (!state.currentUser) {
      alert("Has d’iniciar sessió per apuntar-te.");
      return;
    }
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId && !t.participants.includes(prev.currentUser!.id)
          ? { ...t, participants: [...t.participants, prev.currentUser!.id] }
          : t
      ),
    }));
  };

 const leaveTrip: AppContextValue["leaveTrip"] = (tripId) => {
  if (!state.currentUser) return;

  setState((prev) => ({
    ...prev,
    trips: prev.trips.map((t) =>
      t.id === tripId
        ? {
            ...t,
            participants: t.participants.filter(
              (id) => id !== prev.currentUser!.id
            ),
          }
        : t
    ),
  }));
};

  const joinCourse: AppContextValue["joinCourse"] = (courseId) => {
    if (!state.currentUser) {
      alert("Has d’iniciar sessió per apuntar-te.");
      return;
    }
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId && !c.participants.includes(prev.currentUser!.id)
          ? { ...c, participants: [...c.participants, prev.currentUser!.id] }
          : c
      ),
    }));
  };

  const leaveCourse: AppContextValue["leaveCourse"] = (courseId) => {
  if (!state.currentUser) return;

  setState((prev) => ({
    ...prev,
    courses: prev.courses.map((c) =>
      c.id === courseId
        ? {
            ...c,
            participants: c.participants.filter(
              (id) => id !== prev.currentUser!.id
            ),
          }
        : c
    ),
  }));
};

  const value: AppContextValue = {
    ...state,
    loginAsDemoAdmin,
    loginWithEmail,
    logout,
    registerUser,
    approveUser,
    setUserRole,
    canManageTrips,
    canManageSystem,
    createTrip,
    createCourse,
    joinTrip,
    leaveTrip,
    joinCourse,
    leaveCourse,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

// ✅ Un sol export de useApp
export const useApp = useAppContext;
