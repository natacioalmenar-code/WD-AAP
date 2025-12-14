import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const PendingApproval: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Compte pendent d’aprovació
        </h1>

        <p className="text-gray-600 mt-3">
          Hola <span className="font-bold">{currentUser?.name || "soci/a"}</span> 👋
          <br />
          El teu compte està creat, però encara està <b>pendent</b> fins que
          l’administració l’aprovi.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl bg-yellow-400 font-extrabold hover:bg-yellow-300"
          >
            Tornar a l’inici (públic)
          </button>

          <button
            onClick={() => navigate("/courses-public")}
            className="px-4 py-2 rounded-xl border font-extrabold hover:bg-gray-50"
          >
            Veure cursos públics
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-gray-100 font-extrabold hover:bg-gray-200"
          >
            Tancar sessió
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Quan l’admin t’aprove, podràs entrar al panell, sortides, cursos i esdeveniments.
        </div>
      </div>
    </div>
  );
};
