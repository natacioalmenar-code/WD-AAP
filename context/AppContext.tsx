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

export const FECDAS_LEVELS = [
  "B1E",
  "B2E",
  "B3E",
  "GG",
  "IN1E",
  "IN2E",
  "IN3E",
] as const;

export type FecdAsLevel = (typeof FECDAS_LEVELS)[number];

export type Role = "admin" | "instructor" | "member" | "pending";
export type Status = "pending" | "active";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  certification?: string;

  // UI
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
  createdBy: string;
  participants: string[];

  maxSpots?: number;
  imageUrl?: string;
}

export interface SocialEvent {
  id: string;
  title: string;
  date: string; // "2025-12-14"
  time?: string; // "19:00"
  location?: string;
  description?: string;
  imageUrl?: string;
  locationUrl?: string;
  maxSpots?: number;

  createdBy: string; // user id
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
  socialEvents: SocialEvent[];
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

  // crear
  createTrip: (data: Omit<Trip, "id" | "createdBy" | "participants">) => void;
  createCourse: (data: Omit<Course, "id" | "createdBy" | "participants">) => void;
  createSocialEvent: (
    data: Omit<SocialEvent, "id" | "createdBy" | "participants">
  ) => void;

  // apuntar/desapuntar
  joinTrip: (tripId: string) => void;
  leaveTrip: (tripId: string) => void;

  joinCourse: (courseId: string) => void;
  leaveCourse: (courseId: string) => void;

  joinSocialEvent: (eventId: string) => void;
  leaveSocialEvent: (eventId: string) => void;
}

const STORAGE_KEY = "westdivers-app-state-v6";
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
  socialEvents: [],
  currentUser: null, // Firebase mana
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

  // carregar estat guardat (localStorage)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as any;

      const safeUsers = (parsed.users ?? initialState.users).map((u: any) => ({
        ...u,
        level: u.level ?? roleToLevel(u.role),
        avatarUrl: u.avatarUrl ?? "",
        certification: u.certification ?? "",
      }));

      // ✅ Migració: si abans havies guardat "events", els passem a "socialEvents"
      const migratedSocialEvents: SocialEvent[] =
        parsed.socialEvents ??
        parsed.events ?? // per si algun fitxer antic feia servir "events"
        [];

      setState((prev) => ({
        ...prev,
        users: safeUsers,
        trips: parsed.trips ?? [],
        courses: parsed.courses ?? [],
        socialEvents: migratedSocialEvents,
        clubSettings: {
          ...defaultClubSettings,
          ...(parsed.clubSettings ?? {}),
        },
      }));
    } catch {
      // ignorem errors
    }
  }, []);

  // guardar estat (excepte currentUser)
  useEffect(() => {
    const { currentUser, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [state.users, state.trips, state.courses, state.socialEvents, state.clubSettings]);

  // Firebase Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser?.email) {
        setState((prev) => ({ ...prev, currentUser: null }));
        return;
      }

      const email = fbUser.email.toLowerCase();

      setState((prev) => {
        let found = prev.users.find((u) => u.email.toLowerCase() === email);

        // si no existeix a "users", el creem pending
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

        // assegurar que l'id coincideix amb uid
        if (found.id !== fbUser.uid) {
          found = { ...found, id: fbUser.uid };
          return {
            ...prev,
            users: prev.users.map((u) =>
              u.email.toLowerCase() === email ? found! : u
            ),
            currentUser: found,
          };
        }

        return { ...prev, currentUser: found };
      });
    });

    return () => unsub();
  }, []);

  // DEMO admin (sense Firebase) - útil per proves
  const loginAsDemoAdmin = () => {
    setState((prev) => ({ ...prev, currentUser: initialAdmin }));
  };

  const loginWithEmail: AppContextValue["loginWithEmail"] = async (email, password) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      alert("Falten dades (correu i contrasenya).");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmed, password);
    } catch {
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
    } catch {
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

  const createSocialEvent: AppContextValue["createSocialEvent"] = (data) => {
    if (!canCreate()) return;
    setState((prev) => ({
      ...prev,
      socialEvents: [
        ...prev.socialEvents,
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

  const joinSocialEvent: AppContextValue["joinSocialEvent"] = (eventId) => {
    if (!state.currentUser) {
      alert("Has d’iniciar sessió per apuntar-te.");
      return;
    }
    setState((prev) => ({
      ...prev,
      socialEvents: prev.socialEvents.map((ev) =>
        ev.id === eventId && !ev.participants.includes(prev.currentUser!.id)
          ? { ...ev, participants: [...ev.participants, prev.currentUser!.id] }
          : ev
      ),
    }));
  };

  const leaveSocialEvent: AppContextValue["leaveSocialEvent"] = (eventId) => {
    if (!state.currentUser) return;
    setState((prev) => ({
      ...prev,
      socialEvents: prev.socialEvents.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              participants: ev.participants.filter((id) => id !== prev.currentUser!.id),
            }
          : ev
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
    createSocialEvent,
    joinTrip,
    leaveTrip,
    joinCourse,
    leaveCourse,
    joinSocialEvent,
    leaveSocialEvent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

export const useApp = useAppContext;
