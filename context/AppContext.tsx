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
} from "../types";

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
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // registre socis/es
  registerUser: (data: {
    name: string;
    email: string;
    password: string;
    certification: string;
  }) => Promise<void>;

  // admins
  approveUser: (userId: string) => Promise<void>;
  setUserRole: (userId: string, role: Role) => Promise<void>;

  // permisos
  canManageTrips: () => boolean; // admin o instructor
  canManageSystem: () => boolean; // admin
  isActiveMember: () => boolean; // status active i role != pending

  // CRUD Trips/Courses/Events
  createTrip: (data: Omit<Trip, "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status">) => Promise<void>;
  updateTrip: (tripId: string, data: Partial<Trip>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  setTripPublished: (tripId: string, published: boolean) => Promise<void>;
  cancelTrip: (tripId: string, reason?: string) => Promise<void>;

  createCourse: (data: Omit<Course, "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status">) => Promise<void>;
  updateCourse: (courseId: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  setCoursePublished: (courseId: string, published: boolean) => Promise<void>;
  cancelCourse: (courseId: string, reason?: string) => Promise<void>;

  createSocialEvent: (data: Omit<SocialEvent, "id" | "createdBy" | "participants" | "pendingParticipants" | "published" | "status">) => Promise<void>;
  updateSocialEvent: (eventId: string, data: Partial<SocialEvent>) => Promise<void>;
  deleteSocialEvent: (eventId: string) => Promise<void>;
  setSocialEventPublished: (eventId: string, published: boolean) => Promise<void>;
  cancelSocialEvent: (eventId: string, reason?: string) => Promise<void>;

  // inscripcions (amb aprovació)
  requestJoinTrip: (tripId: string) => Promise<void>;
  cancelJoinRequestTrip: (tripId: string) => Promise<void>;
  approveTripRequest: (tripId: string, userId: string) => Promise<void>;
  rejectTripRequest: (tripId: string, userId: string) => Promise<void>;
  leaveTrip: (tripId: string) => Promise<void>;

  requestJoinCourse: (courseId: string) => Promise<void>;
  cancelJoinRequestCourse: (courseId: string) => Promise<void>;
  approveCourseRequest: (courseId: string, userId: string) => Promise<void>;
  rejectCourseRequest: (courseId: string, userId: string) => Promise<void>;
  leaveCourse: (courseId: string) => Promise<void>;

  requestJoinSocialEvent: (eventId: string) => Promise<void>;
  cancelJoinRequestSocialEvent: (eventId: string) => Promise<void>;
  approveSocialEventRequest: (eventId: string, userId: string) => Promise<void>;
  rejectSocialEventRequest: (eventId: string, userId: string) => Promise<void>;
  leaveSocialEvent: (eventId: string) => Promise<void>;

  // compatibilitat amb codi antic (si hi ha pàgines que encara ho criden)
  joinTrip: (tripId: string) => Promise<void>;
  joinCourse: (courseId: string) => Promise<void>;
  joinSocialEvent: (eventId: string) => Promise<void>;

  // settings
  updateClubSettings: (data: Partial<ClubSettings>) => Promise<void>;
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
    currentUser: null,
    clubSettings: defaultClubSettings,
  });

  /**
   * 1) Subscriptions Firestore: users, trips, courses, events, settings
   */
  useEffect(() => {
    const unsubUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "asc")),
      (snap) => {
        const users = snap.docs.map((d) => d.data() as User);
        setState((prev) => {
          // refresca currentUser si existeix
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

    const settingsRef = doc(db, "clubSettings", "main");
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (!snap.exists()) {
        // crea settings per defecte si no existeix
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
      unsubSettings();
    };
  }, []);

  /**
   * 2) Auth listener -> assegura doc user a Firestore
   */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser?.email) {
        setState((prev) => ({ ...prev, currentUser: null }));
        return;
      }

      const email = fbUser.email.toLowerCase();
      const uid = fbUser.uid;

      // Intenta trobar user existent en estat (per velocitat)
      const localFound = state.users.find((u) => u.id === uid || u.email?.toLowerCase() === email);

      // Si no està en estat encara, consulta Firestore
      let userDocData: User | null = localFound ?? null;

      if (!userDocData) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) userDocData = userSnap.data() as User;
      }

      // Si no existeix userDoc, crea'l com pending
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

      // Normalitza camps mínims (per migracions)
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

    // IMPORTANT: depenem de state.users, però no volem resubscribe constant.
    // Es gestiona bé perquè el listener s'executa quan canvia auth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => unsub();
  }, [state.users]);

  /**
   * Permisos
   */
  const canManageTrips = useMemo(() => {
    return () =>
      !!state.currentUser &&
      state.currentUser.status === "active" &&
      (state.currentUser.role === "admin" || state.currentUser.role === "instructor");
  }, [state.currentUser]);

  const canManageSystem = useMemo(() => {
    return () =>
      !!state.currentUser &&
      state.currentUser.status === "active" &&
      state.currentUser.role === "admin";
  }, [state.currentUser]);

  const isActiveMember = useMemo(() => {
    return () =>
      !!state.currentUser &&
      state.currentUser.status === "active" &&
      state.currentUser.role !== "pending";
  }, [state.currentUser]);

  /**
   * AUTH
   */
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

  /**
   * REGISTRE
   */
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

  /**
   * ADMINS: aprovar usuari / canviar rol
   */
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
      // si li dones rol admin/instructor, normalment ha d'estar actiu
      status: "active" as Status,
      updatedAt: serverTimestamp(),
    });
  };

  /**
   * Helpers CRUD publishable
   */
  const ensureCanCreateOrEdit = () => {
    if (!canManageTrips()) {
      alert("Només administració o instructors poden gestionar això.");
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

  /**
   * TRIPS
   */
  const createTrip: AppContextValue["createTrip"] = async (data) => {
    if (!ensureCanCreateOrEdit()) return;
    assertAuthed(state.currentUser);

    await addDoc(collection(db, "trips"), {
      ...baseDefaults(state.currentUser.id),
      ...data,
    });
  };

  const updateTrip: AppContextValue["updateTrip"] = async (tripId, data) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "trips", tripId), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteTrip: AppContextValue["deleteTrip"] = async (tripId) => {
    if (!canManageSystem()) {
      alert("Només administració pot esborrar definitivament.");
      return;
    }
    await deleteDoc(doc(db, "trips", tripId));
  };

  const setTripPublished: AppContextValue["setTripPublished"] = async (tripId, published) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "trips", tripId), { published, updatedAt: serverTimestamp() });
  };

  const cancelTrip: AppContextValue["cancelTrip"] = async (tripId, reason) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "trips", tripId), {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      cancelledReason: reason || "",
      updatedAt: serverTimestamp(),
    });
  };

  /**
   * COURSES
   */
  const createCourse: AppContextValue["createCourse"] = async (data) => {
    if (!ensureCanCreateOrEdit()) return;
    assertAuthed(state.currentUser);

    await addDoc(collection(db, "courses"), {
      ...baseDefaults(state.currentUser.id),
      ...data,
    });
  };

  const updateCourse: AppContextValue["updateCourse"] = async (courseId, data) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "courses", courseId), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteCourse: AppContextValue["deleteCourse"] = async (courseId) => {
    if (!canManageSystem()) {
      alert("Només administració pot esborrar definitivament.");
      return;
    }
    await deleteDoc(doc(db, "courses", courseId));
  };

  const setCoursePublished: AppContextValue["setCoursePublished"] = async (courseId, published) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "courses", courseId), { published, updatedAt: serverTimestamp() });
  };

  const cancelCourse: AppContextValue["cancelCourse"] = async (courseId, reason) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "courses", courseId), {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      cancelledReason: reason || "",
      updatedAt: serverTimestamp(),
    });
  };

  /**
   * SOCIAL EVENTS
   */
  const createSocialEvent: AppContextValue["createSocialEvent"] = async (data) => {
    if (!ensureCanCreateOrEdit()) return;
    assertAuthed(state.currentUser);

    await addDoc(collection(db, "socialEvents"), {
      ...baseDefaults(state.currentUser.id),
      ...data,
    });
  };

  const updateSocialEvent: AppContextValue["updateSocialEvent"] = async (eventId, data) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "socialEvents", eventId), { ...data, updatedAt: serverTimestamp() });
  };

  const deleteSocialEvent: AppContextValue["deleteSocialEvent"] = async (eventId) => {
    if (!canManageSystem()) {
      alert("Només administració pot esborrar definitivament.");
      return;
    }
    await deleteDoc(doc(db, "socialEvents", eventId));
  };

  const setSocialEventPublished: AppContextValue["setSocialEventPublished"] = async (eventId, published) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "socialEvents", eventId), { published, updatedAt: serverTimestamp() });
  };

  const cancelSocialEvent: AppContextValue["cancelSocialEvent"] = async (eventId, reason) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "socialEvents", eventId), {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      cancelledReason: reason || "",
      updatedAt: serverTimestamp(),
    });
  };

  /**
   * Inscripcions: patró comú
   * - membres actius: requestJoin -> pendingParticipants
   * - instructors/admin: approve/reject pendents
   * - leave: treure de participants (aprovats)
   */
  const ensureCanRequest = () => {
    if (!isActiveMember()) {
      alert("Has d’estar aprovat/da per a apuntar-te.");
      return false;
    }
    return true;
  };

  const requestJoinTrip: AppContextValue["requestJoinTrip"] = async (tripId) => {
    if (!ensureCanRequest()) return;
    assertAuthed(state.currentUser);

    await updateDoc(doc(db, "trips", tripId), {
      pendingParticipants: arrayUnion(state.currentUser.id),
      // per si estava dins participants i volia re-sol·licitar (casos raros)
      participants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const cancelJoinRequestTrip: AppContextValue["cancelJoinRequestTrip"] = async (tripId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "trips", tripId), {
      pendingParticipants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const approveTripRequest: AppContextValue["approveTripRequest"] = async (tripId, userId) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "trips", tripId), {
      pendingParticipants: arrayRemove(userId),
      participants: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  };

  const rejectTripRequest: AppContextValue["rejectTripRequest"] = async (tripId, userId) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "trips", tripId), {
      pendingParticipants: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  };

  const leaveTrip: AppContextValue["leaveTrip"] = async (tripId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "trips", tripId), {
      participants: arrayRemove(state.currentUser.id),
      pendingParticipants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const requestJoinCourse: AppContextValue["requestJoinCourse"] = async (courseId) => {
    if (!ensureCanRequest()) return;
    assertAuthed(state.currentUser);

    await updateDoc(doc(db, "courses", courseId), {
      pendingParticipants: arrayUnion(state.currentUser.id),
      participants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const cancelJoinRequestCourse: AppContextValue["cancelJoinRequestCourse"] = async (courseId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "courses", courseId), {
      pendingParticipants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const approveCourseRequest: AppContextValue["approveCourseRequest"] = async (courseId, userId) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "courses", courseId), {
      pendingParticipants: arrayRemove(userId),
      participants: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  };

  const rejectCourseRequest: AppContextValue["rejectCourseRequest"] = async (courseId, userId) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "courses", courseId), {
      pendingParticipants: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  };

  const leaveCourse: AppContextValue["leaveCourse"] = async (courseId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "courses", courseId), {
      participants: arrayRemove(state.currentUser.id),
      pendingParticipants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const requestJoinSocialEvent: AppContextValue["requestJoinSocialEvent"] = async (eventId) => {
    if (!ensureCanRequest()) return;
    assertAuthed(state.currentUser);

    await updateDoc(doc(db, "socialEvents", eventId), {
      pendingParticipants: arrayUnion(state.currentUser.id),
      participants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const cancelJoinRequestSocialEvent: AppContextValue["cancelJoinRequestSocialEvent"] = async (eventId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "socialEvents", eventId), {
      pendingParticipants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  const approveSocialEventRequest: AppContextValue["approveSocialEventRequest"] = async (eventId, userId) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "socialEvents", eventId), {
      pendingParticipants: arrayRemove(userId),
      participants: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  };

  const rejectSocialEventRequest: AppContextValue["rejectSocialEventRequest"] = async (eventId, userId) => {
    if (!ensureCanCreateOrEdit()) return;
    await updateDoc(doc(db, "socialEvents", eventId), {
      pendingParticipants: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  };

  const leaveSocialEvent: AppContextValue["leaveSocialEvent"] = async (eventId) => {
    if (!state.currentUser) return;
    await updateDoc(doc(db, "socialEvents", eventId), {
      participants: arrayRemove(state.currentUser.id),
      pendingParticipants: arrayRemove(state.currentUser.id),
      updatedAt: serverTimestamp(),
    });
  };

  /**
   * Compatibilitat amb codi antic:
   * - abans joinX afegia directe a participants
   * - ara joinX = requestJoinX (passa a pending)
   */
  const joinTrip: AppContextValue["joinTrip"] = (tripId) => requestJoinTrip(tripId);
  const joinCourse: AppContextValue["joinCourse"] = (courseId) => requestJoinCourse(courseId);
  const joinSocialEvent: AppContextValue["joinSocialEvent"] = (eventId) => requestJoinSocialEvent(eventId);

  /**
   * Settings
   */
  const updateClubSettings: AppContextValue["updateClubSettings"] = async (data) => {
    if (!canManageSystem()) {
      alert("Només administració pot modificar la web/app.");
      return;
    }
    await setDoc(
      doc(db, "clubSettings", "main"),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
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

    requestJoinTrip,
    cancelJoinRequestTrip,
    approveTripRequest,
    rejectTripRequest,
    leaveTrip,

    requestJoinCourse,
    cancelJoinRequestCourse,
    approveCourseRequest,
    rejectCourseRequest,
    leaveCourse,

    requestJoinSocialEvent,
    cancelJoinRequestSocialEvent,
    approveSocialEventRequest,
    rejectSocialEventRequest,
    leaveSocialEvent,

    joinTrip,
    joinCourse,
    joinSocialEvent,

    updateClubSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

export const useApp = useAppContext;
