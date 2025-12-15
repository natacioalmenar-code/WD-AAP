import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, BadgeCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Register: React.FC = () => {
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [certification, setCertification] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        certification,
      });

      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Error en crear el compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Tornar */}
      <button
        onClick={() => navigate("/login")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-extrabold text-gray-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Tornar al login
      </button>

      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center">
          Crear compte
        </h1>

        <p className="text-gray-600 mt-2 text-center">
          El teu compte quedarà <span className="font-bold">pendent d’aprovació</span>{" "}
          per part del club.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Nom */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              Nom i cognoms
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <User size={18} className="text-gray-400" />
              <input
                className="w-full outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-bold text-slate-700">Correu</label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Certificació */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              Certificació (opcional)
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <BadgeCheck size={18} className="text-gray-400" />
              <input
                className="w-full outline-none"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="Open Water / AOWD / Rescue..."
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              Contrasenya
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 px-4 py-3 rounded-xl font-extrabold transition ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {loading ? "Creant compte…" : "Crear compte"}
          </button>
        </form>
      </div>
    </div>
  );
};
