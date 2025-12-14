import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Correu o contrasenya incorrectes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8">
        <h1 className="text-2xl font-extrabold text-center text-slate-900">
          Accés socis/es
        </h1>
        <p className="text-center text-gray-600 mt-1">
          Introdueix el teu correu i contrasenya.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">
              Correu electrònic
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Contrasenya
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-extrabold ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {loading ? "Entrant..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-sm text-blue-600 hover:underline font-bold"
          >
            No tens compte? Crea’n un
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          * Quan crees el compte, quedarà pendent fins que l’administració
          l’aprove.
        </p>
      </div>
    </div>
  );
};

export default Login;
