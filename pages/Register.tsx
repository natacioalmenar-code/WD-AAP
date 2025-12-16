import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, BadgeCheck, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Register: React.FC = () => {
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [certification, setCertification] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        certification,
      });

      // registerUser ja deixa el compte en PENDING i fa signOut
      navigate("/login", { replace: true });
    } catch (err: any) {
      // Si el context ja fa alert, igualment mostrem un missatge amigable
      setError(
        err?.message ||
          "No s’ha pogut completar el registre. Revisa les dades o prova més tard."
      );
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
          Inscripció socis/es
        </h1>

        <p className="text-gray-600 mt-2 text-center">
          Crea el teu compte. L’administració l’haurà d’aprovar.
        </p>

        <div className="mt-6 bg-slate-50 border rounded-xl p-4 text-sm text-slate-700 flex gap-2">
          <BadgeCheck size={18} className="mt-0.5" />
          <div>
            <b>Què passa després?</b>
            <div>
              El compte queda <b>PENDENT</b> fins que un <b>ADMIN</b> l’aprovi.
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Nom */}
          <div>
            <label className="text-sm font-bold text-slate-700">Nom i cognoms</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <User size={18} className="text-slate-400" />
              <input
                type="text"
                className="w-full outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom Cognoms"
                required
              />
            </div>
          </div>

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

          {/* Certificació */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              Certificació (opcional)
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <BadgeCheck size={18} className="text-slate-400" />
              <input
                type="text"
                className="w-full outline-none"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="Open Water / AOWD / Rescue..."
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-bold text-slate-700">Contrasenya</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínim 6 caràcters"
                minLength={6}
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
            {loading ? "Creant compte…" : "Crear compte"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Ja estàs registrat/da?{" "}
          <Link to="/login" className="font-extrabold text-slate-900 hover:underline">
            Inicia sessió
          </Link>
        </div>
      </div>
    </div>
  );
};
