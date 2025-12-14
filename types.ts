// types.ts

export type Role = "admin" | "instructor" | "member" | "pending";
export type Status = "active" | "pending";
export type PublishableStatus = "active" | "cancelled";

/**
 * ✅ Titulacions FECDAS / CMAS que vols usar
 * (PENDENT és estat intern del sistema)
 */
export type FecdAsLevel =
  | "B1E"
  | "B2E"
  | "B3E"
  | "GG"
  | "IN1E"
  | "IN2E"
  | "IN3E"
  | "PENDENT";

export const FECDAS_LEVELS: FecdAsLevel[] = [
  "B1E",
  "B2E",
  "B3E",
  "GG",
  "IN1E",
  "IN2E",
  "IN3E",
  "PENDENT",
];

/**
 * ✅ Llista inicial d’especialitats (editable quan vulgues)
 * Pots afegir-ne més sense tocar la DB.
 */
export const FECDAS_SPECIALTIES: string[] = [
  "Nitrox",
  "Administració d’oxigen",
  "Suport vital bàsic (SVB/RCP)",
  "Rescat subaquàtic",
  "Navegació subaquàtica",
  "Busseig nocturn",
  "Vestit sec",
  "Busseig en derelictes",
  "Busseig en grutes",
  "Busseig en corrents",
  "Fotografia subaquàtica",
  "Vídeo subaquàtic",
  "Flotabilitat avançada",
  "Identificació de fauna i flora",
  "Busseig adaptat",
];

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
  status: Status;

  /**
   * ✅ Camp històric (es manté per compatibilitat amb pantalles ja fetes)
   * Ex: "B2E"
   */
  level: FecdAsLevel | string;

  /**
   * ✅ Nou (multi-selecció)
   */
  levels?: FecdAsLevel[];

  /**
   * ✅ Nou (multi-selecció)
   */
  specialties?: string[];

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
  featured?: boolean;
  order: number;

  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

/** ✅ MUR SOCIAL */
export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  text: string;
  createdAt?: any;
}

export interface SocialPost {
  id: string;
  text: string;
  imageUrl?: string;

  createdBy: string;
  createdByName: string;
  createdByAvatarUrl?: string;

  likes: string[];
  comments: PostComment[];

  createdAt?: any;
  updatedAt?: any;
}
