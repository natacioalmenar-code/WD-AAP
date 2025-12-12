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

// ✅ Nivells FECDAS/CMAS que vols
export const FECDAS_LEVELS = ["B1E", "B2E", "B3E", "GG", "IN1E", "IN2E", "IN3E"] as const;
export type FecdAsLevel = (typeof FECDAS_LEVELS)[number] | "ALTRES";

export interface UserDocuments {
  licenseNumber: string;        // Llicència federativa
  insuranceCompany: string;     // Companyia assegurança
  insurancePolicy: string;      // Nº pòlissa
  insuranceExpiry: string;      // Data caducitat (YYYY-MM-DD)
  medicalCertExpiry: string;    // Data caducitat (YYYY-MM-DD)
  highestCertification: string; // Titulació més elevada (text)
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;

  // ✅ Perfil
  level: FecdAsLevel;     // B1E, B2E... o ALTRES
  avatarUrl: string;      // buit si no hi ha foto

  // ✅ Titulacions / especialitats
  certification?: string;        // (el que demanes al registre)
  specialties: string[];         // Especialitats FECDAS/CMAS (strings)
  otherSpecialtiesText: string;  // Text lliure si no són FECDAS/CMAS

  // ✅ Documentació
  documents: UserDocuments;

  // (futur) contrasenya real -> quan fem Firebase/Auth
  passwordSet: boolean;
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

  // opcionals (UI)
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
  maxSpots: number;
  createdBy: string;
  participants: string[];

  // opcional (UI)
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
  loginWithEmail: (email: string) => boolean;
  logout: () => void;

  // persones sòcies
  registerUser: (data: { name: string; email: string; certification: string }) => void;
  approveUser: (userId: string) => void;
  setUserRole: (userId: string, role: Role) => void;

  // ✅ perfil + documentació (PAS 4)
  updateMyProfile: (data: Partial<Pick<User, "name" | "avatarUrl" | "level" | "specialties" | "otherSpecialtiesText">>) => void;
  updateMyDocuments: (data: Partial<UserDocuments>) => void;

  // permisos
  canManageTrips: () => boolean;
  canManageSystem: () => boolean;

  // sortides
  createTrip: (data: Omit<Trip, "id" | "createdBy" | "participants">) => void;
  joinTrip: (tripId: string) => void;
  leaveTrip: (tripId: string) => void;

  // cursos
  createCourse: (data: Omit<Course, "id" | "createdBy" | "participants">) => void;
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

const emptyDocs = (): UserDocuments => ({
  licenseNumber: "",
  insuranceCompany: "",
  insurancePolicy: "",
  insuranceExpiry: "",
  medicalCertExpiry: "",
  highestCertification: "",
});

const normalizeLevelFromText = (text: string): FecdAsLevel => {
  const t = (text || "").toUpperCase().trim();
  return (FECDAS_LEVELS as readonly string[]).includes(t) ? (t as FecdAsLevel) : "ALTRES";
};

const initialAdmin: User = {
  id: "admin-1",
  name: "Administració West Divers",
  email: "admin@westdivers.local",
  role: "admin",
  status: "active",
  level: "IN3E",
  avatarUrl: "",

  certification: "ADMIN",
  specialties: [],
  otherSpecialtiesText: "",

  documents: emptyDocs(),
  passwordSet: false,
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

  // carregar estat guardat
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<AppState>;

      const safeUsers = (parsed.users ?? initialState.users).map((u: any) => {
        const docs = u.documents ?? {};
        return {
          ...u,
          level: (u.level ?? "B1E") as FecdAsLevel,
          avatarUrl: u.avatarUrl ?? "",
          certification: u.certification ?? "",
          specialties: Array.isArray(u.specialties) ? u.specialties : [],
          otherSpecialtiesText: u.otherSpecialtiesText ?? "",
          documents: {
            ...emptyDocs(),
            ...docs,
          },
          passwordSet: !!u.passwordSet,
        } as User;
      });

      const safeCurrentUser = parsed.currentUser
        ? ({
            ...(parsed.currentUser as any),
            level: ((parsed.currentUser as any).level ?? "B1E") as FecdAsLevel,
            avatarUrl: (parsed.currentUser as any).avatarUrl ?? "",
            certification: (parsed.currentUser as any).certification ?? "",
            specialties: Array.isArray((parsed.currentUser as any).specialties)
              ? (parsed.currentUser as any).specialties
              : [],
            otherSpecialtiesText: (parsed.currentUser as any).otherSpecialtiesText ?? "",
            documents: {
              ...emptyDocs(),
              ...(((parsed.currentUser as any).documents ?? {}) as any),
            },
            passwordSet: !!(parsed.currentUser as any).passwordSet,
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

  // guardar estat
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

        certification: certification.trim(),
        level: normalizeLevelFromText(certification),
        avatarUrl: "",

        specialties: [],
        otherSpecialtiesText: "",

        documents: {
          ...emptyDocs(),
          highestCertification: certification.trim(),
        },

        passwordSet: false,
      };

      alert("Sol·licitud enviada. L’administració revisarà i aprovarà l’accés.");
      return { ...prev, users: [...prev.users, user] };
    });
  };

  const approveUser: AppContextValue["approveUser"] = (userId) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: "active",
              role: "member",
              // si era ALTRES, el mantenim; si no, ja porta el seu
              level: (u.level ?? "B1E") as FecdAsLevel,
            }
          : u
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
                  ? "IN3E"
                  : role === "instructor"
                  ? "IN1E"
                  : u.level ?? "B1E",
            }
          : u
      ),
    }));
  };

  // ✅ actualitzar perfil propi
  const updateMyProfile: AppContextValue["updateMyProfile"] = (data) => {
    if (!state.currentUser) return;

    setState((prev) => {
      const updatedCurrent = { ...prev.currentUser!, ...data };
      return {
        ...prev,
        currentUser: updatedCurrent,
        users: prev.users.map((u) => (u.id === updatedCurrent.id ? updatedCurrent : u)),
      };
    });
  };

  // ✅ actualitzar documentació pròpia
  const updateMyDocuments: AppContextValue["updateMyDocuments"] = (data) => {
    if (!state.currentUser) return;

    setState((prev) => {
      const updatedCurrent = {
        ...prev.currentUser!,
        documents: {
          ...prev.currentUser!.documents,
          ...data,
        },
      };

      return {
        ...prev,
        currentUser: updatedCurrent,
        users: prev.users.map((u) => (u.id === updatedCurrent.id ? updatedCurrent : u)),
      };
    });
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

    updateMyProfile,
    updateMyDocuments,

    canManageTrips,
    canManageSystem,

    createTrip,
    joinTrip,
    leaveTrip,

    createCourse,
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

// ✅ Un sol export
export const useApp = useAppContext;
