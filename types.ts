// types.ts

export type Role = "admin" | "instructor" | "member" | "pending";
export type Status = "active" | "pending";
export type PublishableStatus = "active" | "cancelled";

export type FecdAsLevel =
  | "B1E"
  | "B2E"
  | "B3E"
  | "AOWD"
  | "RESCUE"
  | "DIVEMASTER"
  | "INSTRUCTOR"
  | "ADMIN"
  | "PENDENT";

export const FECDAS_LEVELS: FecdAsLevel[] = [
  "B1E",
  "B2E",
  "B3E",
  "AOWD",
  "RESCUE",
  "DIVEMASTER",
  "INSTRUCTOR",
  "ADMIN",
  "PENDENT",
];

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
  status: Status;
  level: FecdAsLevel | string;
  avatarUrl: string;
  certification?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  location: string;
  levelRequired: string;
  maxSpots: number;
  price?: string;
  notes?: string;

  createdBy: string;
  participants: string[];
  pendingParticipants?: string[];

  published: boolean;
  status: PublishableStatus;
  cancelledReason?: string;
  cancelledAt?: any;

  createdAt?: any;
  updatedAt?: any;
}

export interface Course {
  id: string;
  title: string;
  date: string;
  schedule: string;
  levelRequired: string;
  maxSpots?: number;
  price?: string;
  notes?: string;

  createdBy: string;
  participants: string[];
  pendingParticipants?: string[];

  published: boolean;
  status: PublishableStatus;
  cancelledReason?: string;
  cancelledAt?: any;

  createdAt?: any;
  updatedAt?: any;
}

export interface SocialEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  maxSpots?: number;
  notes?: string;

  createdBy: string;
  participants: string[];
  pendingParticipants?: string[];

  published: boolean;
  status: PublishableStatus;
  cancelledReason?: string;
  cancelledAt?: any;

  createdAt?: any;
  updatedAt?: any;
}

export interface ClubSettings {
  logoUrl: string;
  navbarPreTitle: string;
  heroTitle: string;
  appBackgroundUrl?: string;
  updatedAt?: any;
}

/** ✅ MATERIAL / RESOURCES */
export type ResourceCategory =
  | "Seguretat"
  | "Formació"
  | "Protocols"
  | "Equip"
  | "Medi ambient"
  | "Altres"
  | string;

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: ResourceCategory;

  /** ordre manual dins de cada categoria (1,2,3...) */
  order: number;

  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}
