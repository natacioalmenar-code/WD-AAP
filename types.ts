// WD-AAP-main/types.ts

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

export type PublishableStatus = "active" | "cancelled";

export interface User {
  id: string; // Firebase uid
  name: string;
  email: string;

  role: Role;
  status: Status;

  // perfil bàsic actual
  level: string; // per UI (ex: B1E, INSTRUCTOR, ADMIN...)
  avatarUrl: string;

  certification?: string;

  createdAt?: any;
  updatedAt?: any;
}

export interface PublishableBase {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  createdBy: string; // uid
  published: boolean;
  status: PublishableStatus;

  // participants aprovats
  participants: string[];

  // sol·licituds pendents
  pendingParticipants: string[];

  createdAt?: any;
  updatedAt?: any;
  cancelledAt?: any;
  cancelledReason?: string;
}

export interface Trip extends PublishableBase {
  location: string;
  levelRequired: string;
  maxSpots: number;

  time?: string;
  depth?: string;
  description?: string;
  imageUrl?: string;
  locationUrl?: string;
}

export interface Course extends PublishableBase {
  schedule: string;
  description: string;
  price: string;
  levelRequired: string;

  maxSpots?: number;
  imageUrl?: string;
  endDate?: string;
}

export interface SocialEvent extends PublishableBase {
  time?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  locationUrl?: string;
  maxSpots?: number;

  type?: "talk" | "workshop" | "gathering";
}

export interface ClubSettings {
  logoUrl: string;
  navbarPreTitle: string;
  heroTitle: string;

  appBackgroundUrl?: string;

  // opcional si el tens a altres pantalles
  homeHeroImageUrl?: string;
  heroSubtitle?: string;

  updatedAt?: any;
}

