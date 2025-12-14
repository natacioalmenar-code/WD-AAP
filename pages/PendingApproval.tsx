import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Clock, Home, LogOut } from "lucide-react";

export const PendingApproval: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center">
          <Clock className="text-yellow-600" size={28} />
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
          Compte pendent d’aprovació
        </h1>

        <p className="text-gray-600 mt-3">
          Hola <b>{currentUser?.name || "soci/a"}</b> 👋  
          El teu compte està creat correctament, però encara no ha sigut activat
          per l’administració del club.
        </p>

        <p className="text-gray-600 mt-2">
          Quan l’admin t’aprove, podràs accedir a:
        </p>

        <ul className="mt-4 text-left max-w-md mx-auto list-disc pl-6 text-gray-700 space-y-1">
          <li>Sortides</li>
          <li>Cursos</li>
          <li>Esdeveniments</li>
          <li>Material del club</li>
          <li>Mur social</li>
        </ul>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-extrabold"
          >
            <Home size={18} /> Tornar a l’inici
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold"
          >
            <LogOut size={18} /> Tancar sessió
          </button>
        </div>
      </div>
    </div>
  );
};
