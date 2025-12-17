import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { useApp } from "../context/AppContext";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    const em = email.trim().toLowerCase();
    if (!em || !password) {
      setErr("Introdueix l’email i la contrasenya.");
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(em, password);
      navigate("/dashboard");
    } catch (e: any) {
      setErr("Email o contrasenya incorrectes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHero
        compact
        title="Accés"
        subtitle="Entra a l’àrea privada del club."
        badge={<span>Socis/es · Àrea privada</span>}
      />

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna esquerra */}
        <div className="bg-white border rounded-3xl shadow-sm p-8">
          <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
            WEST DIVERS · CLUB
          </div>

          <h2 className="mt-4 text-3xl font-black text-slate-900">
            Benvingut/da de nou 👋
          </h2>

          <p className="mt-3 text-slate-600 font-semibold leading-relaxed">
            Accedeix a l’àrea privada per consultar sortides, cursos,
            esdeveniments i recursos del club.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">SORTIDES</div>
              <div className="mt-1 font-extrabold text-slate-900">
                Apunta’t fàcilment
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Consulta dates i places.
              </div>
            </div>

            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">FORMACIÓ</div>
              <div className="mt-1 font-extrabold text-slate-900">
                Cursos del club
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Aprèn i evoluciona.
              </div>
            </div>

            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">COMUNITAT</div>
              <div className="mt-1 font-extrabold text-slate-900">
                Activitat social
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Quedades i esdeveniments.
              </div>
            </div>

            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">GESTIÓ</div>
              <div className="mt-1 font-extrabold text-slate-900">
                Àrea privada
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Tot centralitzat.
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-slate-600">
            Encara no tens compte?{" "}
            <Link to="/register" className="font-black text-slate-900 underline">
              Fes la inscripció
            </Link>
          </div>
        </div>

        {/* Columna dreta – Formulari */}
        <div className="bg-white border rounded-3xl shadow-sm p-8">
          <h3 className="text-2xl font-black text-slate-900">
            Inicia sessió
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Introdueix les teues dades per accedir.
          </p>

          {err ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 font-semibold">
              {err}
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-black text-slate-900">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none"
                placeholder="nom@gmail.com"
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-sm font-black text-slate-900">
                Contrasenya
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none"
                placeholder="La teua contrasenya"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <button
              disabled={loading}
              className={`w-full mt-2 px-6 py-3 rounded-2xl font-black shadow ${
                loading
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
              type="submit"
            >
              {loading ? "Accedint..." : "Entrar"}
            </button>

            <div className="text-xs text-slate-500 leading-relaxed">
              Si el teu compte està pendent d’aprovació, encara no podràs accedir
              fins que l’administració el valide.
            </div>

            <div className="text-sm text-slate-600">
              No tens compte?{" "}
              <Link to="/register" className="font-black text-slate-900 underline">
                Inscripció
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
