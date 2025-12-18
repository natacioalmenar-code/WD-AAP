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
          right={
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/calendar")}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 text-yellow-300 font-black hover:opacity-90 shadow"
              >
                Calendari
              </button>
              <button
                onClick={() => navigate("/admin-users")}
                className="px-5 py-2.5 rounded-2xl bg-yellow-400 text-black font-black hover:bg-yellow-500 shadow"
              >
                Gestió Socis/es
              </button>
            </div>
          }
        />

        <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
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

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate("/calendar")}
                  className="px-5 py-3 rounded-2xl border font-black hover:bg-slate-50"
                >
                  Veure calendari
                </button>

                <button
                  onClick={() => navigate("/admin-users")}
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-yellow-300 font-black hover:opacity-90"
                >
                  Obrir gestió
                </button>
              </div>
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

          <AdminManagementCards />

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

  // ✅ SOCI — PREMIUM
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
      <PageHero
        title={`Hola, ${currentUser.name || "Soci/a"}`}
        subtitle="Àrea privada del club · El teu carnet digital."
        badge={
          <span>
            Soci/a · Estat: <b>{currentUser.status}</b>
          </span>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Carnet */}
        <div className="rounded-3xl bg-white/70 backdrop-blur border shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-yellow-300 font-black text-xl">
                    {(currentUser.name || "S").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-black text-slate-500">
                  CARNET SOCI/A
                </div>
                <div className="text-xl font-black text-slate-900">
                  {currentUser.name}
                </div>
                <div className="text-sm text-slate-600">
                  {currentUser.certification || "Certificació no indicada"}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-yellow-300 font-black hover:opacity-90"
            >
              Editar perfil
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white/60 p-4">
              <div className="text-xs font-black text-slate-500">
                ASSEGURANÇA / LLICÈNCIA
              </div>
              <div className="mt-1 font-extrabold text-slate-900">
                {currentUser.licenseInsurance || "No indicada"}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Caduca: {currentUser.insuranceExpiry || "—"}
              </div>
            </div>

            <div className="rounded-2xl border bg-white/60 p-4">
              <div className="text-xs font-black text-slate-500">
                CERTIFICAT MÈDIC
              </div>
              <div className="mt-1 font-extrabold text-slate-900">
                {currentUser.medicalCertificate || "No indicat"}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Caduca: {currentUser.medicalExpiry || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Accés ràpid */}
        <div className="rounded-3xl bg-white/70 backdrop-blur border shadow-sm p-6">
          <h2 className="text-xl font-extrabold text-slate-900">Accés ràpid</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Seccions principals del club.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Calendari", path: "/calendar" },
              { label: "Sortides", path: "/trips" },
              { label: "Formació", path: "/courses-private" },
              { label: "Esdeveniments", path: "/social-events" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="rounded-2xl border bg-white/60 p-5 text-left hover:shadow-sm"
              >
                <div className="font-extrabold text-slate-900">{item.label}</div>
                <div className="text-gray-600 text-sm mt-1">Accedir</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
