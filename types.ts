// types.ts

import { ErrorBoundary } from "./components/ErrorBoundary";

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
  // ja existents (els tens a Firestore)
  logoUrl: string;
  navbarPreTitle: string;
  heroTitle: string;
  appBackgroundUrl?: string;      // opcional
  homeHeroImageUrl?: string;      // opcional (la farem servir com a fons del hero)

  // ✅ nous (per fer editable tota la home)
  heroSubtitle?: string;

  heroPrimaryButtonText?: string;     // ex: "Accés Socis/es"
  heroPrimaryButtonHref?: string;     // ex: "/login"
  heroSecondaryButtonText?: string;   // ex: "Contacta'ns"
  heroSecondaryButtonHref?: string;   // ex: "#contacte"

  homeSectionTitle?: string;          // ex: "Tot el teu busseig, en una sola App"
  homeSectionText?: string;           // paràgraf
  homeSectionImageUrl?: string;       // imatge gran (la de baix)

  homeBullet1Title?: string;
  homeBullet1Text?: string;
  homeBullet2Title?: string;
  homeBullet2Text?: string;
  homeBullet3Title?: string;
  homeBullet3Text?: string;

  homeCtaText?: string;               // ex: "Sol·licita el teu accés →"
  homeCtaHref?: string;               // ex: "/register"

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
