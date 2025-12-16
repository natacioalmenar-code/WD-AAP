import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Login: React.FC = () => {
  const { loginWithEmail, currentUser, canManageSystem } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmail(email, password);

      // IMPORTANT: l’admin entra al panell, no a “administrar socis”
      // (i tothom entra al dashboard)
      navigate("/dashboard");
    } catch {
      setError("Correu o contrasenya incorrectes.");
    } finally {
      setLoading(false);
    }
  };

  // Si ja està loguejat, fora
  if (currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-14">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
          <div className="text-2xl font-extrabold text-slate-900">Ja tens la sessió iniciada</div>
          <div className="text-gray-600 mt-2">
            {canManageSystem?.() ? "Pots anar al panell." : "Pots anar al teu panell."}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-6 py-3 rounded-xl bg-yellow-400 text-black font-extrabold hover:bg-yellow-500"
          >
            Anar al panell
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-extrabold text-gray-600 hover:underline"
      >
        <ArrowLeft size={16} /> Tornar a l’inici
      </button>

      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center">Accés socis/es</h1>

        <p className="text-gray-600 mt-2 text-center">Introdueix el teu correu i contrasenya.</p>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
          <b>Important:</b> si és la primera vegada, el teu compte pot estar{" "}
          <b>pendent d’aprovació</b>. Quan l’administració l’active, podràs accedir.
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">Correu electrònic</label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                required
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@correu.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Contrasenya</label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                required
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 px-4 py-3 rounded-xl font-extrabold ${
              loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {loading ? "Entrant…" : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-sm text-blue-600 hover:underline font-bold">
            No tens compte? Crea’n un
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          * Quan crees el compte, quedarà pendent fins que l’administració l’aprove.
        </p>
      </div>
    </div>
  );
};
