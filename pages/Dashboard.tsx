import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { AdminManagementCards } from "../components/AdminManagementCards";
import { PageHero } from "../components/PageHero";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, users, trips, courses, socialEvents, canManageSystem } =
    useApp();

  const isAdmin = canManageSystem?.() ?? false;

  const stats = useMemo(() => {
    const list = (users || []).map((u: any) => ({
      ...u,
      _status: String(u.status || "").toLowerCase(),
    }));

    const pending = list.filter((u: any) => u._status === "pending").length;
    const active = list.filter(
      (u: any) => u._status === "active" || u._status === "approved"
    ).length;

    return { total: list.length, pending, active };
  }, [users]);

  const nextTrips = useMemo(
    () => (trips || []).filter((t: any) => t.published).slice(0, 3),
    [trips]
  );

  const nextCourses = useMemo(
    () => (courses || []).filter((c: any) => c.published).slice(0, 3),
    [courses]
  );

  const nextEvents = useMemo(
    () => (socialEvents || []).filter((e: any) => e.published).slice(0, 3),
    [socialEvents]
  );

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Has d’iniciar sessió
          </h1>
          <p className="text-gray-600 mt-2">
            Per entrar al panell, primer fes login.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-3 rounded-xl bg-yellow-400 text-black font-extrabold hover:bg-yellow-500"
          >
            Anar a login
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <PageHero
          compact
          title="Panell d’Administració"
          subtitle="Control del club: socis/es, sortides, cursos i esdeveniments."
          badge={
            <span>
              <b>ADMIN</b> · Pendents: <b>{stats.pending}</b> · Actius:{" "}
              <b>{stats.active}</b> · Total: <b>{stats.total}</b>
            </span>
          }
          // ✅ sense botó repetit al hero
        />

        <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
          {/* ✅ Gestió de socis/es com a principal (baix) */}
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
                  PRIORITAT
                </div>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                  Gestió de socis/es
                </h2>
                <p className="text-gray-600 mt-1">
                  Aprova pendents, assigna rols i revisa l’estat del club.
                </p>
              </div>

              <button
                onClick={() => navigate("/admin-users")}
                className="px-5 py-3 rounded-2xl bg-slate-900 text-yellow-300 font-black hover:opacity-90"
              >
                Obrir gestió
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-2xl p-5 bg-slate-50">
                <div className="text-xs font-bold text-slate-600">Pendents</div>
                <div className="mt-2 text-4xl font-black text-slate-900">
                  {stats.pending}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Persones a punt d’entrar
                </div>
              </div>

              <div className="border rounded-2xl p-5 bg-slate-50">
                <div className="text-xs font-bold text-slate-600">Actius</div>
                <div className="mt-2 text-4xl font-black text-slate-900">
                  {stats.active}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Socis/es amb accés
                </div>
              </div>

              <div className="border rounded-2xl p-5 bg-slate-50">
                <div className="text-xs font-bold text-slate-600">Total</div>
                <div className="mt-2 text-4xl font-black text-slate-900">
                  {stats.total}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Registres al sistema
                </div>
              </div>
            </div>
          </div>

          {/* Secundari */}
          <AdminManagementCards />

          {/* Resum */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="font-extrabold text-slate-900">
                Properes sortides
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {nextTrips.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {nextTrips.map((t: any) => (
                      <li key={t.id}>
                        <b>{t.title || "Sortida"}</b>
                        {t.date ? ` · ${t.date}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No hi ha elements publicats."
                )}
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="font-extrabold text-slate-900">Propers cursos</div>
              <div className="text-sm text-gray-600 mt-2">
                {nextCourses.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {nextCourses.map((c: any) => (
                      <li key={c.id}>
                        <b>{c.title || "Curs"}</b>
                        {c.date ? ` · ${c.date}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No hi ha elements publicats."
                )}
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="font-extrabold text-slate-900">
                Propers esdeveniments
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {nextEvents.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {nextEvents.map((e: any) => (
                      <li key={e.id}>
                        <b>{e.title || "Esdeveniment"}</b>
                        {e.date ? ` · ${e.date}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No hi ha elements publicats."
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NO admin
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHero
        title={`Hola, ${currentUser.name || "Soci/a"}`}
        subtitle="Consulta pròximes activitats i recursos del club."
        badge={
          <span>
            Àrea privada · Rol: <b>{currentUser.role}</b> · Estat:{" "}
            <b>{currentUser.status}</b>
          </span>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-extrabold text-slate-900">Accés ràpid</h2>
          <p className="text-gray-600 mt-1 text-sm">Seccions principals.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/calendar")}
              className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm"
            >
              <div className="font-extrabold text-slate-900">Calendari</div>
              <div className="text-gray-600 text-sm mt-1">
                Veure tot el que ve
              </div>
            </button>

            <button
              onClick={() => navigate("/trips")}
              className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm"
            >
              <div className="font-extrabold text-slate-900">Sortides</div>
              <div className="text-gray-600 text-sm mt-1">Apunta’t</div>
            </button>

            <button
              onClick={() => navigate("/courses-private")}
              className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm"
            >
              <div className="font-extrabold text-slate-900">Formació</div>
              <div className="text-gray-600 text-sm mt-1">Cursos del club</div>
            </button>

            <button
              onClick={() => navigate("/social-events")}
              className="bg-white border rounded-2xl p-5 text-left hover:shadow-sm"
            >
              <div className="font-extrabold text-slate-900">Esdeveniments</div>
              <div className="text-gray-600 text-sm mt-1">
                Quedades i activitats
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
