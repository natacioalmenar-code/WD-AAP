import React, { useMemo, useState } from "react";
import { PageHero } from "../components/PageHero";
import { useApp } from "../context/AppContext";

type Tab = "pending" | "all";

export const AdminUsers: React.FC = () => {
  const { users } = useApp();

  const [tab, setTab] = useState<Tab>("pending");
  const [q, setQ] = useState("");

  // 🔎 Normalitzem status per evitar "Pending" vs "pending" vs "PENDING"
  const normalizedUsers = useMemo(() => {
    return (users || []).map((u: any) => ({
      ...u,
      _statusNorm: String(u.status || "").toLowerCase(),
      _roleNorm: String(u.role || "").toLowerCase(),
      _nameNorm: String(u.name || "").toLowerCase(),
      _emailNorm: String(u.email || "").toLowerCase(),
    }));
  }, [users]);

  const pendingUsers = useMemo(() => {
    return normalizedUsers.filter((u: any) => u._statusNorm === "pending");
  }, [normalizedUsers]);

  const activeUsers = useMemo(() => {
    // “active” o “approved” (per si al vostre model es diu així)
    return normalizedUsers.filter(
      (u: any) => u._statusNorm === "active" || u._statusNorm === "approved"
    );
  }, [normalizedUsers]);

  const filtered = useMemo(() => {
    const list = tab === "pending" ? pendingUsers : normalizedUsers;
    const qq = q.trim().toLowerCase();
    if (!qq) return list;

    return list.filter((u: any) => {
      return (
        u._nameNorm.includes(qq) ||
        u._emailNorm.includes(qq) ||
        u._roleNorm.includes(qq) ||
        u._statusNorm.includes(qq)
      );
    });
  }, [tab, pendingUsers, normalizedUsers, q]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHero
        title="Gestió d’usuaris"
        subtitle="Aprova nous socis/es i assigna rols. Només Admin pot aprovar."
        badge="ADMIN / Usuaris"
      />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* KPIs premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-500">Pendents</div>
            <div className="mt-2 text-4xl font-black text-slate-900">
              {pendingUsers.length}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-500">Actius</div>
            <div className="mt-2 text-4xl font-black text-slate-900">
              {activeUsers.length}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-500">Total</div>
            <div className="mt-2 text-4xl font-black text-slate-900">
              {normalizedUsers.length}
            </div>
          </div>
        </div>

        {/* Tabs + cerca */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="inline-flex rounded-2xl border bg-slate-50 p-1">
              <button
                onClick={() => setTab("pending")}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition ${
                  tab === "pending"
                    ? "bg-slate-900 text-yellow-300"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Pendents ({pendingUsers.length})
              </button>
              <button
                onClick={() => setTab("all")}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition ${
                  tab === "all"
                    ? "bg-slate-900 text-yellow-300"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Tots ({normalizedUsers.length})
              </button>
            </div>

            <div className="w-full lg:w-[420px]">
              <div className="text-sm font-bold text-slate-700 mb-2">Cerca</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nom, email, rol, status..."
                className="w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Taula */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3 pr-4">Nom</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Rol</th>
                  <th className="py-3 pr-4">Estat</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">
                      No hi ha resultats.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u: any) => (
                    <tr key={u.id} className="border-t">
                      <td className="py-4 pr-4">
                        <div className="font-extrabold text-slate-900">
                          {u.name || "—"}
                        </div>
                        {u.createdAt ? (
                          <div className="text-xs text-slate-500 mt-1">
                            Alta: {String(u.createdAt)}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-4 pr-4 text-slate-700">{u.email || "—"}</td>
                      <td className="py-4 pr-4">
                        <span className="inline-flex items-center rounded-full bg-slate-900 text-yellow-300 px-3 py-1 text-xs font-black">
                          {String(u.role || "member")}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black border ${
                            u._statusNorm === "pending"
                              ? "bg-yellow-50 border-yellow-200 text-yellow-900"
                              : "bg-emerald-50 border-emerald-200 text-emerald-900"
                          }`}
                        >
                          {String(u.status || "—")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            *Si tens usuaris a Firebase però aquí surt 0, mira el punt 2 (config / filtres / status).
          </div>
        </div>
      </div>
    </div>
  );
};
