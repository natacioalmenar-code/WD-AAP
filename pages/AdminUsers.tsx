import React, { useMemo } from "react";
import { PageHero } from "../components/PageHero";
import { useApp } from "../context/AppContext";

export const AdminUsers: React.FC = () => {
  const { users, approveUser, setUserRole } = useApp();

  const normalized = useMemo(() => {
    return (users || []).map((u: any) => ({
      ...u,
      _status: String(u.status || "").toLowerCase(),
      _role: String(u.role || "").toLowerCase(),
    }));
  }, [users]);

  const pending = normalized.filter((u) => u._status === "pending");
  const active = normalized.filter((u) => u._status === "active");

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHero
        title="Gestió de socis/es"
        subtitle="Les persones són el centre del club."
        badge={
          <span>
            Pendents <b>{pending.length}</b> · Actius <b>{active.length}</b> · Total{" "}
            <b>{normalized.length}</b>
          </span>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* 🔥 PENDENTS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Pendents d’aprovació
            </h2>
            {pending.length === 0 && (
              <span className="text-sm text-slate-500">
                No hi ha ningú pendent 🎉
              </span>
            )}
          </div>

          {pending.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pending.map((u) => (
                <div
                  key={u.id}
                  className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {u.name || "Nou/va soci/a"}
                      </div>
                      <div className="text-sm text-slate-600">{u.email}</div>

                      <div className="mt-3 inline-flex items-center rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-black text-yellow-900">
                        PENDENT
                      </div>
                    </div>

                    <button
                      onClick={() => approveUser(u.id)}
                      className="px-5 py-3 rounded-2xl bg-yellow-400 text-black font-black hover:bg-yellow-500 shadow"
                    >
                      Aprovar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 🌊 ACTIUS */}
        <section>
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">
            Socis/es actius
          </h2>

          <div className="bg-white border rounded-2xl divide-y">
            {active.length === 0 && (
              <div className="p-6 text-slate-500 text-sm">
                Encara no hi ha socis actius.
              </div>
            )}

            {active.map((u) => (
              <div
                key={u.id}
                className="p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {u.name || "—"}
                  </div>
                  <div className="text-sm text-slate-600">{u.email}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black rounded-full px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900">
                    ACTIU
                  </span>

                  {u.role !== "admin" ? (
                    <button
                      onClick={() => setUserRole(u.id, "admin")}
                      className="px-4 py-2 rounded-xl border font-black text-sm hover:bg-slate-50"
                    >
                      Fer admin
                    </button>
                  ) : (
                    <span className="text-xs font-black text-slate-500">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
