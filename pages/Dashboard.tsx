import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CalendarDays, MapPin, GraduationCap, Users, Settings } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { currentUser, trips, courses, socialEvents, canManageTrips, canManageSystem } = useApp();

  const nextTrips = useMemo(() => {
    return [...trips]
      .filter((t) => t.published && t.status !== "cancelled")
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .slice(0, 3);
  }, [trips]);

  const nextCourses = useMemo(() => {
    return [...courses]
      .filter((c) => c.published && c.status !== "cancelled")
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .slice(0, 3);
  }, [courses]);

  const nextEvents = useMemo(() => {
    return [...socialEvents]
      .filter((e) => e.published && e.status !== "cancelled")
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .slice(0, 3);
  }, [socialEvents]);

  if (!currentUser) {
    // en teoria no s’hi arriba perquè és PrivateRoute, però per seguretat
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-gray-700">Has d’iniciar sessió.</p>
          <Link to="/login" className="text-yellow-700 font-bold">
            Anar a login →
          </Link>
        </div>
      </div>
    );
  }

  const isPending = currentUser.status !== "active" || currentUser.role === "pending";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Hola, {currentUser.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Rol: <span className="font-bold">{currentUser.role}</span> · Estat:{" "}
          <span className="font-bold">{currentUser.status}</span>
        </p>

        {isPending && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <p className="font-bold text-slate-900">Compte pendent d’aprovació</p>
            <p className="text-sm text-gray-700 mt-1">
              Quan un administrador/a t’aprove, podràs apuntar-te a sortides, cursos i
              esdeveniments.
            </p>
          </div>
        )}
      </div>

      {/* Accions ràpides */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Link
          to="/calendar"
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 rounded-2xl p-3">
              <CalendarDays className="text-black" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900">Calendari</div>
              <div className="text-sm text-gray-600">Veure tot el que ve</div>
            </div>
          </div>
        </Link>

        <Link
          to="/trips"
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 rounded-2xl p-3">
              <MapPin className="text-black" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900">Sortides</div>
              <div className="text-sm text-gray-600">Apunta’t (amb aprovació)</div>
            </div>
          </div>
        </Link>

        <Link
          to="/courses-private"
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 rounded-2xl p-3">
              <GraduationCap className="text-black" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900">Formació</div>
              <div className="text-sm text-gray-600">Cursos del club</div>
            </div>
          </div>
        </Link>

        <Link
          to="/social-events"
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 rounded-2xl p-3">
              <Users className="text-black" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900">Esdeveniments</div>
              <div className="text-sm text-gray-600">Quedades i activitats</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Gestió */}
      {(canManageTrips() || canManageSystem()) && (
        <div className="mb-8 bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-extrabold text-slate-900 text-lg">Gestió</div>
              <div className="text-sm text-gray-600">
                Panell per crear/publicar i aprovar inscripcions
              </div>
            </div>

            <div className="flex gap-3">
              {canManageTrips() && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-yellow-300 font-extrabold hover:bg-slate-800"
                >
                  Anar a Gestió
                </Link>
              )}
              {canManageSystem() && (
                <Link
                  to="/admin-settings"
                  className="px-4 py-2 rounded-xl border font-extrabold hover:bg-gray-50 inline-flex items-center gap-2"
                >
                  <Settings size={16} />
                  Web/App
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Properes coses */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Section title="Properes sortides" items={nextTrips.map((t) => ({ id: t.id, title: t.title, date: t.date, to: "/trips" }))} />
        <Section title="Propers cursos" items={nextCourses.map((c) => ({ id: c.id, title: c.title, date: c.date, to: "/courses-private" }))} />
        <Section title="Propers esdeveniments" items={nextEvents.map((e) => ({ id: e.id, title: e.title, date: e.date, to: "/social-events" }))} />
      </div>
    </div>
  );
};

const Section = ({
  title,
  items,
}: {
  title: string;
  items: { id: string; title: string; date: string; to: string }[];
}) => {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">
      <div className="font-extrabold text-slate-900 mb-3">{title}</div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No hi ha elements publicats.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <Link
              key={it.id}
              to={it.to}
              className="block rounded-xl border p-3 hover:bg-gray-50 transition"
            >
              <div className="font-bold text-slate-900">{it.title}</div>
              <div className="text-xs text-gray-600">{it.date}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
