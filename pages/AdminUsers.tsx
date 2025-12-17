import React, { useMemo, useState } from "react";
import { PageHero } from "../components/PageHero";
import { useApp } from "../context/AppContext";
import type { Role, User } from "../types";

const roleLabel = (r: Role) =>
  r === "admin" ? "Admin" : r === "instructor" ? "Instructor/a" : r === "member" ? "Soci/a" : "Pendent";

const rolePill = (r: Role) =>
  r === "admin"
    ? "bg-slate-900 text-yellow-300"
    : r === "instructor"
    ? "bg-indigo-600 text-white"
    : r === "member"
    ? "bg-emerald-600 text-white"
    : "bg-yellow-400 text-black";

const statusPill = (s: string) =>
  s === "active" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-yellow-50 border-yellow-200 text-yellow-900";

const safe = (v: any) => (v == null ? "" : String(v));

export const AdminUsers: React.FC = () => {
  const { currentUser, users, canManageSystem, approveUser, setUserRole } = useApp();

  const isAdmin = canManageSystem?.() ?? false;

  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  // Rol triat per cada pendent (abans d'aprovar)
  const [pendingRole, setPendingRole] = useState<Record<string, Role>>({});

  // Rol triat per cada actiu (canvi)
  const [editRole, setEditRole] = useState<Record<string, Role>>({});

  const normalized = useMemo(() => {
    const search = q.trim().toLowerCase();
    const list = (users || []).map((u) => ({
      ...u,
      _name: safe(u.name).toLowerCase(),
      _email: safe(u.email).toLowerCase(),
      _role: safe(u.role).toLowerCase(),
      _status: safe(u.status).toLowerCase(),
    })) as (User & any)[];

    const filtered = !search
      ? list
      : list.filter((u) => u._name.includes(search) || u._email.includes(search));

    const pending = filtered
      .filter((u) => u._status === "pending" || u._role === "pending")
      .sort((a, b) => a._name.localeCompare(b._name));

    const active = filtered
      .filter((u) => u._status === "active" && u._role !== "pending")
      .sort((a, b) => a._name.localeCompare(b._name));

    return { pending, active, total: filtered.length };
  }, [users, q]);

  const stats = useMemo(() => {
    const total = (users || []).length;
    const pending = (users || []).filter((u) => (u.status || "").toLowerCase() === "pending" || u.role === "pending").length;
    const instructors = (users || []).filter((u) => u.role === "instructor" && (u.status || "").toLowerCase() === "active").length;
    const members = (users || []).filter((u) => u.role === "member" && (u.status || "").toLowerCase() === "active").length;
    return { total, pending, instructors, members };
  }, [users]);

  const doApprove = async (u: User) => {
    const chosen: Role = pendingRole[u.id] === "instructor" ? "instructor" : "member";
    setBusyId(u.id);
    setToast("");
    try {
      await approveUser(u.id, chosen);
      setToast(`Aprovat/da com a ${roleLabel(chosen)} ✅`);
      setTimeout(() => setToast(""), 2500);
    } catch {
      setToast("No s’ha pogut aprovar ❌");
    } finally {
      setBusyId("");
    }
  };

  const doChangeRole = async (u: User) => {
    const chosen: Role = editRole[u.id] || u.role;
    if (chosen === u.role) {
      setToast("No hi ha canvis.");
      setTimeout(() => setToast(""), 1500);
      return;
    }

    setBusyId(u.id);
    setToast("");
    try {
      await setUserRole(u.id, chosen);
      setToast(`Rol canviat a ${roleLabel(chosen)} ✅`);
      setTimeout(() => setToast(""), 2500);
    } catch {
      setToast("No s’ha pogut canviar el rol ❌");
    } finally {
      setBusyId("");
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Has d’iniciar sessió</h1>
          <p className="text-slate-600 mt-2">Per gestionar socis/es, fes login.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Accés restringit</h1>
          <p className="text-slate-600 mt-2">Només administració pot gestionar socis/es.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
      <PageHero
        compact
        title="Gestió de socis/es"
        subtitle="Aprova pendents i canvia rols (soci/a ↔ instructor/a)."
        badge={
          <span>
            Pendents: <b>{stats.pending}</b> · Socis/es: <b>{stats.members}</b> · Instructors:{" "}
            <b>{stats.instructors}</b> · Total: <b>{stats.total}</b>
          </span>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {toast ? (
          <div className="rounded-2xl border bg-slate-900 text-yellow-300 px-4 py-3 text-sm font-black">
            {toast}
          </div>
        ) : null}

        {/* Barra control */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs font-black text-slate-500">CERCA</div>
              <div className="text-xl font-black text-slate-900">Filtra per nom o correu</div>
            </div>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full md:w-96 rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
              placeholder="Ex: Maria · @gmail · instructor..."
            />
          </div>
        </div>

        {/* PENDENTS */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-yellow-400 text-black px-3 py-1">
                PENDENTS
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">Sol·licituds pendents</h2>
              <p className="text-slate-600 mt-1">Tria si és soci/a o instructor/a abans d’aprovar.</p>
            </div>

            <div className="text-sm font-bold text-slate-600">
              Mostrant: <b>{normalized.pending.length}</b> / {normalized.total}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {normalized.pending.length ? (
              normalized.pending.map((u: User) => {
                const selected = pendingRole[u.id] || "member";
                return (
                  <div key={u.id} className="rounded-3xl border bg-white/70 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-lg font-black text-slate-900 truncate">{u.name || "Soci/a"}</div>
                        <div className="text-sm text-slate-600 truncate">{u.email}</div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center text-xs font-black px-3 py-1 rounded-full border ${statusPill("pending")}`}>
                            PENDENT
                          </span>
                          <span className={`inline-flex items-center text-xs font-black px-3 py-1 rounded-full ${rolePill(u.role)}`}>
                            {roleLabel(u.role)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-slate-500">APROVAR COM</div>
                        <select
                          value={selected}
                          onChange={(e) =>
                            setPendingRole((prev) => ({
                              ...prev,
                              [u.id]: e.target.value as Role,
                            }))
                          }
                          className="mt-2 rounded-2xl border bg-white px-3 py-2 font-bold text-slate-900"
                        >
                          <option value="member">Soci/a</option>
                          <option value="instructor">Instructor/a</option>
                        </select>

                        <button
                          disabled={busyId === u.id}
                          onClick={() => doApprove(u)}
                          className={`mt-3 w-full px-4 py-2.5 rounded-2xl font-black shadow ${
                            busyId === u.id
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-slate-900 text-yellow-300 hover:opacity-90"
                          }`}
                        >
                          {busyId === u.id ? "Aprovant..." : "Aprovar"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
                      <div className="text-xs font-black text-slate-500">CERTIFICACIÓ</div>
                      <div className="mt-1 font-extrabold text-slate-900">
                        {u.certification || "No indicada"}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border bg-white/60 p-5 text-slate-700">
                No hi ha pendents.
              </div>
            )}
          </div>
        </div>

        {/* ACTIUS */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
                ACTIUS
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">Socis/es actius</h2>
              <p className="text-slate-600 mt-1">Pots canviar el rol sense nova sol·licitud.</p>
            </div>

            <div className="text-sm font-bold text-slate-600">
              Mostrant: <b>{normalized.active.length}</b>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {normalized.active.length ? (
              normalized.active.map((u: User) => {
                const selected = editRole[u.id] || u.role;

                return (
                  <div key={u.id} className="rounded-3xl border bg-white/70 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-lg font-black text-slate-900 truncate">{u.name || "Soci/a"}</div>
                        <div className="text-sm text-slate-600 truncate">{u.email}</div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center text-xs font-black px-3 py-1 rounded-full border ${statusPill("active")}`}>
                            ACTIU
                          </span>
                          <span className={`inline-flex items-center text-xs font-black px-3 py-1 rounded-full ${rolePill(u.role)}`}>
                            {roleLabel(u.role)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-slate-500">CANVIAR ROL</div>
                        <select
                          value={selected}
                          onChange={(e) =>
                            setEditRole((prev) => ({
                              ...prev,
                              [u.id]: e.target.value as Role,
                            }))
                          }
                          className="mt-2 rounded-2xl border bg-white px-3 py-2 font-bold text-slate-900"
                        >
                          <option value="member">Soci/a</option>
                          <option value="instructor">Instructor/a</option>
                        </select>

                        <button
                          disabled={busyId === u.id}
                          onClick={() => doChangeRole(u)}
                          className={`mt-3 w-full px-4 py-2.5 rounded-2xl font-black shadow ${
                            busyId === u.id
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-yellow-400 text-black hover:bg-yellow-500"
                          }`}
                        >
                          {busyId === u.id ? "Guardant..." : "Guardar rol"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <div className="text-xs font-black text-slate-500">CERTIFICACIÓ</div>
                        <div className="mt-1 font-extrabold text-slate-900 truncate">
                          {u.certification || "No indicada"}
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-slate-50 p-4">
                        <div className="text-xs font-black text-slate-500">NIVELL</div>
                        <div className="mt-1 font-extrabold text-slate-900">
                          {safe(u.level).toUpperCase() || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border bg-white/60 p-5 text-slate-700">
                No hi ha usuaris actius.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
