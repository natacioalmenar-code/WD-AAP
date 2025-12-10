
export enum UserLevel {
  B1E = 'B1E - 1 Estel',
  B2E = 'B2E - 2 Estels',
  B3E = 'B3E - 3 Estels',
  INSTRUCTOR_1E = 'Instructor 1E',
  INSTRUCTOR_2E = 'Instructor 2E',
  INSTRUCTOR_3E = 'Instructor 3E',
  GG = 'Guia de Grup'
}

export enum UserRole {
  MEMBER = 'Soci',
  ADMIN = 'Admin General', // Can change everything and manage users
  INSTRUCTOR = 'Instructor' // Can manage trips/courses
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active'
}

export interface GearItem {
  id: string;
  type: string; // e.g., "Màscara", "Regulador", "Foco"
  description: string; // Brand and Model
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: UserLevel;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  
  // Extended Profile Data
  certificationNumber?: string; // Títol de busseig
  specialties?: string[]; // Nitrox, Dry Suit, etc.
  
  diveCount: number;
  lastDiveDate?: string;
  
  // Docs
  insuranceExpiry?: string;
  insuranceCompany?: string;
  insurancePolicy?: string;
  medicalCertExpiry?: string;
  licenseNumber?: string; // Llicència Federativa
  
  // Dynamic Gear
  gear: GearItem[];
}

export interface ClubSettings {
  logoUrl: string;
  navbarPreTitle: string; // Text above "WEST DIVERS"
  appBackgroundUrl: string; // Subtle texture for the app
  homeHeroImageUrl: string; // Big image on landing page
  heroTitle: string;
  heroSubtitle: string; // "Passió pel blau..."
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  locationUrl?: string; // Google Maps Link
  depth: string;
  levelRequired: string;
  description: string;
  maxSpots: number;
  imageUrl: string;
  participants: string[]; // Array of User IDs
}

export interface Course {
  id: string;
  title: string;
  date: string; // Start date
  endDate?: string;
  schedule: string; // e.g., "Dissabtes i Diumenges"
  description: string;
  price: string;
  levelRequired: string; // Prerequisite
  imageUrl: string;
  maxSpots: number;
  participants: string[];
}

export interface SocialEvent {
  id: string;
  title: string; // e.g., "Xarrada Biologia", "Sopar de Nadal"
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'talk' | 'workshop' | 'gathering'; // gathering = sopars, dinars, festes
  participants: string[];
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  date: string; // ISO string
  likes: string[]; // User IDs
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  category: 'manual' | 'table' | 'map' | 'form';
  url: string;
  description?: string;
  levelRequired?: UserLevel;
}