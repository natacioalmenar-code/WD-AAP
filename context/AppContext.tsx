import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserRole,
  UserStatus,
  Trip,
  Course,
} from '../types'; // ajusta el path si cal

// Estat global de l'app
interface AppState {
  users: User[];
  trips: Trip[];
  courses: Course[];
  currentUser: User | null;
}

interface AppContextValue extends AppState {
  // auth bàsic
  loginAsAdmin: () => void;
  loginAsUser: (email: string) => void;
  logout: () => void;

  // usuaris
  registerUser: (data: Omit<User, 'id' | 'status' | 'role' | 'diveCount' | 'gear'>) => void;
  approveUser: (userId: string) => void;
  setUserRole: (userId: string, role: UserRole) => void;

  // sortides / cursos
  createTrip: (trip: Omit<Trip, 'id' | 'participants'>) => void;
  createCourse: (course: Omit<Course, 'id' | 'participants'>) => void;

  joinTrip: (tripId: string) => void;
  joinCourse: (courseId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEY = 'wd-app-state-v1';

// Dades inicials de demo
const initialAdminUser: User = {
  id: 'admin-1',
  name: 'Administrador West Divers',
  email: 'admin@westdivers.test',
  level: UserRole.ADMIN as any, // ajustarem si cal
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  diveCount: 0,
  gear: [],
};

const initialState: AppState = {
  users: [initialAdminUser],
  trips: [],
  courses: [],
  currentUser: initialAdminUser,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Carregar de localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppState;
        setState(parsed);
      } catch {
        // si falla, mantenim initialState
      }
    }
  }, []);

  // Desar a localStorage cada vegada que canviï
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const loginAsAdmin = () => {
    setState((prev) => ({
      ...prev,
      currentUser: initialAdminUser,
    }));
  };

  const loginAsUser = (email: string) => {
    setState((prev) => {
      const user = prev.users.find((u) => u.email === email);
      if (!user) {
        alert('No hi ha cap usuari amb aquest correu.');
        return prev;
      }
      if (user.status !== UserStatus.ACTIVE) {
        alert('Aquest usuari encara no ha estat aprovat per un administrador.');
        return prev;
      }
      return {
        ...prev,
        currentUser: user,
      };
    });
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      currentUser: null,
    }));
  };

  const registerUser: AppContextValue['registerUser'] = (data) => {
    setState((prev) => ({
      ...prev,
      users: [
        ...prev.users,
        {
          ...data,
          id: crypto.randomUUID(),
          role: UserRole.MEMBER,
          status: UserStatus.PENDING,
          diveCount: 0,
          gear: [],
        },
      ],
    }));
    alert(
      'T’has registrat correctament. Un administrador haurà d’aprovar el teu compte.'
    );
  };

  const approveUser: AppContextValue['approveUser'] = (userId) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, status: UserStatus.ACTIVE } : u
      ),
    }));
  };

  const setUserRole: AppContextValue['setUserRole'] = (userId, role) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, role } : u
      ),
    }));
  };

  const createTrip: AppContextValue['createTrip'] = (tripData) => {
    if (!state.currentUser) {
      alert('Has d’estar identificat per crear sortides');
      return;
    }
    setState((prev) => ({
      ...prev,
      trips: [
        ...prev.trips,
        {
          ...tripData,
          id: crypto.randomUUID(),
          participants: [],
        },
      ],
    }));
  };

  const createCourse: AppContextValue['createCourse'] = (courseData) => {
    if (!state.currentUser) {
      alert('Has d’estar identificat per crear cursos');
      return;
    }
    setState((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        {
          ...courseData,
          id: crypto.randomUUID(),
          participants: [],
        },
      ],
    }));
  };

  const joinTrip: AppContextValue['joinTrip'] = (tripId) => {
    if (!state.currentUser) {
      alert('Has d’iniciar sessió per apuntar-te a una sortida');
      return;
    }
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId && !t.participants.includes(state.currentUser!.id)
          ? { ...t, participants: [...t.participants, state.currentUser!.id] }
          : t
      ),
    }));
  };

  const joinCourse: AppContextValue['joinCourse'] = (courseId) => {
    if (!state.currentUser) {
      alert('Has d’iniciar sessió per apuntar-te a un curs');
      return;
    }
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId && !c.participants.includes(state.currentUser!.id)
          ? { ...c, participants: [...c.participants, state.currentUser!.id] }
          : c
      ),
    }));
  };

  const value: AppContextValue = {
    ...state,
    loginAsAdmin,
    loginAsUser,
    logout,
    registerUser,
    approveUser,
    setUserRole,
    createTrip,
    createCourse,
    joinTrip,
    joinCourse,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
