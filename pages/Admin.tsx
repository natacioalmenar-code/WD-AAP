import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Shield, UserCheck, Users, AlertTriangle } from "lucide-react";

export const Admin: React.FC = () => {
  const { currentUser, users, approveUser, setUserRole, canManageSystem } = useApp();

  if (!currentUser) return null;

  // ✅ Només ADMIN
  if (!canManageSystem()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
            <AlertTriangle />
            Accés restringit
          </div>
          <p className="text-gray-600">
            Aquesta pantalla és només per <b>Administració</b>.
          </p>
        </div>
      </div>
    );
  }

  const pendingUsers = useMemo(() => users.filter((u) => u.status === "pending"), [users]);
  const activeUsers = useMemo(() => users.filter((u) => u.status === "active"), [users]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <Shield className="text-yellow-500" />
          Administració
        </h1>
        <p className="text-gray-600 mt-2">
          Aprova sol·licituds i gestiona rols (ADMIN / INSTRUCTOR / SOCI).
        </p>
      </div>

      {/* ✅ PENDENTS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4">
          <UserCheck className="text-yellow-500" />
          Sol·licituds pendents ({pendingUsers.length})
        </h2>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-500 italic">No hi ha sol·licituds pendents.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-bold uppercase">Nom</th>
                  <th className="px-4 py-3 font-bold uppercase">Email</th>
                  <th className="px-4 py-3 font-bold uppercase">Titulació</th>
                  <th className="px-4 py-3 font-bold uppercase">Accions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3 text-gray-700">{u.certification || "-"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => approveUser(u.id)}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700"
                      >
                        Aprovar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ USUARIS ACTIUS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4">
          <Users className="text-yellow-500" />
          Persones sòcies ({activeUsers.length})
        </h2>

        {activeUsers.length === 0 ? (
          <p className="text-gray-500 italic">No hi ha usuaris actius.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-bold uppercase">Nom</th>
                  <th className="px-4 py-3 font-bold uppercase">Email</th>
                  <th className="px-4 py-3 font-bold uppercase">Rol</th>
                  <th className="px-4 py-3 font-bold uppercase">Nivell</th>
                  <th className="px-4 py-3 font-bold uppercase">Canviar rol</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">{u.level}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => setUserRole(u.id, e.target.value as any)}
                        className="border border-gray-300 rounded-lg p-2"
                        disabled={u.email.toLowerCase() === currentUser.email.toLowerCase()}
                        title={
                          u.email.toLowerCase() === currentUser.email.toLowerCase()
                            ? "No pots canviar-te el rol a tu mateix aquí."
                            : "Canvia el rol"
                        }
                      >
                        <option value="member">member</option>
                        <option value="instructor">instructor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">
              * Per seguretat, no et deixa canviar-te el rol a tu mateix des d’aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
