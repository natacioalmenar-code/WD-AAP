
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Trip, UserStatus, UserLevel, UserRole, Course, SocialEvent, Resource, GearItem, Post, ClubSettings } from '../types';
import { MOCK_USERS, MOCK_TRIPS, MOCK_COURSES, MOCK_EVENTS, MOCK_RESOURCES, MOCK_POSTS, DEFAULT_CLUB_SETTINGS } from '../services/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  trips: Trip[];
  courses: Course[];
  events: SocialEvent[];
  resources: Resource[];
  posts: Post[];
  clubSettings: ClubSettings;
  
  login: (email: string) => boolean;
  register: (name: string, email: string, level: UserLevel) => void;
  logout: () => void;
  
  // User Management (Admin)
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  
  // Profile Actions
  addUserGearItem: (item: GearItem) => void;
  removeUserGearItem: (itemId: string) => void;
  updateUserDocs: (docs: Partial<User>) => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Trip actions
  joinTrip: (tripId: string) => void;
  leaveTrip: (tripId: string) => void;
  addTrip: (trip: Trip) => void;
  deleteTrip: (tripId: string) => void;
  // Course actions
  joinCourse: (courseId: string) => void;
  leaveCourse: (courseId: string) => void;
  // Event actions
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  
  // Social Wall
  addPost: (content: string) => void;
  likePost: (postId: string) => void;

  // Settings Management
  updateClubSettings: (settings: Partial<ClubSettings>) => void;

  // Helpers
  getParticipantDetails: (userIds: string[]) => User[];
  getUserById: (userId: string) => User | undefined;
  canManageTrips: () => boolean;
  canManageSystem: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [events, setEvents] = useState<SocialEvent[]>(MOCK_EVENTS);
  const [resources] = useState<Resource[]>(MOCK_RESOURCES);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [clubSettings, setClubSettings] = useState<ClubSettings>(DEFAULT_CLUB_SETTINGS);

  const login = (email: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (user.status === UserStatus.PENDING) {
        alert("El teu compte està pendent d'aprovació per l'administrador.");
        return false;
      }
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, level: UserLevel) => {
    // DEMO MODE: Auto-activate new users so you can test immediately
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      level,
      role: UserRole.MEMBER,
      status: UserStatus.ACTIVE, // Changed from PENDING to ACTIVE for demo
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
      specialties: [],
      diveCount: 0,
      gear: []
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser); // Auto login
    alert("Compte creat correctament! (Mode Demo: Auto-aprovat)");
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- ADMIN USER MANAGEMENT ---

  const approveUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: UserStatus.ACTIVE } : u));
  };

  const rejectUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
  };

  // --- SETTINGS MANAGEMENT ---
  const updateClubSettings = (settings: Partial<ClubSettings>) => {
      setClubSettings(prev => ({ ...prev, ...settings }));
  };

  // --- PROFILE MANAGEMENT ---

  const addUserGearItem = (item: GearItem) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, gear: [...currentUser.gear, item] };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const removeUserGearItem = (itemId: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, gear: currentUser.gear.filter(g => g.id !== itemId) };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const updateUserDocs = (docs: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...docs };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const canManageTrips = () => {
    if (!currentUser) return false;
    return currentUser.role === UserRole.INSTRUCTOR || currentUser.role === UserRole.ADMIN;
  }

  const canManageSystem = () => {
    if (!currentUser) return false;
    return currentUser.role === UserRole.ADMIN;
  }

  // --- JOIN/LEAVE LOGIC ---

  const joinTrip = (tripId: string) => {
    if (!currentUser) return;
    setTrips(prev => prev.map(t => {
      if (t.id === tripId && !t.participants.includes(currentUser.id) && t.participants.length < t.maxSpots) {
           return { ...t, participants: [...t.participants, currentUser.id] };
      }
      return t;
    }));
  };

  const leaveTrip = (tripId: string) => {
    if (!currentUser) return;
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, participants: t.participants.filter(id => id !== currentUser.id) } : t));
  };

  const joinCourse = (courseId: string) => {
    if (!currentUser) return;
    setCourses(prev => prev.map(c => {
      if (c.id === courseId && !c.participants.includes(currentUser.id) && c.participants.length < c.maxSpots) {
           return { ...c, participants: [...c.participants, currentUser.id] };
      }
      return c;
    }));
  };

  const leaveCourse = (courseId: string) => {
    if (!currentUser) return;
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, participants: c.participants.filter(id => id !== currentUser.id) } : c));
  };

  const joinEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents(prev => prev.map(e => {
      if (e.id === eventId && !e.participants.includes(currentUser.id)) {
           return { ...e, participants: [...e.participants, currentUser.id] };
      }
      return e;
    }));
  };

  const leaveEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, participants: e.participants.filter(id => id !== currentUser.id) } : e));
  };

  // --- SOCIAL WALL ---
  const addPost = (content: string) => {
    if (!currentUser) return;
    const newPost: Post = {
        id: `p${Date.now()}`,
        authorId: currentUser.id,
        content,
        date: new Date().toISOString(),
        likes: []
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            if (p.likes.includes(currentUser.id)) {
                return { ...p, likes: p.likes.filter(id => id !== currentUser.id) };
            } else {
                return { ...p, likes: [...p.likes, currentUser.id] };
            }
        }
        return p;
    }));
  };

  // --- MANAGEMENT LOGIC ---

  const addTrip = (trip: Trip) => {
    setTrips(prev => [...prev, trip]);
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const getParticipantDetails = (userIds: string[]): User[] => {
    return users.filter(user => userIds.includes(user.id));
  };

  const getUserById = (userId: string) => {
      return users.find(u => u.id === userId);
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      users,
      trips,
      courses,
      events,
      resources,
      posts,
      clubSettings,
      login, 
      register, 
      logout,
      
      approveUser,
      rejectUser,
      updateUserRole,

      addUserGearItem,
      removeUserGearItem,
      updateUserDocs,
      updateUserProfile,
      
      joinTrip, 
      leaveTrip,
      joinCourse,
      leaveCourse,
      joinEvent,
      leaveEvent,
      addTrip,
      deleteTrip,
      
      addPost,
      likePost,

      updateClubSettings,

      getParticipantDetails,
      getUserById,
      canManageTrips,
      canManageSystem
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};