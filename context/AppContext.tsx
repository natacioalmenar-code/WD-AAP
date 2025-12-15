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

import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";
import type {
  User,
  Role,
  Status,
  Trip,
  Course,
  SocialEvent,
  ClubSettings,
  PublishableStatus,
  ResourceItem,
  SocialPost,
  PostComment,
} from "../types";

/* =======================
   TYPES & CONTEXT
======================= */

interface AppState {
  users: User[];
  trips: Trip[];
  courses: Course[];
  socialEvents: SocialEvent[];
  resources: ResourceItem[];
  socialPosts: SocialPost[];
  currentUser: User | null;
  clubSettings: ClubSettings;
}

interface AppContextValue extends AppState {
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
    certification: string;
  }) => Promise<void>;

  approveUser: (userId: string) => Promise<void>;
  setUserRole: (userId: string, role: Role) => Promise<void>;

  canManageTrips: () => boolean;
  canManageSystem: () => boolean;
  isActiveMember: () => boolean;

  createTrip: (data: Omit<Trip, "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status">) => Promise<void>;
  updateTrip: (id: string, data: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  setTripPublished: (id: string, published: boolean) => Promise<void>;
  cancelTrip: (id: string, reason?: string) => Promise<void>;

  createCourse: (data: Omit<Course, "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status">) => Promise<void>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  setCoursePublished: (id: string, published: boolean) => Promise<void>;
  cancelCourse: (id: string, reason?: string) => Promise<void>;

  createSocialEvent: (data: Omit<SocialEvent, "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status">) => Promise<void>;
  updateSocialEvent: (id: string, data: Partial<SocialEvent>) => Promise<void>;
  deleteSocialEvent: (id: string) => Promise<void>;
  setSocialEventPublished: (id: string, published: boolean) => Promise<void>;
  cancelSocialEvent: (id: string, reason?: string) => Promise<void>;

  joinTrip: (id: string) => Promise<void>;
  leaveTrip: (id: string) => Promise<void>;
  joinCourse: (id: string) => Promise<void>;
  leaveCourse: (id: string) => Promise<void>;
  joinSocialEvent: (id: string) => Promise<void>;
  leaveSocialEvent: (id: string) => Promise<void>;

  updateClubSettings: (data: Partial<ClubSettings>) => Promise<void>;

  createResource: (data: Omit<ResourceItem, "id" | "createdBy" | "createdAt" | "updatedAt">) => Promise<void>;
  updateResource: (id: string, data: Partial<ResourceItem>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  swapResourceOrder: (aId: string, bId: string) => Promise<void>;

  createSocialPost: (data: { text: string; imageUrl?: string }) => Promise<void>;
  togglePostLike: (id: string) => Promise<void>;
  addPostComment: (id: string, text: string) => Promise<void>;
  deleteSocialPost: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

/* =======================
   HELPERS
======================= */

const defaultClubSettings: ClubSettings = {
  logoUrl: "/westdivers-logo.png",
  navbarPreTitle: "CLUB DE BUSSEIG",
  heroTitle: "WEST DIVERS",
  appBackgroundUrl: "",
};

const roleToLevel = (role: Role) =>
  role === "admin" ? "ADMIN" : role === "instructor" ? "INSTRUCTOR" : role === "pending" ? "PENDENT" : "B1E";

const assertAuthed = (u: User | null): asserts u is User => {
  if (!u) throw new Error("Not authenticated");
};

/* =======================
   PROVIDER
======================= */

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    users: [],
    trips: [],
    courses: [],
    socialEvents: [],
    resources: [],
    socialPosts: [],
    currentUser: null,
    clubSettings: defaultClubSettings,
  });

  /* ===== SNAPSHOTS ===== */
  useEffect(() => {
    const subs = [
      onSnapshot(query(collection(db, "users"), orderBy("createdAt", "asc")), s =>
        setState(p => ({ ...p, users: s.docs.map(d => d.data() as User) }))
      ),
      onSnapshot(query(collection(db, "trips"), orderBy("date", "asc")), s =>
        setState(p => ({ ...p, trips: s.docs.map(d => ({ ...d.data(), id: d.id }) as Trip) }))
      ),
      onSnapshot(query(collection(db, "courses"), orderBy("date", "asc")), s =>
        setState(p => ({ ...p, courses: s.docs.map(d => ({ ...d.data(), id: d.id }) as Course) }))
      ),
      onSnapshot(query(collection(db, "socialEvents"), orderBy("date", "asc")), s =>
        setState(p => ({ ...p, socialEvents: s.docs.map(d => ({ ...d.data(), id: d.id }) as SocialEvent) }))
      ),
    ];
    return () => subs.forEach(u => u());
  }, []);

  /* ===== AUTH ===== */
  useEffect(() => {
    return onAuthStateChanged(auth, async fb => {
      if (!fb?.email) return setState(p => ({ ...p, currentUser: null }));
      const ref = doc(db, "users", fb.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        const u: User = {
          id: fb.uid,
          name: fb.displayName || "Nou/va soci/a",
          email: fb.email.toLowerCase(),
          role: "pending",
          status: "pending",
          level: "PENDENT",
          avatarUrl: "",
          certification: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(ref, u);
        setState(p => ({ ...p, currentUser: u }));
      } else {
        setState(p => ({ ...p, currentUser: snap.data() as User }));
      }
    });
  }, []);

  /* ===== PERMISSIONS ===== */
  const canManageSystem = useMemo(() => () => state.currentUser?.role === "admin", [state.currentUser]);
  const canManageTrips = useMemo(
    () => () =>
      state.currentUser &&
      (state.currentUser.role === "admin" ||
        (state.currentUser.role === "instructor" && state.currentUser.status === "active")),
    [state.currentUser]
  );
  const isActiveMember = useMemo(
    () => () => state.currentUser?.status === "active" && state.currentUser.role !== "pending",
    [state.currentUser]
  );

  /* ===== AUTH METHODS ===== */
  const loginWithEmail = async (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);

  const logout = async () => signOut(auth);

  const registerUser = async ({ name, email, password, certification }: any) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), {
        id: cred.user.uid,
        name,
        email: email.toLowerCase(),
        role: "pending",
        status: "pending",
        level: "PENDENT",
        avatarUrl: "",
        certification,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert("Compte creat. Queda pendent d’aprovació per l’administració.");
      await signOut(auth);
    } catch {
      alert("Error en el registre. Si el compte s’ha creat, quedarà pendent d’aprovació.");
    }
  };

  /* ===== USERS ADMIN ===== */
  const approveUser = async (id: string) =>
    updateDoc(doc(db, "users", id), { status: "active", role: "member", level: "B1E" });

  const setUserRole = async (id: string, role: Role) =>
    updateDoc(doc(db, "users", id), { role, level: roleToLevel(role), status: "active" });

  /* ===== EXPORT CONTEXT ===== */
  return (
    <AppContext.Provider
      value={{
        ...state,
        loginWithEmail,
        logout,
        registerUser,
        approveUser,
        setUserRole,
        canManageTrips,
        canManageSystem,
        isActiveMember,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* =======================
   HOOK
======================= */

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
};

export const useApp = useAppContext;
