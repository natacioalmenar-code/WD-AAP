import React, { useState } from 'react';
import {
  Waves,
  Calendar,
  Users,
  BookOpen,
  MessageCircle,
  Map,
  User,
} from 'lucide-react';

type TabId =
  | 'dashboard'
  | 'trips'
  | 'courses'
  | 'social'
  | 'resources'
  | 'profile';

interface Trip {
  id: string;
  title: string;
  date: string;
  location: string;
  levelRequired: string;
  maxSpots: number;
  spotsTaken: number;
}

interface Course {
  id: string;
  title: string;
  date: string;
  schedule: string;
  description: string;
  price: string;
  levelRequired: string;
}

interface SocialPost {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  description: string;
}

const mockTrips: Trip[] = [
  {
    id: 't1',
    title: 'Sortida Illes Columbretes',
    date: '2025-04-12',
    location: 'Illes Columbretes',
    levelRequired: 'B2E',
    maxSpots: 10,
    spotsTaken: 7,
  },
  {
    id: 't2',
    title: 'Sortida Costa Brava – Ullastres',
    date: '2025-04-27',
    location: 'Llafranc',
    levelRequired: 'B1E',
    maxSpots: 12,
    spotsTaken: 4,
  },
];

const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Curs B1E – 1 Estel',
    date: '2025-05-01',
    schedule: 'Caps de setmana',
    description: 'Curs d’iniciació per començar a bussejar amb seguretat.',
    price: '420€',
    levelRequired: 'Cap, curs inicial',
  },
  {
    id: 'c2',
    title: 'Curs Nitrox',
    date: '2025-05-20',
    schedule: 'Divendres tarda',
    description: 'Formació per fer immersions amb aire enriquit.',
    price: '180€',
    levelRequired: 'B1E o superior',
  },
];

const mockPosts: SocialPost[] = [
  {
    id: 'p1',
    author: 'Anna G.',
    content:
      'Sortida brutal ahir a les Medes, visibilitat espectacular i molt peix!',
    date: '2025-03-09',
    likes: 12,
  },
  {
    id: 'p2',
    author: 'Marc R.',
    content:
      'Algú s’apunta a fer repàs de flotabilitat abans de la temporada?',
    date: '2025-03-07',
    likes: 5,
  },
];

const mockResources: Resource[] = [
  {
    id: 'r1',
    title: 'Taules de descompressió',
    type: 'pdf',
    description: 'Taules oficials de descompressió per a immersions recreatives.',
  },
  {
    id: 'r2',
    title: 'Vídeo: Revisió d’equip abans d’embarcar',
    type: 'video',
    description: 'Guia ràpida per fer un buddy-check complet abans de l’entrada.',
  },
  {
    id: 'r3',
    title: 'Mapa punts de busseig Costa Brava',
    type: 'link',
    description: 'Selecció de punts habituals on anem amb el club.',
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const handleJoinTrip = (trip: Trip) => {
    alert(
      `T'has preinscrit a la sortida: ${trip.title} (${trip.date} – ${trip.location}).\n\nEn una versió amb backend es guardaria automàticament al teu perfil.`
    );
  };

  const handleEnrollCourse = (course: Course) => {
    alert(
      `T'has preinscrit al curs: ${course.title}.\n\nEn una versió completa, rebries un correu amb els passos per fer el pagament.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-cyan-500/40">
              WD
            </div>
            <div>
              <h1 className="font-semibold text-lg">West Divers</h1>
              <p className="text-xs text-slate-400">
                Gestió del club de busseig · Versió demo funcional
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1">
              <Waves className="w-4 h-4 text-cyan-400" />
              <span>Estat: Operatiu</span>
            </div>
            <div className="px-2 py-1 rounded-full border border-emerald-500/40 text-emerald-300 bg-emerald-900/20">
              Producció · Vercel
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
          {/* Sidebar simple de pestanyes */}
          <nav className="lg:w-56 shrink-0 space-y-1 border border-slate-800 rounded-2xl bg-slate-900/40 p-2">
            <NavItem
              icon={Waves}
              label="Resum"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavItem
              icon={Map}
              label="Sortides"
              active={activeTab === 'trips'}
              onClick={() => setActiveTab('trips')}
            />
            <NavItem
              icon={BookOpen}
              label="Cursos"
              active={activeTab === 'courses'}
              onClick={() => setActiveTab('courses')}
            />
            <NavItem
              icon={MessageCircle}
              label="Social"
              active={activeTab === 'social'}
              onClick={() => setActiveTab('social')}
            />
            <NavItem
              icon={Calendar}
              label="Recursos"
              active={activeTab === 'resources'}
              onClick={() => setActiveTab('resources')}
            />
            <NavItem
              icon={User}
              label="Perfil"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
          </nav>

          {/* Contingut principal segons pestanya */}
          <main className="flex-1 space-y-4">
            {activeTab === 'dashboard' && (
              <DashboardView
                trips={mockTrips}
                courses={mockCourses}
                onJoinTrip={handleJoinTrip}
                onEnrollCourse={handleEnrollCourse}
              />
            )}
            {activeTab === 'trips' && (
              <TripsView trips={mockTrips} onJoinTrip={handleJoinTrip} />
            )}
            {activeTab === 'courses' && (
              <CoursesView
                courses={mockCourses}
                onEnrollCourse={handleEnrollCourse}
              />
            )}
            {activeTab === 'social' && <SocialView posts={mockPosts} />}
            {activeTab === 'resources' && (
              <ResourcesView resources={mockResources} />
            )}
            {activeTab === 'profile' && <ProfileView />}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-3 text-[11px] text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} West Divers</span>
          <span>Versió demo · sense backend ni base de dades encara</span>
        </div>
      </footer>
    </div>
  );
};

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
      active
        ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30'
        : 'text-slate-300 hover:bg-slate-800/80'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

interface DashboardViewProps {
  trips: Trip[];
  courses: Course[];
  onJoinTrip: (trip: Trip) => void;
  onEnrollCourse: (course: Course) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  trips,
  courses,
  onJoinTrip,
  onEnrollCourse,
}) => {
  const nextTrip = trips[0];
  const nextCourse = courses[0];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Benvingut/da a la app de West Divers
        </h2>
        <p className="text-sm text-slate-300">
          Aquí podràs gestionar les teves sortides, cursos i estar al dia de
          l&apos;activitat del club.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Properes sortides */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold">Properes sortides</h3>
          </div>
          {trips.length === 0 ? (
            <p className="text-xs text-slate-400">
              Encara no hi ha sortides programades.
            </p>
          ) : (
            <div className="text-xs space-y-2">
              <p className="text-slate-300">
                {nextTrip.date} · {nextTrip.location}
              </p>
              <p className="text-slate-400">{nextTrip.title}</p>
              <p className="text-slate-400">
                Places: {nextTrip.spotsTaken}/{nextTrip.maxSpots} · Nivell
                mínim: {nextTrip.levelRequired}
              </p>
              <button
                onClick={() => onJoinTrip(nextTrip)}
                className="mt-1 inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Apuntar-m&apos;hi
              </button>
            </div>
          )}
        </div>

        {/* Proper curs */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold">Proper curs</h3>
          </div>
          {nextCourse ? (
            <div className="text-xs space-y-2">
              <p className="text-slate-300">
                {nextCourse.date} · {nextCourse.title}
              </p>
              <p className="text-slate-400">{nextCourse.description}</p>
              <p className="text-slate-400">
                Horari: {nextCourse.schedule} · Preu: {nextCourse.price}
              </p>
              <button
                onClick={() => onEnrollCourse(nextCourse)}
                className="mt-1 inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Preinscriure-m&apos;hi
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Encara no hi ha cursos programats.
            </p>
          )}
        </div>
      </div>

      {/* Bloc assistent IA (placeholder) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold">Assistent IA (properament)</h3>
        </div>
        <p>
          Aquí hi anirà l&apos;assistent intel·ligent connectat a la API de
          Gemini per:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Recomanar immersions segons el teu nivell i experiència.</li>
          <li>Respondre dubtes sobre seguretat i planificació.</li>
          <li>
            Ajudar a omplir documentació del club (fulls d&apos;inscripció,
            autoritzacions, etc.).
          </li>
        </ul>
        <p className="text-[11px] text-slate-500">
          A nivell tècnic, només caldrà afegir una crida a la llibreria
          <span className="font-mono"> @google/genai </span>
          utilitzant la teva API key des de les variables d&apos;entorn.
        </p>
      </div>
    </div>
  );
};

interface TripsViewProps {
  trips: Trip[];
  onJoinTrip: (trip: Trip) => void;
}

const TripsView: React.FC<TripsViewProps> = ({ trips, onJoinTrip }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <Map className="w-5 h-5 text-cyan-400" />
      Sortides programades
    </h2>
    <p className="text-xs text-slate-300">
      Llista de properes sortides del club. Quan t&apos;apuntes, de moment fem
      només una simulació amb un missatge, però en una versió completa es
      guardaria a la base de dades.
    </p>
    <div className="grid md:grid-cols-2 gap-3">
      {trips.map((trip) => {
        const freeSpots = trip.maxSpots - trip.spotsTaken;
        return (
          <article
            key={trip.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-100">{trip.title}</h3>
              <span className="px-2 py-0.5 rounded-full border border-slate-700 text-[10px] text-slate-300">
                {trip.date}
              </span>
            </div>
            <p className="text-slate-300">{trip.location}</p>
            <p className="text-slate-400">
              Nivell mínim: {trip.levelRequired}
            </p>
            <p className="text-slate-400">
              Places: {trip.spotsTaken}/{trip.maxSpots}{' '}
              {freeSpots > 0 ? (
                <span className="text-emerald-400">({freeSpots} lliures)</span>
              ) : (
                <span className="text-rose-400">(Complet)</span>
              )}
            </p>
            <button
              disabled={freeSpots <= 0}
              onClick={() => onJoinTrip(trip)}
              className={`mt-1 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold ${
                freeSpots > 0
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {freeSpots > 0 ? "Apuntar-m'hi" : 'Sense places'}
            </button>
          </article>
        );
      })}
    </div>
  </section>
);

interface CoursesViewProps {
  courses: Course[];
  onEnrollCourse: (course: Course) => void;
}

const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onEnrollCourse,
}) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <BookOpen className="w-5 h-5 text-cyan-400" />
      Cursos del club
    </h2>
    <p className="text-xs text-slate-300">
      Selecció de cursos en marxa o programats. En una versió amb backend, aquí
      es podria veure també l&apos;estat del pagament i documentació.
    </p>
    <div className="space-y-3">
      {courses.map((course) => (
        <article
          key={course.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-100">{course.title}</h3>
            <span className="px-2 py-0.5 rounded-full border border-slate-700 text-[10px] text-slate-300">
              {course.date}
            </span>
          </div>
          <p className="text-slate-300">{course.description}</p>
          <p className="text-slate-400">Horari: {course.schedule}</p>
          <p className="text-slate-400">
            Requisits: {course.levelRequired} · Preu: {course.price}
          </p>
          <button
            onClick={() => onEnrollCourse(course)}
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Preinscriure-m&apos;hi
          </button>
        </article>
      ))}
    </div>
  </section>
);

interface SocialViewProps {
  posts: SocialPost[];
}

const SocialView: React.FC<SocialViewProps> = ({ posts }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <MessageCircle className="w-5 h-5 text-cyan-400" />
      Mur social del club
    </h2>
    <p className="text-xs text-slate-300">
      Aquí els socis poden compartir fotos, comentaris i propostes. De moment
      les dades són de prova i no s&apos;hi pot escriure encara.
    </p>
    <div className="space-y-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-1"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-100">
              {post.author}
            </span>
            <span className="text-[10px] text-slate-500">{post.date}</span>
          </div>
          <p className="text-slate-200">{post.content}</p>
          <p className="text-[11px] text-slate-400">👍 {post.likes} m&apos;agrada</p>
        </article>
      ))}
    </div>
  </section>
);

interface ResourcesViewProps {
  resources: Resource[];
}

const ResourcesView: React.FC<ResourcesViewProps> = ({ resources }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <Calendar className="w-5 h-5 text-cyan-400" />
      Recursos per bussejadors
    </h2>
    <p className="text-xs text-slate-300">
      Documentació i materials útils per als socis del club.
    </p>
    <div className="space-y-2">
      {resources.map((res) => (
        <article
          key={res.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs flex items-start justify-between gap-3"
        >
          <div>
            <p className="font-semibold text-slate-100">{res.title}</p>
            <p className="text-slate-300">{res.description}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Tipus de recurs: {res.type.toUpperCase()}
            </p>
          </div>
          <button className="text-[11px] rounded-lg border border-slate-700 px-2 py-1 hover:bg-slate-800">
            Obrir
          </button>
        </article>
      ))}
    </div>
  </section>
);

const ProfileView: React.FC = () => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <Users className="w-5 h-5 text-cyan-400" />
      El meu perfil (demo)
    </h2>
    <p className="text-xs text-slate-300">
      En una versió completa aquí es mostraria el teu nom, nivell, llicència,
      certificat mèdic, historial de bussejos, etc.
    </p>
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs space-y-2">
      <p>
        <span className="text-slate-400">Nom: </span>
        <span className="text-slate-100">Soci/a de prova</span>
      </p>
      <p>
        <span className="text-slate-400">Nivell: </span>
        <span className="text-slate-100">B1E – 1 estel</span>
      </p>
      <p>
        <span className="text-slate-400">Estat documentació: </span>
        <span className="text-emerald-300">En regla (demo)</span>
      </p>
      <p className="text-[11px] text-slate-500">
        Més endavant podem connectar això a una base de dades real (per
        exemple, Supabase / Firebase / PostgreSQL) i un sistema d&apos;accés amb
        usuari i contrasenya.
      </p>
    </div>
  </section>
);

export default App;
