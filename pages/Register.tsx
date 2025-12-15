import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Register: React.FC = () => {
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [certification, setCertification] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({ name, email, password, certification });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/login")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-extrabold text-gray-600 hover:underline"
      >
        <ArrowLeft size={16} /> Tornar al login
      </button>

      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center">
          Crear compte
        </h1>

        <p className="text-gray-600 mt-2 text-center">
          El compte quedarà pendent fins que l’administració l’aprove.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">Nom i cognoms</label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <User size={18} className="text-gray-400" />
              <input className="w-full outline-none" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Correu</label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Mail size={18} className="text-gray-400" />
              <input type="email" className="w-full outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Certificació (opcional)</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2 outline-none"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
              placeholder="B1E / AOWD / Rescat..."
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Contrasenya</label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input type="password" className="w-full outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 px-4 py-3 rounded-xl font-extrabold ${
              loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {loading ? "Creant…" : "Crear compte"}
          </button>
        </form>
      </div>
    </div>
  );
};
