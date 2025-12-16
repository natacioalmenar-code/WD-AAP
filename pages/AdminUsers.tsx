import React, { useMemo, useState } from "react";
import { PageHero } from "../components/PageHero";
import { useApp } from "../context/AppContext";

type Tab = "pending" | "all";

export const AdminUsers: React.FC = () => {
  const { users, approveUser, setUserRole } = useApp();

  const [tab, setTab] = useState<Tab>("pending");
  const [q, setQ] = useState("");

  // Normalitzem camps
  const normalizedUsers = useMemo(() => {
    return (users || []).map((u: any) => ({
      ...u,
      _status: String(u.status || "").toLowerCase(),
      _role: String(u.role || "").toLowerCase(),
      _name: String(u.name || "").toLowerCase(),
      _email: String(u.email || "").toLowerCase(),
    }));
  }, [users]);

  const pendingUsers = useMemo(
    () => normalizedUsers.filter((u) => u._status === "pending"),
    [normalizedUsers]
  );

  const activeUsers = useMemo(
    () => normalizedUsers.filter((u) => u._status === "active"),
    [normalizedUsers]
  );

  const filtered = useMemo(() => {
    const base = tab === "pending" ? pendingUsers : normalizedUsers;
    const qq = q.trim().toLowerCase();
    if (!qq) return base;

    return base.filter(
      (u) =>
        u._name.includes(qq) ||
        u._email.includes(qq) ||
        u._role.includes(qq) ||
        u._status.includes(qq)
    );
  }, [tab, pendingUsers, normalizedUsers, q]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHero
        title="Gestió de socis/es"
        subtitle="Aprova nous accessos i gestiona els rols del club."
        badge={
          <span>
            Pendents: <b>{pendingUsers.length}</b> · Actius:{" "}
            <b>{activeUsers.length}</b> · Total:{" "}
            <b>{normalizedUsers.length}</b>
          </span>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-500">Pendents</div>
            <div className="mt-2 text-4xl font-black text-yellow-500">
              {pendingUsers.length}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Persones per aprovar
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-500">Actius</div>
            <div className="mt-2 text-4xl font-black text-emerald-600">
              {activeUsers.length}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Socis/es amb accés
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-xs font-bold text-slate-500">Total</div>
            <div className="mt-2 text-4xl font-black text-slate-900">
              {normalizedUsers.length}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Comptes registrats
            </div>
          </div>
        </div>

        {/* Tabs + cerca */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="inline-flex rounded-2xl border bg-slate-50 p-1">
              <button
                onClick={() => setTab("pending")}
                className={`px-4 py-2 rounded-xl text-sm font-black transition ${
                  tab === "pending"
                    ? "bg-slate-900 text-yellow-300"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Pendents ({pendingUsers.length})
              </button>
              <button
                onClick={() => setTab("all")}
                className={`px-4 py-2 rounded-xl text-sm font-black transition ${
                  tab === "all"
                    ? "bg-slate-900 text-yellow-300"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Tots ({normalizedUsers.length})
              </button>
            </div>

            <div className="w-full lg:w-[420px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca per nom, email, rol..."
                className="w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Llista */}
          <div className="mt-6 divide-y">
            {filtered.length === 0 && (
              <div className="py-10 text-center text-slate-500">
                No hi ha socis/es per mostrar.
              </div>
            )}

            {filtered.map((u: any) => (
              <div
                key={u.id}
                className="py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div>
                  <div className="font-extrabold text-slate-900">
                    {u.name || "—"}
                  </div>
                  <div className="text-sm text-slate-600">{u.email}</div>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="text-xs font-black rounded-full px-3 py-1 bg-slate-900 text-yellow-300">
                      {u.role}
                    </span>

                    <span
                      className={`text-xs font-black rounded-full px-3 py-1 border ${
                        u._status === "pending"
                          ? "bg-yellow-50 text-yellow-900 border-yellow-200"
                          : "bg-emerald-50 text-emerald-900 border-emerald-200"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                </div>

                {/* Accions */}
                <div className="flex gap-2 flex-wrap">
                  {u._status === "pending" && (
                    <button
                      onClick={() => approveUser(u.id)}
                      className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-black hover:bg-yellow-500"
                    >
                      Aprovar
                    </button>
                  )}

                  {u._status === "active" && u.role !== "admin" && (
                    <button
                      onClick={() => setUserRole(u.id, "admin")}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-yellow-300 font-black hover:opacity-90"
                    >
                      Fer admin
                    </button>
                  )}

                  {u.role === "admin" && (
                    <span className="px-4 py-2 rounded-xl border text-sm font-black text-slate-600">
                      Administrador
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
