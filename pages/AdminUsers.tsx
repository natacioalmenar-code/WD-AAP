import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Role, User } from "../types";
import { CheckCircle2, Shield, UserCog, Users } from "lucide-react";

export const AdminUsers: React.FC = () => {
  const { users, currentUser, canManageSystem, approveUser, setUserRole } = useApp();

  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"pending" | "all">("pending");

  const isAdmin = canManageSystem();

  const normalizedUsers = useMemo(() => {
    // blindatge per si algun camp ve buit
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

  const filtered = useMemo(() => {
    const base = tab === "pending" ? pendingUsers : normalizedUsers;
    const needle = q.trim().toLowerCase();
    if (!needle) return base;

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-gray-600">
          Has d’iniciar sessió.
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Gestió d’usuaris</h1>
          <p className="text-gray-600 mt-2">Només administració pot aprovar i gestionar usuaris.</p>
        </div>
      </div>
    );
  }

  const approve = async (uid: string) => {
    try {
      await approveUser(uid);
      alert("Usuari aprovat ✅");
    } catch (e: any) {
      console.error(e);
      alert("No s’ha pogut aprovar (revisa rules / consola).");
    }
  };

  const changeRole = async (uid: string, role: Role) => {
    try {
      await setUserRole(uid, role);
      alert("Rol actualitzat ✅");
    } catch (e: any) {
      console.error(e);
      alert("No s’ha pogut canviar el rol (revisa rules / consola).");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestió d’usuaris</h1>
          <p className="text-gray-600 mt-1">
            Pendents: <span className="font-extrabold">{pendingUsers.length}</span> · Total:{" "}
            <span className="font-extrabold">{normalizedUsers.length}</span>
          </p>
        </div>

        <div className="w-full md:w-[420px] space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("pending")}
              className={`flex-1 px-4 py-2 rounded-xl font-extrabold border transition ${
                tab === "pending" ? "bg-slate-900 text-yellow-300 border-slate-900" : "bg-white hover:bg-gray-50"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Users size={18} /> Pendents
              </span>
            </button>
            <button
              onClick={() => setTab("all")}
              className={`flex-1 px-4 py-2 rounded-xl font-extrabold border transition ${
                tab === "all" ? "bg-slate-900 text-yellow-300 border-slate-900" : "bg-white hover:bg-gray-50"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Shield size={18} /> Tots
              </span>
            </button>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Cerca</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="Nom, email, rol, status…"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-gray-500">
          {tab === "pending" ? "No hi ha ningú pendent." : "No hi ha resultats."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <div key={u.id} className="bg-white border rounded-2xl shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-lg font-extrabold text-slate-900">{u.name}</div>

                    <span
                      className={`text-xs font-extrabold px-2 py-1 rounded-full ${
                        u.role === "pending" || u.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role === "pending" || u.status === "pending" ? "PENDENT" : "ACTIU"}
                    </span>

                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      rol: {u.role}
                    </span>

                    {u.level ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        nivell: {u.level}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-sm text-gray-600 mt-1 break-all">{u.email}</div>

                  {u.certification ? (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-bold">Certificació:</span> {u.certification}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(u.role === "pending" || u.status === "pending") && (
                    <button
                      onClick={() => approve(u.id)}
                      className="px-4 py-2 rounded-xl font-extrabold bg-yellow-400 hover:bg-yellow-500 text-black inline-flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} />
                      Aprovar
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <UserCog size={18} className="text-gray-500" />
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as Role)}
                      className="px-3 py-2 rounded-xl border font-bold"
                      disabled={u.id === currentUser.id} // evita tocar-te a tu mateix
                      title={u.id === currentUser.id ? "No pots canviar-te el rol a tu mateix" : "Canviar rol"}
                    >
                      <option value="member">member</option>
                      <option value="instructor">instructor</option>
                      <option value="admin">admin</option>
                      <option value="pending">pending</option>
                    </select>
                  </div>
                </div>
              </div>

              
              {u.id === currentUser.id && (
                <div className="mt-3 text-xs text-gray-500">
                  *Aquest ets tu. El selector de rol està bloquejat per seguretat.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
