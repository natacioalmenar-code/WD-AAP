import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import {
  Calendar,
  Award,
  BookOpen,
  Users,
  Shield,
  Settings,
  Anchor,
  GraduationCap,
  ClipboardList,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { currentUser, users, trips, courses, canManageTrips, canManageSystem } =
    useApp();

  if (!currentUser) return null;

  const isAdmin = canManageSystem();
  const isInstructor = canManageTrips() && !isAdmin; // instructor/a (no admin)

  const pendingUsers = useMemo(
    () => users.filter((u) => u.status === "pending"),
    [users]
  );
  const activeUsers = useMemo(
    () => users.filter((u) => u.status === "active"),
    [users]
  );

  const myTrips = useMemo(
    () => trips.filter((t) => t.participants.includes(currentUser.id)),
    [trips, currentUser.id]
  );

  const myCourses = useMemo(
    () => courses.filter((c) => c.participants.includes(currentUser.id)),
    [courses, currentUser.id]
  );

  const nextTrip = useMemo(() => {
    const sorted = [...myTrips].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0] ?? null;
  }, [myTrips]);

  const nextCourse = useMemo(() => {
    const sorted = [...myCourses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0] ?? null;
  }, [myCourses]);

  const upcomingTrips = useMemo(() => {
    const sorted = [...trips].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.slice(0, 5);
  }, [trips]);

  const upcomingCourses = useMemo(() => {
    const sorted = [...courses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.slice(0, 5);
  }, [courses]);

  // Si algun dia un pending entra (per error), li avisem
  if (currentUser.status === "pending") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-yellow-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Compte pendent d’aprovació
          </h1>
          <p className="text-gray-600 mt-2">
            La teva sol·licitud està enviada. Quan l’administració l’aprovi, podràs
            accedir a totes les funcions.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            >
              Tornar a Accés
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const RoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-2 bg-slate-900 text-yellow-400 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
          <Shield size={14} /> Administració
        </span>
      );
    }
    if (isInstructor) {
      return (
        <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
          <Anchor size={14} /> Instructor/a
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
        <Users size={14} /> Soci/a
      </span>
    );
  };

  const StatCard = ({
    icon,
    title,
    value,
    hint,
    colorClass,
    linkTo,
    linkLabel,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    hint?: string;
    colorClass: string;
    linkTo?: string;
    linkLabel?: string;
  }) => {
    const body = (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">
              {title}
            </p>
            <p className="font-extrabold text-slate-900 text-xl mt-1">{value}</p>
            {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
            {linkTo && linkLabel && (
              <div className="mt-3">
                <Link
                  to={linkTo}
                  className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline"
                >
                  {linkLabel} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return body;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Hola, {currentUser.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Benvingut/da al panell del club.
          </p>
        </div>
        <RoleBadge />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Award size={24} />}
          title="Nivell"
          value={currentUser.level || "—"}
          hint="Titulació / categoria"
          colorClass="bg-blue-100 text-blue-600"
          linkTo="/profile"
          linkLabel="Veure perfil"
        />

        <StatCard
          icon={<Calendar size={24} />}
          title="Les meves sortides"
          value={`${myTrips.length}`}
          hint="Reserves actives"
          colorClass="bg-yellow-100 text-yellow-700"
          linkTo="/trips"
          linkLabel="Veure sortides"
        />

        <StatCard
          icon={<GraduationCap size={24} />}
          title="Els meus cursos"
          value={`${myCourses.length}`}
          hint="Inscripcions"
          colorClass="bg-orange-100 text-orange-700"
          linkTo="/courses-private"
          linkLabel="Veure cursos"
        />

        {isAdmin ? (
          <StatCard
            icon={<ClipboardList size={24} />}
            title="Sol·licituds pendents"
            value={`${pendingUsers.length}`}
            hint="Persones esperant aprovació"
            colorClass="bg-purple-100 text-purple-700"
            linkTo="/admin-users"
            linkLabel="Gestionar socis/es"
          />
        ) : (
          <StatCard
            icon={<Users size={24} />}
            title="Socis/es actius/es"
            value={`${activeUsers.length}`}
            hint="Total al sistema"
            colorClass="bg-green-100 text-green-700"
          />
        )}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Next Trip / Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next trip */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-lg font-extrabold mb-3">
                La teva propera sortida
              </h2>
              {nextTrip ? (
                <div>
                  <h3 className="text-xl font-extrabold mb-2">{nextTrip.title}</h3>
                  <p className="opacity-90 mb-4 flex items-center gap-2 text-sm">
                    <Calendar size={16} /> {nextTrip.date} {nextTrip.time ? `· ${nextTrip.time}` : ""}
                  </p>
                  <Link
                    to="/trips"
                    className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-lg font-extrabold text-sm hover:bg-yellow-300 transition-colors"
                  >
                    Veure sortides
                  </Link>
                </div>
              ) : (
                <div className="py-2">
                  <p className="opacity-90 mb-4">
                    No tens cap sortida programada.
                  </p>
                  <Link
                    to="/trips"
                    className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-lg font-extrabold text-sm hover:bg-yellow-300 transition-colors"
                  >
                    Buscar sortides
                  </Link>
                </div>
              )}
            </div>

            {/* Next course */}
            <div className="bg-gradient-to-r from-orange-700 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-lg font-extrabold mb-3">
                El teu proper curs
              </h2>
              {nextCourse ? (
                <div>
                  <h3 className="text-xl font-extrabold mb-2">{nextCourse.title}</h3>
                  <p className="opacity-90 mb-4 flex items-center gap-2 text-sm">
                    <Calendar size={16} /> {nextCourse.date}
                    {nextCourse.schedule ? ` · ${nextCourse.schedule}` : ""}
                  </p>
                  <Link
                    to="/courses-private"
                    className="inline-block bg-white text-orange-800 px-4 py-2 rounded-lg font-extrabold text-sm hover:bg-gray-100 transition-colors"
                  >
                    Veure cursos
                  </Link>
                </div>
              ) : (
                <div className="py-2">
                  <p className="opacity-90 mb-4">
                    No tens cap curs programat.
                  </p>
                  <Link
                    to="/courses-private"
                    className="inline-block bg-white text-orange-800 px-4 py-2 rounded-lg font-extrabold text-sm hover:bg-gray-100 transition-colors"
                  >
                    Buscar cursos
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming lists */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar size={18} className="text-yellow-500" /> Properes sortides
              </h3>
              <Link to="/trips" className="text-sm font-bold text-blue-700 hover:underline">
                Veure tot →
              </Link>
            </div>

            {upcomingTrips.length === 0 ? (
              <p className="text-gray-600">Encara no hi ha sortides publicades.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingTrips.map((t) => (
                  <li key={t.id} className="flex items-start justify-between gap-4 border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-slate-900">{t.title}</p>
                      <p className="text-sm text-gray-600">
                        {t.date} {t.time ? `· ${t.time}` : ""} {t.location ? `· ${t.location}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold bg-yellow-100 text-yellow-900 px-2 py-1 rounded-full">
                      {t.levelRequired}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                <GraduationCap size={18} className="text-orange-500" /> Propers cursos
              </h3>
              <Link to="/courses-private" className="text-sm font-bold text-blue-700 hover:underline">
                Veure tot →
              </Link>
            </div>

            {upcomingCourses.length === 0 ? (
              <p className="text-gray-600">Encara no hi ha cursos publicats.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingCourses.map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-4 border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <p className="text-sm text-gray-600">
                        {c.date} {c.schedule ? `· ${c.schedule}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold bg-orange-100 text-orange-900 px-2 py-1 rounded-full">
                      {c.levelRequired}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin / Instructor quick actions */}
          {(isAdmin || isInstructor) && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Settings size={18} className="text-slate-700" /> Gestió ràpida
              </h3>

              <div className="flex flex-col gap-2">
  <Link
    to="/trips"
    className="w-full px-3 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold text-sm hover:bg-slate-800"
  >
    Gestionar sortides
  </Link>

  <Link
    to="/courses-private"
    className="w-full px-3 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold text-sm hover:bg-slate-800"
  >
    Gestionar formació
  </Link>

  <Link
    to="/social-events"
    className="w-full px-3 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold text-sm hover:bg-slate-800"
  >
    Gestionar esdeveniments
  </Link>

  {isAdmin && (
    <Link
      to="/admin-users"
      className="w-full px-3 py-2 rounded-lg bg-purple-100 text-purple-800 font-extrabold text-sm hover:bg-purple-200"
    >
      Gestionar socis/es (aprovacions)
    </Link>
  )}

  {isAdmin && (
    <Link
      to="/admin-settings"
      className="w-full px-3 py-2 rounded-lg bg-cyan-100 text-cyan-800 font-extrabold text-sm hover:bg-cyan-200"
    >
      Configuració web
    </Link>
  )}
</div>

                {isAdmin && (
                  <Link
                    to="/admin-users"
                    className="w-full px-3 py-2 rounded-lg bg-purple-100 text-purple-800 font-extrabold text-sm hover:bg-purple-200"
                  >
                    Gestionar socis/es (aprovacions)
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin-settings"
                    className="w-full px-3 py-2 rounded-lg bg-cyan-100 text-cyan-800 font-extrabold text-sm hover:bg-cyan-200"
                  >
                    Configuració web
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Documentation */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600" /> Documentació
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">➔ Assegurança</li>
              <li className="hover:text-blue-600 cursor-pointer">➔ Certificat mèdic</li>
              <li className="hover:text-blue-600 cursor-pointer">➔ Titulacions</li>
            </ul>
            <p className="text-xs text-gray-400 mt-3">
              (Això després ho connectarem a PDFs o enllaços reals)
            </p>
          </div>

          {/* Social groups */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Grups socials
            </h3>
            <div className="flex flex-col gap-2">
              <button className="w-full text-left px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100">
                WhatsApp sortides
              </button>
              <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100">
                Compravenda material
              </button>
            </div>
          </div>

          {/* Admin highlight */}
          {isAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                <Shield size={18} /> Administració
              </h3>
              <p className="text-sm text-gray-700 mt-2">
                Tens <b>{pendingUsers.length}</b> sol·licitud(s) pendent(s) d’aprovació.
              </p>
              <div className="mt-4">
                <Link
                  to="/admin-users"
                  className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold text-sm hover:bg-slate-800"
                >
                  Revisar ara
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
