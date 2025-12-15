import React from "react";
import { useApp } from "../context/AppContext";
import { SocialEvents } from "./SocialEvents";

export const AdminEvents: React.FC = () => {
  const { canManageSystem } = useApp();

  // Només administració
  if (!canManageSystem()) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold text-slate-900">Esdeveniments</h1>
          <p className="text-gray-600 mt-2">
            Només l’administració pot crear i gestionar esdeveniments socials.
          </p>
        </div>
      </div>
    );
  }

  /**
   * Reutilitzem la pàgina SocialEvents:
   *  - ja mostra el botó "Crear esdeveniment" si és admin
   *  - ja controla publicar, apuntar-se, etc.
   */
  return <SocialEvents />;
};
