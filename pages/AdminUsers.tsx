import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Role, User } from "../types";
import { CheckCircle2, Shield, UserCog, Users, Search, AlertTriangle } from "lucide-react";

export const AdminUsers: React.FC = () => {
  const { users, currentUser, canManageSystem, approveUser, setUserRole } = useApp();

  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"pending" | "all">("pending");

  const isAdmin = canManageSystem();

  const normalizedUsers = useMemo(() => {
    return (users || []).map((u) => ({
      ...u,
      name: (u as any).name || "Sense nom",
      email: ((u as any).email || "").toLowerCase(),
      role: (u as any).role || "pending",
      status: (u as any).status || "pending",
      level: (u as any).level || "",
    })) as User[];
  }, [users]);

  const pendingUsers = useMemo(() => {
    return normalizedUsers.filter((u) => u.role === "pending" || u.status === "pending");
  }, [normalizedUsers]);

  const activeUsers = useMemo(() => {
    return normalizedUsers.filter((u) => !(u.role === "pending" || u.status === "pending"));
  }, [normalizedUsers]);

  const filtered = useMemo(() => {
    const base = tab === "pending" ? pendingUsers : normalizedUsers;
    const needle = q.trim().toLowerCase();
    if (!needle) return base;

    console.log("ADMIN USERS DEBUG:", {
  currentUser,
  isAdmin,
  usersLen: (users || []).length,
});


    return base.filter((u) => {
      return (
        (u.name || "").toLowerCase().includes(needle) ||
        (u.email || "").toLowerCase().includes(needle) ||
        (u.role || "").toLowerCase().includes(needle) ||
        (u.status || "").toLowerCase().includes(needle)
      );
    });
  }, [tab, pendingUsers, normalizedUsers, q]);

  if (!currentUser) {
    return (
      <div className="container-app py-12">
        <div className="card card-pad text-center text-slate-600">
          Has d’iniciar sessió.
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-app py-12">
        <div className="card card-pad text-center">
          <h1 className="text-2xl font-black text-slate-900">Gestió d’usuaris</h1>
          <p className="muted mt-2">
            Només administració pot aprovar i gestionar usuaris.
          </p>
        </div>
      </div>
    );
  }

  const approve = async (uid: string) => {
    try {
      await approveUser(uid);
    } catch (e) {
      console.error(e);
      alert("No s’ha pogut aprovar (revisa consola / permisos).");
    }
  };

  const changeRole = async (uid: string, role: Role) => {
    try {
      await setUserRole(uid, role);
    } catch (e) {
      console.error(e);
      alert("No s’ha pogut canviar el rol (revisa consola / permisos).");
    }
  };

  return (
    <div className="container-app py-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestió d’usuaris</h1>
          <p className="muted mt-1">
            Aprova nous socis/es i assigna rols. <b>Només Admin</b> pot aprovar.
          </p>
        </div>

        {/* Tabs + Search */}
        <div className="w-full lg:w-[460px] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTab("pending")}
              className={`btn ${tab === "pending" ? "bg-slate-900 text-yellow-300" : "btn-ghost"} py-2`}
            >
              <Users size={18} /> Pendents ({pendingUsers.length})
            </button>
            <button
              onClick={() => setTab("all")}
              className={`btn ${tab === "all" ? "bg-slate-900 text-yellow-300" : "btn-ghost"} py-2`}
            >
              <Shield size={18} /> Tots ({normalizedUsers.length})
            </button>
          </div>

          <div>
            <label className="label">Cerca</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search size={18} className="text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full outline-none"
                placeholder="Nom, email, rol, status…"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card card-pad">
          <div className="muted text-sm font-bold">Pendents</div>
          <div className="text-3xl font-black mt-1">{pendingUsers.length}</div>
        </div>
        <div className="card card-pad">
          <div className="muted text-sm font-bold">Actius</div>
          <div className="text-3xl font-black mt-1">{activeUsers.length}</div>
        </div>
        <div className="card card-pad">
          <div className="muted text-sm font-bold">Total</div>
          <div className="text-3xl font-black mt-1">{normalizedUsers.length}</div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card card-pad text-center text-slate-500">
          {tab === "pending" ? "No hi ha ningú pendent." : "No hi ha resultats."}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block card overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left">
                    <th className="p-4 font-black">Usuari</th>
                    <th className="p-4 font-black">Email</th>
                    <th className="p-4 font-black">Estat</th>
                    <th className="p-4 font-black">Rol</th>
                    <th className="p-4 font-black text-right">Accions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const isPending = u.role === "pending" || u.status === "pending";
                    const isMe = u.id === currentUser.id;

                    return (
                      <tr key={u.id} className="border-b last:border-b-0">
                        <td className="p-4">
                          <div className="font-black text-slate-900">{u.name}</div>
                          {u.level ? <div className="muted text-xs mt-1">nivell: {u.level}</div> : null}
                          {u.certification ? (
                            <div className="muted text-xs mt-1">certificació: {u.certification}</div>
                          ) : null}
                        </td>
                        <td className="p-4 text-slate-700 break-all">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`chip ${
                              isPending
                                ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {isPending ? "PENDENT" : "ACTIU"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="chip border-slate-200 bg-slate-50 text-slate-700">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <button onClick={() => approve(u.id)} className="btn btn-primary py-2">
                                <CheckCircle2 size={18} />
                                Aprovar
                              </button>
                            )}

                            <div className="flex items-center gap-2">
                              <UserCog size={18} className="text-slate-500" />
                              <select
                                value={u.role}
                                onChange={(e) => changeRole(u.id, e.target.value as Role)}
                                className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white"
                                disabled={isMe}
                                title={isMe ? "No pots canviar-te el rol a tu mateix" : "Canviar rol"}
                              >
                                <option value="member">member</option>
                                <option value="instructor">instructor</option>
                                <option value="admin">admin</option>
                                <option value="pending">pending</option>
                              </select>
                            </div>
                          </div>

                          {isMe && (
                            <div className="mt-2 text-xs text-slate-500 flex items-center gap-2 justify-end">
                              <AlertTriangle size={14} />
                              Aquest ets tu (rol bloquejat).
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((u) => {
              const isPending = u.role === "pending" || u.status === "pending";
              const isMe = u.id === currentUser.id;

              return (
                <div key={u.id} className="card card-pad">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-lg font-black text-slate-900">{u.name}</div>
                      <div className="muted text-sm break-all mt-1">{u.email}</div>
                    </div>

                    <span
                      className={`chip ${
                        isPending
                          ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isPending ? "PENDENT" : "ACTIU"}
                    </span>
                  </div>

                  {(u.level || u.certification) && (
                    <div className="mt-3 space-y-1 text-sm">
                      {u.level ? <div className="muted">nivell: <b>{u.level}</b></div> : null}
                      {u.certification ? (
                        <div className="muted">
                          certificació: <b>{u.certification}</b>
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {isPending && (
                      <button onClick={() => approve(u.id)} className="btn btn-primary py-2">
                        <CheckCircle2 size={18} />
                        Aprovar
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <UserCog size={18} className="text-slate-500" />
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value as Role)}
                        className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white"
                        disabled={isMe}
                        title={isMe ? "No pots canviar-te el rol a tu mateix" : "Canviar rol"}
                      >
                        <option value="member">member</option>
                        <option value="instructor">instructor</option>
                        <option value="admin">admin</option>
                        <option value="pending">pending</option>
                      </select>
                    </div>

                    {isMe && (
                      <div className="w-full mt-2 text-xs text-slate-500 flex items-center gap-2">
                        <AlertTriangle size={14} /> Aquest ets tu (rol bloquejat).
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
