import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

export type Role = "admin" | "instructor" | "member" | "pending";
export type Status = "pending" | "active";
// ✅ Nivells FECDAS/CMAS (per al Perfil)
export type FecdAsLevel =
  | "B1E"
  | "B2E"
  | "B3E"
  | "GG"
  | "IN1E"
  | "IN2E"
  | "IN3E";

// IMPORTANT: "as const" perquè TypeScript ho tracti com a literals
export const FECDAS_LEVELS = [
  "B1E",
  "B2E",
  "B3E",
  "GG",
  "IN1E",
  "IN2E",
  "IN3E",
] as const;


export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;

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

  // si els tens a la UI:
  time?: string;
  depth?: string;
  description?: string;
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
  maxSpots: number; // ✅ obligatori
  createdBy: string;
  participants: string[];

  imageUrl?: string;
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
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // persones sòcies
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
    certification: string;
  }) => Promise<void>;

  approveUser: (userId: string) => void;
  setUserRole: (userId: string, role: Role) => void;

  // permisos
  canManageTrips: () => boolean;
  canManageSystem: () => boolean;

  // sortides / cursos
  createTrip: (data: Omit<Trip, "id" | "createdBy" | "participants">) => void;
  createCourse: (
    data: Omit<Course, "id" | "createdBy" | "participants">
  ) => void;

  joinTrip: (tripId: string) => void;
  leaveTrip: (tripId: string) => void;

  joinCourse: (courseId: string) => void;
  leaveCourse: (courseId: string) => void;
}

const STORAGE_KEY = "westdivers-app-state-v5";
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
  currentUser: null, // ✅ ara el currentUser el governa Firebase Auth
  clubSettings: defaultClubSettings,
};

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function roleToLevel(role: Role) {
  return role === "admin"
    ? "ADMIN"
    : role === "instructor"
    ? "INSTRUCTOR"
    : role === "pending"
    ? "PENDENT"
    : "B1";
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  // carregar estat guardat (trips/courses/users)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<AppState>;

      const safeUsers = (parsed.users ?? initialState.users).map((u: any) => ({
        ...u,
        level: u.level ?? roleToLevel(u.role),
        avatarUrl: u.avatarUrl ?? "",
        certification: u.certification ?? "",
      }));

      setState((prev) => ({
        ...prev,
        ...parsed,
        users: safeUsers,
        clubSettings: {
          ...defaultClubSettings,
          ...(parsed.clubSettings ?? {}),
        },
      }));
    } catch {
      // ignorem errors
    }
  }, []);

  // guardar estat cada vegada que canvia (excepte currentUser que ve de Firebase)
  useEffect(() => {
    const { currentUser, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [state.users, state.trips, state.courses, state.clubSettings]);

  // ✅ Firebase Auth listener: quan canvies de login, s’actualitza currentUser
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser?.email) {
        setState((prev) => ({ ...prev, currentUser: null }));
        return;
      }

      const email = fbUser.email.toLowerCase();

      setState((prev) => {
        let found = prev.users.find((u) => u.email.toLowerCase() === email);

        // si no existeix a "users", el creem en pending (perquè admin l’aprovi)
        if (!found) {
          const newUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || "Nou/va soci/a",
            email,
            role: "pending",
            status: "pending",
            level: "PENDENT",
            avatarUrl: "",
            certification: "",
          };
          return { ...prev, users: [...prev.users, newUser], currentUser: newUser };
        }

        // assegurar que l'id coincideix amb uid (important)
        if (found.id !== fbUser.uid) {
          found = { ...found, id: fbUser.uid };
          return {
            ...prev,
            users: prev.users.map((u) => (u.email.toLowerCase() === email ? found! : u)),
            currentUser: found,
          };
        }

        return { ...prev, currentUser: found };
      });
    });

    return () => unsub();
  }, []);

  // DEMO admin (sense Firebase)
  const loginAsDemoAdmin = () => {
    setState((prev) => ({ ...prev, currentUser: initialAdmin }));
  };

  // ✅ Login Firebase (email + password)
  const loginWithEmail: AppContextValue["loginWithEmail"] = async (email, password) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      alert("Falten dades (correu i contrasenya).");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmed, password);
    } catch (e: any) {
      alert("No s’ha pogut iniciar sessió. Revisa correu/contrasenya.");
    }
  };

  const logout: AppContextValue["logout"] = async () => {
    try {
      await signOut(auth);
      setState((prev) => ({ ...prev, currentUser: null }));
    } catch {
      // ignore
    }
  };

  // ✅ Register Firebase (email + password) + crea usuari pending a la teva llista
  const registerUser: AppContextValue["registerUser"] = async ({
    name,
    email,
    password,
    certification,
  }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedCert = certification.trim();

    if (!trimmedEmail || !trimmedName || !password) {
      alert("Falten dades.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      await updateProfile(cred.user, { displayName: trimmedName });

      setState((prev) => {
        // evitar duplicat
        if (prev.users.some((u) => u.email.toLowerCase() === trimmedEmail)) return prev;

        const newUser: User = {
          id: cred.user.uid,
          name: trimmedName,
          email: trimmedEmail,
          role: "pending",
          status: "pending",
          level: "PENDENT",
          avatarUrl: "",
          certification: trimmedCert,
        };

        return { ...prev, users: [...prev.users, newUser] };
      });

      alert("Compte creat. Ara l’administració ha d’aprovar el teu accés.");
      await signOut(auth);
    } catch (e: any) {
      alert("No s’ha pogut crear el compte. Potser el correu ja existeix.");
    }
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
        u.id === userId ? { ...u, role, level: roleToLevel(role) } : u
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
      alert("Només administració o instructors poden crear això.");
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
          ? { ...t, participants: t.participants.filter((id) => id !== prev.currentUser!.id) }
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
          ? { ...c, participants: c.participants.filter((id) => id !== prev.currentUser!.id) }
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

export const useApp = useAppContext;
