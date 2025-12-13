import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, Anchor, User } from "lucide-react";

export const Login: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [certification, setCertification] = useState("");

  const [error, setError] = useState("");

  const { loginWithEmail, registerUser, loginAsDemoAdmin } = useApp();
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

      // després de crear el compte (pending), tornem a login
      setMode("login");
      setName("");
      setCertification("");
      setEmail("");
      setPassword("");
      return;
    }

    // mode === login
    await loginWithEmail(trimmedEmail, trimmedPassword);
    navigate(redirectTo, { replace: true });
  };

  const quickLogin = async (emailToUse: string) => {
    setError("");
    setEmail(emailToUse);
    // IMPORTANT: aquí necessites una password real (Firebase),
    // així que deixem els botons demo només per ADMIN (local).
    setError("Els accessos ràpids d’instructor/soci ara requereixen contrasenya (Firebase).");
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

        {/* DEMO ADMIN */}
        {mode === "login" && (
          <div className="grid grid-cols-1 gap-3 mb-6">
            <button
              onClick={() => {
                setError("");
                loginAsDemoAdmin();
                navigate("/dashboard", { replace: true });
              }}
              className="flex items-center justify-center gap-2 w-full p-3 bg-slate-900 text-yellow-400 rounded-lg hover:bg-slate-800 transition-colors font-bold shadow-sm"
            >
              <Shield size={18} /> Entrar com a ADMINISTRACIÓ (demo)
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => quickLogin("instructor@westdivers.local")}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-medium text-sm"
                type="button"
              >
                <Anchor size={16} /> Instructor/a (info)
              </button>

              <button
                onClick={() => quickLogin("soci@westdivers.local")}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium text-sm"
                type="button"
              >
                <User size={16} /> Soci/a (info)
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300" />
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">
                Accés manual
              </span>
              <div className="flex-grow border-t border-gray-300" />
            </div>
          </div>
        )}

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
