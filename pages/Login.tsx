import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Login: React.FC = () => {
  const { loginWithEmail, currentUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Si ja està loguejat, redirigim segons estat
  useEffect(() => {
    if (!currentUser) return;

    const isPending =
      currentUser.role === "pending" || currentUser.status === "pending";

    if (isPending) navigate("/pending", { replace: true });
    else navigate("/dashboard", { replace: true });
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmail(email.trim().toLowerCase(), password);
      // El redirect el fa el useEffect quan currentUser s’actualitza
    } catch {
      setError("Correu o contrasenya incorrectes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:underline"
      >
        <ArrowLeft size={16} /> Tornar a l’inici
      </button>

      <div className="bg-white border rounded-2xl shadow-sm p-8 mt-4">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center">
          Accés socis/es
        </h1>

        <p className="text-gray-600 mt-2 text-center">
          Introdueix el teu correu i contrasenya.
        </p>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
          <b>Important:</b> si t’acabes de registrar, el teu compte pot estar{" "}
          <b>pendent d’aprovació</b> fins que l’administració el validi.
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="text-sm font-bold text-slate-700">Correu</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Mail size={18} className="text-slate-400" />
              <input
                type="email"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@correu.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              Contrasenya
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={`w-full mt-2 px-4 py-3 rounded-xl font-extrabold transition ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {loading ? "Entrant…" : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Encara no tens compte?{" "}
          <Link to="/register" className="font-extrabold text-slate-900 hover:underline">
            Inscriu-te aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
