import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [certification, setCertification] = useState("");

  const [error, setError] = useState("");

  const { loginWithEmail, registerUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const state = location.state as any;
    return state?.from?.pathname || "/dashboard";
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();
    const trimmedCert = certification.trim();

    if (!trimmedEmail) return setError("Introdueix el correu electrònic.");
    if (!trimmedPassword) return setError("Introdueix la contrasenya.");

    if (mode === "register") {
      if (!trimmedName) return setError("Introdueix el nom i cognoms.");
      if (!trimmedCert) return setError("Indica la titulació de busseig.");

      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        certification: trimmedCert,
      });

      // Després de crear el compte (queda pending), tornem a login
      setMode("login");
      setName("");
      setCertification("");
      setEmail("");
      setPassword("");
      return;
    }

    // mode login
    await loginWithEmail(trimmedEmail, trimmedPassword);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-400">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            {mode === "register" ? "Crear compte (socis/es)" : "Accés socis/es"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "register"
              ? "Crea el compte. L’administració haurà d’aprovar l’accés."
              : "Introdueix el teu correu i contrasenya."}
          </p>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div>
                <label htmlFor="name" className="sr-only">
                  Nom i cognoms
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nom i cognoms"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="certification" className="sr-only">
                  Titulació de busseig
                </label>
                <input
                  id="certification"
                  name="certification"
                  type="text"
                  className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Titulació (ex: B1E, B2E, AOWD...)"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email-address" className="sr-only">
              Correu electrònic
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Correu electrònic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Contrasenya
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Contrasenya"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 text-sm font-bold rounded-md text-black bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
          >
            {mode === "register" ? "Crear compte" : "Entrar"}
          </button>
        </form>

        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              setError("");
              setMode(mode === "register" ? "login" : "register");
            }}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            type="button"
          >
            {mode === "register" ? "Ja tens compte? Inicia sessió" : "No tens compte? Crea'n un"}
          </button>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
          <p className="mt-2">
            * Quan creïs el compte, quedarà <b>pendent</b> fins que l’administració t’aprovi.
          </p>
        </div>
      </div>
    </div>
  );
};
