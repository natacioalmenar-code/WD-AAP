import React from "react";
import { useApp } from "../context/AppContext";
import { Check, Shield, User as UserIcon } from "lucide-react";

export const AdminUsers: React.FC = () => {
  const { users, approveUser, setUserRole, canManageSystem } = useApp();

  if (!canManageSystem()) {
    return (
      <div className="p-8 text-center text-red-600">
        Accés denegat. Només per a l’administració.
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.status === "pending");
  const activeUsers = users.filter((u) => u.status === "active");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Gestió de socis/es</h1>

      {/* Pending Approvals */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
            {pendingUsers.length}
          </span>
          Sol·licituds pendents
        </h2>

        {pendingUsers.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 border border-gray-200">
            No hi ha sol·licituds pendents.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-400"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">{user.level}</p>
                  </div>
                </div>

                <button
                  onClick={() => approveUser(user.id)}
                  className="w-full bg-green-100 text-green-700 py-2 rounded-lg font-bold hover:bg-green-200 flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Aprovar (activar)
                </button>

                <p className="mt-3 text-xs text-gray-500">
                  * Un cop aprovat/da, passarà a “soci/a” i podràs canviar-li el rol si cal.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Users List */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Persones sòcies actives ({activeUsers.length})
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Persona sòcia
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nivell
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Rol (permisos)
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Estat
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {activeUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatarUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatarUrl}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon size={18} className="text-gray-500" />
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-800">
                      {user.level}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-slate-400" />
                      <select
                        value={user.role}
                        onChange={(e) => setUserRole(user.id, e.target.value as any)}
                        className={`text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${
                          user.role === "admin"
                            ? "text-red-600 font-bold"
                            : user.role === "instructor"
                            ? "text-green-600 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        <option value="member">member (soci/a)</option>
                        <option value="instructor">instructor (equip instructor)</option>
                        <option value="admin">admin (administració)</option>
                        <option value="pending">pending (pendent)</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      * “instructor” i “admin” poden gestionar sortides i cursos.
                    </p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-green-600 text-xs font-bold uppercase bg-green-50 px-2 py-1 rounded border border-green-100">
                      ACTIU
                    </span>
                  </td>
                </tr>
              ))}

              {activeUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Encara no hi ha persones sòcies actives.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
