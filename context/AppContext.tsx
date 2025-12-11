import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export type Role = 'admin' | 'instructor' | 'member' | 'pending';
export type Status = 'pending' | 'active';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  location: string;
  levelRequired: string;
  maxSpots: number;
  createdBy: string; // user id
  participants: string[];
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

interface AppState {
  users: User[];
  trips: Trip[];
  courses: Course[];
  currentUser: User | null;
}

interface AppContextValue extends AppState {
  // auth
  loginAsDemoAdmin: () => void;
  loginWithEmail: (email: string) => void;
  logout: () => void;

  // alta i gestió d'usuaris
  registerUser: (data: { name: string; email: string }) => void;
  approveUser: (userId: string) => void;
  setUserRole: (userId: string, role: Role) => void;

  // sortides / cursos
  createTrip: (data: Omit<Trip, 'id' | 'createdBy' | 'participants'>) => void;
  createCourse: (data: Omit<Course, 'id' | 'createdBy' | 'participants'>) => void;
  joinTrip: (tripId: string) => void;
  joinCourse: (courseId: string) => void;
}

const STORAGE_KEY = 'westdivers-app-state-v1';

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialAdmin: User = {
  id: 'admin-1',
  name: 'Administrador West Divers',
  email: 'admin@westdivers.local',
  role: 'admin',
  status: 'active',
};

const initialState: AppState = {
  users: [initialAdmin],
  trips: [],
  courses: [],
  currentUser: initialAdmin,
};

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  // carregar de localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppState;
        setState(parsed);
      } catch {
        // ignorem errors i usem initialState
      }
    }
  }, []);

  // desar sempre que canviï
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const loginAsDemoAdmin = () => {
    setState((prev) => ({ ...prev, currentUser: initialAdmin }));
  };

  const loginWithEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    setState((prev) => {
      const user = prev.users.find((u) => u.email.toLowerCase() === trimmed);
      if (!user) {
        alert('No hi ha cap usuari amb aquest correu.');
        return prev;
      }
      if (user.status !== 'active') {
        alert('Encara no s’ha aprovat aquest compte.');
        return prev;
      }
      return { ...prev, currentUser: user };
    });
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUser: null }));
  };

  const registerUser: AppContextValue['registerUser'] = ({ name, email }) => {
    setState((prev) => {
      const trimmed = email.trim().toLowerCase();
      if (prev.users.some((u) => u.email.toLowerCase() === trimmed)) {
        alert('Ja existeix un usuari amb aquest correu.');
        return prev;
      }
      const user: User = {
        id: createId(),
        name: name.trim(),
        email: trimmed,
        role: 'pending',
        status: 'pending',
      };
      alert(
        'Sol·licitud enviada. Un administrador revisarà i aprovarà el teu accés.'
      );
      return { ...prev, users: [...prev.users, user] };
    });
  };

  const approveUser: AppContextValue['approveUser'] = (userId) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, status: 'active', role: 'member' } : u
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

  const ensureCanCreate = () => {
    if (!state.currentUser) {
      alert('Has d’iniciar sessió.');
      return false;
    }
    if (
      state.currentUser.role !== 'admin' &&
      state.currentUser.role !== 'instructor'
    ) {
      alert('Només administradors o instructors poden crear això.');
      return false;
    }
    return true;
  };

  const createTrip: AppContextValue['createTrip'] = (data) => {
    if (!ensureCanCreate()) return;
    setState((prev) => ({
      ...prev,
      trips: [
        ...prev.trips,
        {
          ...data,
          id: createId(),
          createdBy: prev.currentUser!.id,
          participants: [],
        },
      ],
    }));
  };

  const createCourse: AppContextValue['createCourse'] = (data) => {
    if (!ensureCanCreate()) return;
    setState((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
          {
            ...data,
            id: createId(),
            createdBy: prev.currentUser!.id,
            participants: [],
          },
      ],
    }));
  };

  const joinTrip: AppContextValue['joinTrip'] = (tripId) => {
    if (!state.currentUser) {
      alert('Has d’iniciar sessió per apuntar-te.');
      return;
    }
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId && !t.participants.includes(prev.currentUser!.id)
          ? {
              ...t,
              participants: [...t.participants, prev.currentUser!.id],
            }
          : t
      ),
    }));
  };

  const joinCourse: AppContextValue['joinCourse'] = (courseId) => {
    if (!state.currentUser) {
      alert('Has d’iniciar sessió per apuntar-te.');
      return;
    }
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId && !c.participants.includes(prev.currentUser!.id)
          ? {
              ...c,
              participants: [...c.participants, prev.currentUser!.id],
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
