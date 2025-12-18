import React from "react";
import { useApp } from "../context/AppContext";
import { PageHero } from "../components/PageHero";
import { SocialEvents } from "./SocialEvents";

export const AdminEvents: React.FC = () => {
  const { canManageSystem, currentUser } = useApp();
  const isAdmin = canManageSystem?.() ?? false;

  if (!currentUser) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
        <PageHero
          compact
          title="Esdeveniments"
          subtitle="Accés restringit."
          badge={
            <span>
              Rol: <b>{currentUser.role}</b> · Estat: <b>{currentUser.status}</b>
            </span>
          }
        />

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-10 overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
                NOMÉS ADMINISTRACIÓ
              </div>

              <h1 className="mt-4 text-3xl font-black text-slate-900">
                Gestió d’esdeveniments socials
              </h1>

              <p className="mt-3 text-slate-600 max-w-2xl">
                Els esdeveniments del club (sopars, quedades i activitats) es gestionen des del
                panell d’administració per garantir coherència i control.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border bg-white/60 p-5">
                  <div className="text-xs font-black text-slate-500">CREACIÓ</div>
                  <div className="mt-2 font-black text-slate-900">Només admins</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Evitem duplicats i assegurem que tot estiga revisat.
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/60 p-5">
                  <div className="text-xs font-black text-slate-500">PUBLICACIÓ</div>
                  <div className="mt-2 font-black text-slate-900">Control de visibilitat</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Publicar / ocultar quan toque, i cancel·lació amb motiu.
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/60 p-5">
                  <div className="text-xs font-black text-slate-500">CALENDARI</div>
                  <div className="mt-2 font-black text-slate-900">Tot centralitzat</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Si està publicat, apareix al calendari del club.
                  </div>
                </div>
              </div>

              <div className="mt-7 text-sm text-slate-500">
                Si necessites permisos, demana a l’administració que t’assigne el rol d’admin.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Admin: reutilitzem la pàgina premium d’esdeveniments (que ja porta crear / publicar / cancel·lar / esborrar)
  return <SocialEvents />;
};
