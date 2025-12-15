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

  canManageTrips: () => boolean; // admin o instructor (instructor: active)
  canManageSystem: () => boolean; // admin (sense dependre de status)
  isActiveMember: () => boolean; // active i role != pending

  // Trips
  createTrip: (
    data: Omit<
      Trip,
      | "id"
      | "createdBy"
      | "participants"
      | "pendingParticipants"
      | "published"
      | "status"
    >
  ) => Promise<void>;
  updateTrip: (tripId: string, data: Partial<Trip>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  setTripPublished: (tripId: string, published: boolean) => Promise<void>;
  cancelTrip: (tripId: string, reason?: string) => Promise<void>;

  // Courses
  createCourse: (
    data: Omit<
      Course,
      | "id"
      | "createdBy"
      | "participants"
      | "pendingParticipants"
      | "published"
      | "status"
    >
  ) => Promise<void>;
  updateCourse: (courseId: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  setCoursePublished: (courseId: string, published: boolean) => Promise<void>;
  cancelCourse: (courseId: string, reason?: string) => Promise<void>;

  // Social events
  createSocialEvent: (
    data: Omit<
      SocialEvent,
      | "id"
      | "createdBy"
      | "participants"
      | "pendingParticipants"
      | "published"
      | "status"
    >
  ) => Promise<void>;
  updateSocialEvent: (eventId: string, data: Partial<SocialEvent>) => Promise<void>;
  deleteSocialEvent: (eventId: string) => Promise<void>;
  setSocialEventPublished: (eventId: string, published: boolean) => Promise<void>;
  cancelSocialEvent: (eventId: string, reason?: string) => Promise<void>;

  // Inscripcions
  joinTrip: (tripId: string) => Promise<void>;
  leaveTrip: (tripId: string) => Promise<void>;
  joinCourse: (courseId: string) => Promise<void>;
  leaveCourse: (courseId: string) => Promise<void>;
  joinSocialEvent: (eventId: string) => Promise<void>;
  leaveSocialEvent: (eventId: string) => Promise<void>;

  // Settings
  updateClubSettings: (data: Partial<ClubSettings>) => Promise<void>;

  // ✅ MATERIAL
  createResource: (
    data: Omit<ResourceItem, "id" | "createdBy" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateResource: (resourceId: string, data: Partial<ResourceItem>) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  swapResourceOrder: (aId: string, bId: string) => Promise<void>;

  // ✅ MUR SOCIAL
  createSocialPost: (data: { text: string; imageUrl?: string }) => Promise<void>;
  togglePostLike: (postId: string) => Promise<void>;
  addPostComment: (postId: string, text: string) => Promise<void>;
  deleteSocialPost: (postId: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const defaultClubSettings: ClubSettings = {
  logoUrl: "/westdivers-logo.png",
  navbarPreTitle: "CLUB DE BUSSEIG",
  heroTitle: "WEST DIVERS",
  appBackgroundUrl: "",
};

function roleToLevel(role: Role) {
  return role === "admin"
    ? "ADMIN"
    : role === "instructor"
    ? "INSTRUCTOR"
    : role === "pending"
    ? "PENDENT"
    : "B1E";
}

function assertAuthed(currentUser: User | null): asserts currentUser is User {
  if (!currentUser) throw new Error("No autenticat/da.");
}

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

  // ====== SNAPSHOTS ======
  useEffect(() => {
    const unsubUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "asc")),
      (snap) => {
        const users = snap.docs.map((d) => d.data() as User);
        setState((prev) => {
          const cur = prev.currentUser
            ? users.find((u) => u.id === prev.currentUser!.id) ?? prev.currentUser
            : null;
          return { ...prev, users, currentUser: cur };
        });
      }
    );

    const unsubTrips = onSnapshot(
      query(collection(db, "trips"), orderBy("date", "asc")),
      (snap) => {
        const trips = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as Trip[];
        setState((prev) => ({ ...prev, trips }));
      }
    );

    const unsubCourses = onSnapshot(
      query(collection(db, "courses"), orderBy("date", "asc")),
      (snap) => {
        const courses = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as Course[];
        setState((prev) => ({ ...prev, courses }));
      }
    );

    const unsubEvents = onSnapshot(
      query(collection(db, "socialEvents"), orderBy("date", "asc")),
      (snap) => {
        const socialEvents = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as SocialEvent[];
        setState((prev) => ({ ...prev, socialEvents }));
      }
    );

    const unsubResources = onSnapshot(
      query(collection(db, "resources"), orderBy("category", "asc"), orderBy("order", "asc")),
      (snap) => {
        const resources = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as ResourceItem[];
        const safe = resources.map((r) => ({
          ...r,
          order: typeof (r as any).order === "number" ? (r as any).order : 999999,
        }));
        setState((prev) => ({ ...prev, resources: safe }));
      }
    );

    const unsubPosts = onSnapshot(
      query(collection(db, "socialPosts"), orderBy("createdAt", "desc")),
      (snap) => {
        const socialPosts = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as SocialPost[];
        const safe = socialPosts.map((p) => ({
          ...p,
          likes: Array.isArray((p as any).likes) ? (p as any).likes : [],
          comments: Array.isArray((p as any).comments) ? (p as any).comments : [],
        }));
        setState((prev) => ({ ...prev, socialPosts: safe }));
      }
    );

    const settingsRef = doc(db, "clubSettings", "main");
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (!snap.exists()) {
        setDoc(settingsRef, { ...defaultClubSettings, updatedAt: serverTimestamp() }).catch(() => {});
        setState((prev) => ({ ...prev, clubSettings: defaultClubSettings }));
        return;
      }
      setState((prev) => ({ ...prev, clubSettings: snap.data() as ClubSettings }));
    });

    return () => {
      unsubUsers();
      unsubTrips();
      unsubCourses();
      unsubEvents();
      unsubResources();
      unsubPosts();
      unsubSettings();
    };
  }, []);

  // ====== AUTH STATE ======
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser?.email) {
        setState((prev) => ({ ...prev, currentUser: null }));
        return;
      }

      const email = fbUser.email.toLowerCase();
      const uid = fbUser.uid;

      const localFound = state.users.find((u) => u.id === uid || u.email?.toLowerCase() === email);
      let userDocData: User | null = localFound ?? null;

      if (!userDocData) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) userDocData = userSnap.data() as User;
      }

      if (!userDocData) {
        const newUser: User = {
          id: uid,
          name: fbUser.displayName || "Nou/va soci/a",
          email,
          role: "pending",
          status: "pending",
          level: "PENDENT",
          avatarUrl: "",
          certification: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, "users", uid), newUser, { merge: true }).catch(() => {});
        setState((prev) => ({ ...prev, currentUser: newUser }));
        return;
      }

      const patched: Partial<User> = {};
      if (!userDocData.level) patched.level = roleToLevel(userDocData.role);
      if (userDocData.avatarUrl === undefined) patched.avatarUrl = "";
      if (!userDocData.email) patched.email = email;

      if (Object.keys(patched).length) {
        await updateDoc(doc(db, "users", uid), { ...patched, updatedAt: serverTimestamp() }).catch(() => {});
        userDocData = { ...userDocData, ...patched } as User;
      }

      setState((prev) => ({ ...prev, currentUser: userDocData }));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => unsub();
  }, [state.users]);

  // ====== PERMISOS (CLAVES) ======
  // Admin: sempre pot gestionar (no depèn de status)
  // Instructor: només si està active
  const canManageTrips = useMemo(() => {
    return () =>
      !!state.currentUser &&
      (state.currentUser.role === "admin" ||
        (state.currentUser.role === "instructor" && state.currentUser.status === "active"));
  }, [state.currentUser]);

  const canManageSystem = useMemo(() => {
    return () => !!state.currentUser && state.currentUser.role === "admin";
  }, [state.currentUser]);

  const isActiveMember = useMemo(() => {
    return () =>
      !!state.currentUser &&
      state.currentUser.status === "active" &&
      state.currentUser.role !== "pending";
  }, [state.currentUser]);

  // ====== AUTH METHODS ======
  const loginWithEmail: AppContextValue["loginWithEmail"] = async (email, password) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) throw new Error("missing_credentials");
    await signInWithEmailAndPassword(auth, trimmed, password);
  };

  const logout: AppContextValue["logout"] = async () => {
    try {
      await signOut(auth);
      setState((prev) => ({ ...prev, currentUser: null }));
    } catch {}
  };

  const registerUser: AppContextValue["registerUser"] = async ({ name, email, password, certification }) => {
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

      const newUser: User = {
        id: cred.user.uid,
        name: trimmedName,
        email: trimmedEmail,
        role: "pending",
        status: "pending",
        level: "PENDENT",
        avatarUrl: "",
        certification: trimmedCert,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", cred.user.uid), newUser, { merge: true });
      alert("Compte creat. Ara l’administració ha d’aprovar el teu accés.");
      await signOut(auth);
    } catch {
      alert("No s’ha pogut crear el compte. Potser el correu ja existeix.");
    }
  };

  const approveUser: AppContextValue["approveUser"] = async (userId) => {
    if (!canManageSystem()) {
      alert("Només administració pot aprovar persones sòcies.");
      return;
    }
    await updateDoc(doc(db, "users", userId), {
      status: "active" as Status,
      role: "member" as Role,
      level: "B1E",
      updatedAt: serverTimestamp(),
    });
  };

  const setUserRole: AppContextValue["setUserRole"] = async (userId, role) => {
    if (!canManageSystem()) {
      alert("Només administració pot canviar rols.");
      return;
    }
    await updateDoc(doc(db, "users", userId), {
      role,
      level: roleToLevel(role),
      status: "active" as Status,
      updatedAt: serverTimestamp(),
    });
  };

  // ====== GUARDS ======
  const ensureCanManageTripsAndCourses = () => {
    if (!canManageTrips()) {
      alert("Només administració o instructors poden gestionar això.");
      return false;
    }
    return true;
  };

  const ensureCanManageSocialEvents = () => {
    if (!canManageSystem()) {
      alert("Només administració pot gestionar esdeveniments.");
      return false;
    }
    return true;
  };

  const baseDefaults = (currentUserId: string) => ({
    createdBy: currentUserId,
    participants: [] as string[],
    pendingParticipants: [] as string[],
    published: false,
    status: "active" as PublishableStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // ====== TRIPS ======
  const createTrip: AppContextValue["createTrip"] = async (data) => {
    if (!ensureCanManageTripsAndCourses()) return;
    assertAuthed(state.currentUser);
    await addDoc(collection(db, "trips"), { ...baseDefaults(state.currentUser.id), ...data });
  };

  const updateTrip: AppContextValue["updateTrip"] = async (tripId, data) => {
    if (!ensureCanManageTripsAndCourses()) return;
    await updateDoc(doc(db, "trips", tripId), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteTrip: AppContextValue["deleteTrip"] = async (tripId) => {
    if (!canManageSystem()) return alert("Només administració pot esborrar definitivament.");
    await deleteDoc(doc(db, "trips", tripId));
  };

  const setTripPublished: AppContextValue["setTripPublished"] = async (tripId, published) => {
    if (!ensureCanManageTripsAndCourses()) return;
    await updateDoc(doc(db, "trips", tripId), { published, updatedAt: serverTimestamp() });
  };

  const cancelTrip: AppContextValue["cancelTrip"] = async (tripId, reason) => {
    if (!ensureCanManageTripsAndCourses()) return;
    await updateDoc(doc(db, "trips", tripId), {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      cancelledReason: reason || "",
      updatedAt: serverTimestamp(),
    });
  };

  // ====== COURSES ======
  const createCourse: AppContextValue["createCourse"] = async (data) => {
    if (!ensureCanManageTripsAndCourses()) return;
    assertAuthed(state.currentUser);
    await addDoc(collection(db, "courses"), { ...baseDefaults(state.currentUser.id), ...data });
  };

  const updateCourse: AppContextValue["updateCourse"] = async (courseId, data) => {
    if (!ensureCanManageTripsAndCourses()) return;
    await updateDoc(doc(db, "courses", courseId), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteCourse: AppContextValue["deleteCourse"] = async (courseId) => {
    if (!canManageSystem()) return alert("Només administració pot esborrar definitivament.");
    await deleteDoc(doc(db, "courses", courseId));
  };

  const setCoursePublished: AppContextValue["setCoursePublished"] = async (courseId, published) => {
    if (!ensureCanManageTripsAndCourses()) return;
    await updateDoc(doc(db, "courses", courseId), { published, updatedAt: serverTimestamp() });
  };

  const cancelCourse: AppContextValue["cancelCourse"] = async (courseId, reason) => {
    if (!ensureCanManageTripsAndCourses()) return;
    await updateDoc(doc(db, "courses", courseId), {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      cancelledReason: reason || "",
      updatedAt: serverTimestamp(),
    });
  };

  // ====== SOCIAL EVENTS (NOMÉS ADMIN) ======
  const createSocialEvent: AppContextValue["createSocialEvent"] = async (data) => {
    if (!ensureCanManageSocialEvents()) return;
    assertAuthed(state.currentUser);
    await addDoc(collection(db, "socialEvents"), { ...baseDefaults(state.currentUser.id), ...data });
  };

  const updateSocialEvent: AppContextValue["updateSocialEvent"] = async (eventId, data) => {
    if (!ensureCanManageSocialEvents()) return;
    await updateDoc(doc(db, "socialEvents", eventId), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteSocialEvent: AppContextValue["deleteSocialEvent"] = async (eventId) => {
    if (!ensureCanManageSocialEvents()) return;
    await deleteDoc(doc(db, "socialEvents", eventId));
  };

  const setSocialEventPublished: AppContextValue["setSocialEventPublished"] = async (eventId, published) => {
    if (!ensureCanManageSocialEvents()) return;
    await updateDoc(doc(db, "socialEvents", eventId), { published, updatedAt: serverTimestamp() });
  };

  const cancelSocialEvent: AppContextValue["cancelSocialEvent"] = async (eventId, reason) => {
    if (!ensureCanManageSocialEvents()) return;
    await updateDoc(doc(db, "socialEvents", eventId), {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      cancelledReason: reason || "",
      updatedAt: serverTimestamp(),
    });
  };

  // ====== JOIN/LEAVE ======
  const ensureCanJoin = () => {
    if (!isActiveMember()) {
      alert("Has d’estar aprovat/da per a apuntar-te.");
      return false;
    }
    return true;
  };

  const joinTrip: AppContextValue["joinTrip"] = async (tripId) => {
    if (!ensureCanJoin()) return;
    assertAuthed(state.currentUser);
    await updateDoc(doc(db, "trips", tripId), {
      participants: arrayUnion(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const leaveTrip: AppContextValue["leaveTrip"] = async (tripId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "trips", tripId), {
      participants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const joinCourse: AppContextValue["joinCourse"] = async (courseId) => {
    if (!ensureCanJoin()) return;
    assertAuthed(state.currentUser);
    await updateDoc(doc(db, "courses", courseId), {
      participants: arrayUnion(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const leaveCourse: AppContextValue["leaveCourse"] = async (courseId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "courses", courseId), {
      participants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const joinSocialEvent: AppContextValue["joinSocialEvent"] = async (eventId) => {
    if (!ensureCanJoin()) return;
    assertAuthed(state.currentUser);
    await updateDoc(doc(db, "socialEvents", eventId), {
      participants: arrayUnion(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const leaveSocialEvent: AppContextValue["leaveSocialEvent"] = async (eventId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "socialEvents", eventId), {
      participants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  // ====== SETTINGS ======
  const updateClubSettings: AppContextValue["updateClubSettings"] = async (data) => {
    if (!canManageSystem()) return alert("Només administració pot modificar la web/app.");
    await setDoc(doc(db, "clubSettings", "main"), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  };

  // ====== MATERIAL ======
  const createResource: AppContextValue["createResource"] = async (data) => {
    if (!ensureCanManageTripsAndCourses()) return;
    assertAuthed(state.currentUser);
    await addDoc(collection(db, "resources"), {
      ...data,
      createdBy: state.currentUser.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateResource: AppContextValue["updateResource"] = async (resourceId, data) => {
    if (!ensureCanManageTripsAndCourses()) return;
    await updateDoc(doc(db, "resources", resourceId), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteResource: AppContextValue["deleteResource"] = async (resourceId) => {
    if (!canManageTrips()) return alert("Només administració o instructors poden eliminar material.");
    await deleteDoc(doc(db, "resources", resourceId));
  };

  const swapResourceOrder: AppContextValue["swapResourceOrder"] = async (aId, bId) => {
    if (!canManageTrips()) {
      alert("Només administració o instructors poden ordenar material.");
      return;
    }

    const aRef = doc(db, "resources", aId);
    const bRef = doc(db, "resources", bId);

    await runTransaction(db, async (tx) => {
      const aSnap = await tx.get(aRef);
      const bSnap = await tx.get(bRef);
      if (!aSnap.exists() || !bSnap.exists()) throw new Error("Resource missing");

      const a = aSnap.data() as any;
      const b = bSnap.data() as any;

      const aOrder = typeof a.order === "number" ? a.order : 999999;
      const bOrder = typeof b.order === "number" ? b.order : 999999;

      tx.update(aRef, { order: bOrder, updatedAt: serverTimestamp() });
      tx.update(bRef, { order: aOrder, updatedAt: serverTimestamp() });
    });
  };

  // ====== MUR SOCIAL ======
  const createSocialPost: AppContextValue["createSocialPost"] = async ({ text, imageUrl }) => {
    if (!isActiveMember()) {
      alert("Has d’estar aprovat/da per publicar.");
      return;
    }
    assertAuthed(state.currentUser);

    const t = text.trim();
    const img = (imageUrl || "").trim();

    if (!t) {
      alert("Escriu algun text per publicar.");
      return;
    }
    if (img && !/^https?:\/\//i.test(img)) {
      alert("La URL de la imatge ha de començar per http:// o https://");
      return;
    }

    await addDoc(collection(db, "socialPosts"), {
      text: t,
      imageUrl: img || "",
      createdBy: state.currentUser.id,
      createdByName: state.currentUser.name,
      createdByAvatarUrl: state.currentUser.avatarUrl || "",
      likes: [],
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const togglePostLike: AppContextValue["togglePostLike"] = async (postId) => {
    if (!isActiveMember()) return;
    assertAuthed(state.currentUser);

    const ref = doc(db, "socialPosts", postId);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error("Post missing");
      const data = snap.data() as any;
      const likes: string[] = Array.isArray(data.likes) ? data.likes : [];
      const uid = state.currentUser.id;

      const has = likes.includes(uid);
      tx.update(ref, {
        likes: has ? likes.filter((x) => x !== uid) : [...likes, uid],
        updatedAt: serverTimestamp(),
      });
    });
  };

  const addPostComment: AppContextValue["addPostComment"] = async (postId, text) => {
    if (!isActiveMember()) return;
    assertAuthed(state.currentUser);

    const t = text.trim();
    if (!t) return;

    const comment: PostComment = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      userAvatarUrl: state.currentUser.avatarUrl || "",
      text: t,
      createdAt: serverTimestamp(),
    };

    await updateDoc(doc(db, "socialPosts", postId), {
      comments: arrayUnion(comment as any),
      updatedAt: serverTimestamp(),
    });
  };

  const deleteSocialPost: AppContextValue["deleteSocialPost"] = async (postId) => {
    if (!isActiveMember()) return;
    assertAuthed(state.currentUser);

    const post = state.socialPosts.find((p) => p.id === postId);
    if (!post) return;

    const allowed = canManageTrips() || post.createdBy === state.currentUser.id;
    if (!allowed) {
      alert("No tens permisos per eliminar aquesta publicació.");
      return;
    }

    await deleteDoc(doc(db, "socialPosts", postId));
  };

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

    createTrip,
    updateTrip,
    deleteTrip,
    setTripPublished,
    cancelTrip,

    createCourse,
    updateCourse,
    deleteCourse,
    setCoursePublished,
    cancelCourse,

    createSocialEvent,
    updateSocialEvent,
    deleteSocialEvent,
    setSocialEventPublished,
    cancelSocialEvent,

    joinTrip,
    leaveTrip,
    joinCourse,
    leaveCourse,
    joinSocialEvent,
    leaveSocialEvent,

    updateClubSettings,

    createResource,
    updateResource,
    deleteResource,
    swapResourceOrder,

    createSocialPost,
    togglePostLike,
    addPostComment,
    deleteSocialPost,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

export const useApp = useAppContext;

export const useApp = useAppContext;
