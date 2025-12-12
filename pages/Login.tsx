import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, Anchor, User } from "lucide-react";

export const Login: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { loginWithEmail, registerUser, loginAsDemoAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const state = location.state as any;
    return state?.from?.pathname || "/dashboard";
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail) {
      setError("Introdueix el correu electrònic.");
      return;
    }

    if (mode === "register") {
      if (!trimmedName) {
        setError("Introdueix el nom i cognoms.");
        return;
      }
      registerUser({ name: trimmedName, email: trimmedEmail });
      // Després de sol·licitar alta, es queden a la pantalla d'accés
      setMode("login");
      setName("");
      setEmail("");
      return;
    }

    // mode === "login"
    loginWithEmail(trimmedEmail);
    navigate(redirectTo, { replace: true });
  };

  const quickLogin = (emailToUse: string) => {
    setError("");
    loginWithEmail(emailToUse);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-400">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            {mode === "register" ? "Sol·licitar alta (socis/es)" : "Accés socis/es"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "register"
              ? "Omple el formulari per sol·licitar l’accés. L’administració l’haurà d’aprovar."
              : "Introdueix el teu correu electrònic o fes servir els accessos ràpids."}
          </p>
        </div>

        {/* DEMO BUTTONS */}
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
              >
                <Anchor size={16} /> Instructor/a (demo)
              </button>

              <button
                onClick={() => quickLogin("soci@westdivers.local")}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium text-sm"
              >
                <User size={16} /> Soci/a (demo)
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">
                O accedeix manualment
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">
                Nom i cognoms
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nom i cognoms"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email-address" className="sr-only">
              Correu electrònic
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Correu electrònic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-black bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
            >
              {mode === "register" ? "Enviar sol·licitud" : "Entrar"}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              setError("");
              setMode(mode === "register" ? "login" : "register");
            }}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            {mode === "register"
              ? "Ja ets soci/a? Inicia sessió"
              : "No tens accés? Sol·licita alta"}
          </button>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
          <p className="mt-2">
            * Si acabes de sol·licitar alta, el teu compte quedarà <b>pendent</b> fins que
            l’administració el validi.
          </p>
        </div>
      </div>
    </div>
  );
};
