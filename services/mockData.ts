
import { Trip, User, UserLevel, UserStatus, Course, UserRole, Resource, SocialEvent, Post, ClubSettings } from '../types';

export const DEFAULT_CLUB_SETTINGS: ClubSettings = {
  logoUrl: "https://cdn-icons-png.flaticon.com/512/3284/3284680.png",
  navbarPreTitle: "CLUB DE BUSSEIG",
  appBackgroundUrl: "https://www.transparenttextures.com/patterns/cubes.png",
  homeHeroImageUrl: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2070&auto=format&fit=crop",
  heroTitle: "WEST DIVERS",
  heroSubtitle: "Passió pel blau, seguretat i bona companyia."
};

export const MOCK_USERS: User[] = [
  {
    id: 'uadmin',
    name: 'Admin West Divers',
    email: 'thewestdivers@gmail.com',
    level: UserLevel.INSTRUCTOR_3E,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    avatarUrl: 'https://picsum.photos/id/1006/200/200',
    specialties: ['Totes'],
    diveCount: 5000,
    insuranceExpiry: '2030-01-01',
    insuranceCompany: 'DAN Europe',
    insurancePolicy: '123456-ADMIN',
    medicalCertExpiry: '2030-01-01',
    licenseNumber: 'CAT-0001',
    gear: []
  },
  {
    id: 'u1',
    name: 'Marc Subirats',
    email: 'marc@westdivers.cat',
    level: UserLevel.INSTRUCTOR_2E,
    role: UserRole.INSTRUCTOR,
    status: UserStatus.ACTIVE,
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    specialties: ['Nitrox', 'Nocturna', 'Salvament', 'Vestit Sec'],
    diveCount: 1250,
    lastDiveDate: '2023-11-10',
    insuranceExpiry: '2024-05-20',
    medicalCertExpiry: '2025-01-15',
    gear: [
      { id: 'g1', type: 'Vestit Sec', description: 'Bare Trilam XL' },
      { id: 'g2', type: 'Regulador', description: 'Apeks MTX-R' },
      { id: 'g3', type: 'Aletes', description: 'Apeks RK3' },
      { id: 'g4', type: 'Ordinador', description: 'Shearwater Perdix' }
    ]
  },
  {
    id: 'u2',
    name: 'Laura Vives',
    email: 'laura@example.com',
    level: UserLevel.B2E,
    role: UserRole.MEMBER,
    status: UserStatus.ACTIVE,
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    specialties: ['Nitrox'],
    diveCount: 45,
    lastDiveDate: '2023-10-15',
    insuranceExpiry: '2023-12-01', // Expiring soon
    medicalCertExpiry: '2024-06-20',
    gear: [
      { id: 'g1', type: 'Vestit', description: 'Aqualung 5mm M' },
      { id: 'g2', type: 'Màscara', description: 'Cressi Big Eyes' }
    ]
  },
  {
    id: 'upending',
    name: 'Nou Soci Pendent',
    email: 'nou@example.com',
    level: UserLevel.B1E,
    role: UserRole.MEMBER,
    status: UserStatus.PENDING,
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    specialties: [],
    diveCount: 0,
    gear: []
  }
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    title: 'Sortida Illes Medes - Vaixell',
    date: '2023-11-15',
    time: '08:30',
    location: 'L\'Estartit (Port)',
    locationUrl: 'https://goo.gl/maps/example1',
    depth: '18m - 25m',
    levelRequired: 'B1E - 1 Estel',
    description: 'Immersió clàssica a la Pedra de Déu. Molta vida, meros, espets i corall. Apta per a tots els nivells.',
    maxSpots: 12,
    imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?q=80&w=2070&auto=format&fit=crop',
    participants: ['u1', 'u2']
  },
  {
    id: 't2',
    title: 'Pecio Boreas - Palamós',
    date: '2023-11-22',
    time: '09:00',
    location: 'Palamós',
    locationUrl: 'https://goo.gl/maps/example2',
    depth: '20m - 32m',
    levelRequired: 'B2E - 2 Estels',
    description: 'Immersió al vaixell enfonsat Boreas. Requereix titulació avançada i experiència. Possible corrent.',
    maxSpots: 8,
    imageUrl: 'https://images.unsplash.com/photo-1629804537169-2f22c6080d0d?q=80&w=2070&auto=format&fit=crop',
    participants: ['u1']
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Curs B1E - Open Water',
    date: '2023-12-01',
    schedule: 'Caps de setmana',
    description: 'Aprèn a bussejar des de zero. Inclou teoria, piscina i 5 immersions a mar.',
    price: '390€',
    levelRequired: 'Cap',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2070&auto=format&fit=crop',
    maxSpots: 6,
    participants: []
  },
  {
    id: 'c2',
    title: 'Especialitat Nitrox',
    date: '2023-11-18',
    schedule: 'Dissabte matí',
    description: 'Busseja amb aire enriquit per allargar el temps de fons i reduir el cansament.',
    price: '120€',
    levelRequired: 'B1E',
    imageUrl: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=2070&auto=format&fit=crop',
    maxSpots: 10,
    participants: ['u2']
  }
];

export const MOCK_EVENTS: SocialEvent[] = [
    {
        id: 'e1',
        title: 'Xarrada: Taurons del Mediterrani',
        date: '2023-11-10',
        time: '19:00',
        location: 'Local del Club',
        description: 'Descobreix les espècies de taurons que habiten a les nostres costes amb el biòleg marí Marc.',
        type: 'talk',
        participants: ['u1', 'u2']
    },
    {
        id: 'e2',
        title: 'Sopar de Nadal',
        date: '2023-12-20',
        time: '21:00',
        location: 'Restaurant El Port',
        description: 'Sopar de germanor per celebrar el final de temporada. Menú tancat 25€.',
        type: 'gathering',
        participants: ['u1', 'u2']
    }
];

export const MOCK_RESOURCES: Resource[] = [
    {
        id: 'r1',
        title: 'Taules de Descompressió 2023',
        type: 'pdf',
        category: 'table',
        url: '#',
        description: 'Taules oficials FECDAS per a planificació manual.'
    },
    {
        id: 'r2',
        title: 'Mapa Illes Medes',
        type: 'image',
        category: 'map',
        url: '#',
        description: 'Topografia detallada de la Pedra de Déu i el Dofí.'
    }
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        authorId: 'u1',
        content: "Hola a tots! Aquest diumenge pujo a Tossa, algú s'anima a fer una immersió matinal?",
        date: '2023-11-08T10:30:00Z',
        likes: ['u2']
    },
    {
        id: 'p2',
        authorId: 'u2',
        content: "Em venc les aletes (Talla M). Si algú les vol provar, les portaré al club divendres.",
        date: '2023-11-09T15:00:00Z',
        likes: []
    }
];