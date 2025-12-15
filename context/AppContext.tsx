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

/* =========================
   CONTEXT TYPES
========================= */

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

  canManageTrips: () => boolean;      // admin + instructor
  canManageSystem: () => boolean;     // admin
  isActiveMember: () => boolean;

  // Trips
  createTrip: (data: Omit<Trip,
    "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status"
  >) => Promise<void>;
  updateTrip: (tripId: string, data: Partial<Trip>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  setTripPublished: (tripId: string, published: boolean) => Promise<void>;
  cancelTrip: (tripId: string, reason?: string) => Promise<void>;

  // Courses
  createCourse: (data: Omit<Course,
    "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status"
  >) => Promise<void>;
  updateCourse: (courseId: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  setCoursePublished: (courseId: string, published: boolean) => Promise<void>;
  cancelCourse: (courseId: string, reason?: string) => Promise<void>;

  // Social Events (només admin)
  createSocialEvent: (data: Omit<SocialEvent,
    "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status"
  >) => Promise<void>;
  updateSocialEvent: (eventId: string, data: Partial<SocialEvent>) => Promise<void>;
  deleteSocialEvent: (eventId: string) => Promise<void>;
  setSocialEventPublished: (eventId: string, published: boolean) => Promise<void>;
  cancelSocialEvent: (eventId: string, reason?: string) => Promise<void>;

  // Join / Leave
  joinTrip: (tripId: string) => Promise<void>;
  leaveTrip: (tripId: string) => Promise<void>;
  joinCourse: (courseId: string) => Promise<void>;
  leaveCourse: (courseId: string) => Promise<void>;
  joinSocialEvent: (eventId: string) => Promise<void>;
  leaveSocialEvent: (eventId: string) => Promise<void>;

  // Settings
  updateClubSettings: (data: Partial<ClubSettings>) => Promise<void>;

  // Resources
  createResource: (data: Omit<ResourceItem, "id" | "createdBy" | "createdAt" | "updatedAt">) => Promise<void>;
  updateResource: (resourceId: string, data: Partial<ResourceItem>) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  swapResourceOrder: (aId: string, bId: string) => Promise<void>;

  // Social Wall
  createSocialPost: (data: { text: string; imageUrl?: string }) => Promise<void>;
  togglePostLike: (postId: string) => Promise<void>;
  addPostComment: (postId: string, text: string) => Promise<void>;
  deleteSocialPost: (postId: string) => Promise<void>;
}

/* ========================= */

const AppContext = createContext<AppContextValue | undefined>(undefined);

const defaultClubSettings: ClubSettings = {
  logoUrl: "/westdivers-logo.png",
  navbarPreTitle: "CLUB DE BUSSEIG",
  heroTitle: "WEST DIVERS",
  appBackgroundUrl: "",
};

const roleToLevel = (role: Role) =>
  role === "admin" ? "ADMIN" :
  role === "instructor" ? "INSTRUCTOR" :
  role === "pending" ? "PENDENT" : "B1E";

const assertAuthed = (u: User | null): asserts u is User => {
  if (!u) throw new Error("No autenticat");
};

/* =========================
   PROVIDER
========================= */

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

  /* ===== LISTENERS ===== */

  useEffect(() => {
    const unsubs = [
      onSnapshot(query(collection(db, "users"), orderBy("createdAt", "asc")),
        s => setState(p => ({ ...p, users: s.docs.map(d => d.data() as User) }))
      ),
      onSnapshot(query(collection(db, "trips"), orderBy("date", "asc")),
        s => setState(p => ({ ...p, trips: s.docs.map(d => ({ ...d.data(), id: d.id }) as Trip) }))
      ),
      onSnapshot(query(collection(db, "courses"), orderBy("date", "asc")),
        s => setState(p => ({ ...p, courses: s.docs.map(d => ({ ...d.data(), id: d.id }) as Course) }))
      ),
      onSnapshot(query(collection(db, "socialEvents"), orderBy("date", "asc")),
        s => setState(p => ({ ...p, socialEvents: s.docs.map(d => ({ ...d.data(), id: d.id }) as SocialEvent) }))
      ),
    ];

    return () => unsubs.forEach(u => u());
  }, []);

  /* ===== AUTH ===== */

  useEffect(() => {
    return onAuthStateChanged(auth, async fbUser => {
      if (!fbUser?.email) {
        setState(p => ({ ...p, currentUser: null }));
        return;
      }

      const uid = fbUser.uid;
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setState(p => ({ ...p, currentUser: snap.data() as User }));
      }
    });
  }, []);

  /* ===== PERMISSIONS ===== */

  const canManageTrips = useMemo(() => () =>
    !!state.currentUser &&
    (state.currentUser.role === "admin" ||
      (state.currentUser.role === "instructor" && state.currentUser.status === "active")),
  [state.currentUser]);

  const canManageSystem = useMemo(() => () =>
    !!state.currentUser && state.currentUser.role === "admin",
  [state.currentUser]);

  const isActiveMember = useMemo(() => () =>
    !!state.currentUser && state.currentUser.status === "active",
  [state.currentUser]);

  /* ===== AUTH ACTIONS ===== */

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  };

  const logout = async () => {
    await signOut(auth);
    setState(p => ({ ...p, currentUser: null }));
  };

  /* ===== REGISTER (MISSATGE ARREGLAT) ===== */

  const registerUser: AppContextValue["registerUser"] = async ({
    name,
    email,
    password,
    certification,
  }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });

      const user: User = {
        id: cred.user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "pending",
        status: "pending",
        level: "PENDENT",
        avatarUrl: "",
        certification: certification.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", cred.user.uid), user);
      alert("Compte creat correctament.\nEstà pendent d’aprovació per l’administració.");
      await signOut(auth);
    } catch {
      alert(
        "El compte ja està creat o pendent d’aprovació.\n" +
        "Si ja t’has registrat, espera que l’administració l’active."
      );
    }
  };

  /* ===== ADMIN USERS ===== */

  const approveUser = async (userId: string) => {
    if (!canManageSystem()) return;
    await updateDoc(doc(db, "users", userId), {
      role: "member",
      status: "active",
      level: "B1E",
      updatedAt: serverTimestamp(),
    });
  };

  const setUserRole = async (userId: string, role: Role) => {
    if (!canManageSystem()) return;
    await updateDoc(doc(db, "users", userId), {
      role,
      status: "active",
      level: roleToLevel(role),
      updatedAt: serverTimestamp(),
    });
  };

  /* ===== HELPERS ===== */

  const baseDefaults = (uid: string) => ({
    createdBy: uid,
    participants: [],
    pendingParticipants: [],
    published: false,
    status: "active" as PublishableStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  /* ===== EXPORT VALUE ===== */

  const value: AppContextValue = {
    ...state,
    loginWithEmail,
    logout,
    registerUser,
    approveUser,
    setUserRole,
    canManageTrips,
    canManageSystem,
    isActiveMember,
    createTrip: async d => { assertAuthed(state.currentUser); await addDoc(collection(db,"trips"),{...baseDefaults(state.currentUser.id),...d}); },
    updateTrip: async (id,d) => updateDoc(doc(db,"trips",id),{...d,updatedAt:serverTimestamp()}),
    deleteTrip: async id => deleteDoc(doc(db,"trips",id)),
    setTripPublished: async (id,p) => updateDoc(doc(db,"trips",id),{published:p,updatedAt:serverTimestamp()}),
    cancelTrip: async (id,r) => updateDoc(doc(db,"trips",id),{status:"cancelled",cancelledReason:r||"",updatedAt:serverTimestamp()}),
    createCourse: async d => { assertAuthed(state.currentUser); await addDoc(collection(db,"courses"),{...baseDefaults(state.currentUser.id),...d}); },
    updateCourse: async (id,d) => updateDoc(doc(db,"courses",id),{...d,updatedAt:serverTimestamp()}),
    deleteCourse: async id => deleteDoc(doc(db,"courses",id)),
    setCoursePublished: async (id,p) => updateDoc(doc(db,"courses",id),{published:p,updatedAt:serverTimestamp()}),
    cancelCourse: async (id,r) => updateDoc(doc(db,"courses",id),{status:"cancelled",cancelledReason:r||"",updatedAt:serverTimestamp()}),
    createSocialEvent: async d => { assertAuthed(state.currentUser); await addDoc(collection(db,"socialEvents"),{...baseDefaults(state.currentUser.id),...d}); },
    updateSocialEvent: async (id,d) => updateDoc(doc(db,"socialEvents",id),{...d,updatedAt:serverTimestamp()}),
    deleteSocialEvent: async id => deleteDoc(doc(db,"socialEvents",id)),
    setSocialEventPublished: async (id,p) => updateDoc(doc(db,"socialEvents",id),{published:p,updatedAt:serverTimestamp()}),
    cancelSocialEvent: async (id,r) => updateDoc(doc(db,"socialEvents",id),{status:"cancelled",cancelledReason:r||"",updatedAt:serverTimestamp()}),
    joinTrip: async id => updateDoc(doc(db,"trips",id),{participants:arrayUnion(state.currentUser?.id)}),
    leaveTrip: async id => updateDoc(doc(db,"trips",id),{participants:arrayRemove(state.currentUser?.id)}),
    joinCourse: async id => updateDoc(doc(db,"courses",id),{participants:arrayUnion(state.currentUser?.id)}),
    leaveCourse: async id => updateDoc(doc(db,"courses",id),{participants:arrayRemove(state.currentUser?.id)}),
    joinSocialEvent: async id => updateDoc(doc(db,"socialEvents",id),{participants:arrayUnion(state.currentUser?.id)}),
    leaveSocialEvent: async id => updateDoc(doc(db,"socialEvents",id),{participants:arrayRemove(state.currentUser?.id)}),
    updateClubSettings: async d => setDoc(doc(db,"clubSettings","main"),{...d,updatedAt:serverTimestamp()},{merge:true}),
    createResource: async d => addDoc(collection(db,"resources"),{...d,createdBy:state.currentUser?.id,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}),
    updateResource: async (id,d) => updateDoc(doc(db,"resources",id),{...d,updatedAt:serverTimestamp()}),
    deleteResource: async id => deleteDoc(doc(db,"resources",id)),
    swapResourceOrder: async () => {},
    createSocialPost: async () => {},
    togglePostLike: async () => {},
    addPostComment: async () => {},
    deleteSocialPost: async () => {},
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/* ===== HOOK ===== */

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

export const useApp = useAppContext;
