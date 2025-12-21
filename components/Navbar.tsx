import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Navbar: React.FC = () => {
  const { currentUser, canManageSystem, logout, clubSettings } = useApp();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isAdmin = canManageSystem?.() ?? false;

  const linkClass = (path: string) =>
    `block w-full px-4 py-3 rounded-xl font-extrabold transition ${
      location.pathname === path
        ? "bg-yellow-400 text-black"
        : "text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <div className="w-full bg-slate-900 relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO / NOM */}
        <Link to="/" className="flex items-center gap-3">
          <div>
            <div className="text-xs font-black text-white/70 uppercase tracking-wider">
              {clubSettings?.navbarPreTitle || "CLUB DE BUSSEIG"}
            </div>
            <div className="text-sm font-black text-white">
              {clubSettings?.heroTitle || "WEST DIVERS"}
            </div>
          </div>
        </Link>

        {/* DRETA */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <span className="hidden sm:inline px-3 py-1 rounded-full text-xs font-black bg-yellow-400 text-black">
              ADMIN
            </span>
          )}

          {currentUser ? (
            <button
              onClick={() => logout()}
              className="hidden sm:inline px-4 py-2 rounded-xl font-extrabold bg-white/10 text-white hover:bg-white/15"
            >
              Sortir
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline px-4 py-2 rounded-xl font-extrabold bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Entrar
            </Link>
          )}

          {/* BOTÓ BURGER */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 focus:outline-none"
            aria-label="Menu"
          >
            {/* icona burger */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MENU DESPLEGABLE */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className={linkClass("/")}>
              Inici
            </Link>

            {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className={linkClass("/dashboard")}>
                  Panell
                </Link>
                <Link to="/calendar" onClick={() => setOpen(false)} className={linkClass("/calendar")}>
                  Calendari
                </Link>
                <Link to="/trips" onClick={() => setOpen(false)} className={linkClass("/trips")}>
                  Sortides
                </Link>
                <Link
                  to="/courses-private"
                  onClick={() => setOpen(false)}
                  className={linkClass("/courses-private")}
                >
                  Cursos
                </Link>
                <Link
                  to="/social-events"
                  onClick={() => setOpen(false)}
                  className={linkClass("/social-events")}
                >
                  Esdeveniments
                </Link>
                <Link to="/chat" onClick={() => setOpen(false)} className={linkClass("/chat")}>
                  Xat
                </Link>
                <Link to="/dive-master" onClick={() => setOpen(false)} className={linkClass("/dive-master")}>
                  Dive Master
                </Link>

                {!isAdmin && (
                  <Link to="/profile" onClick={() => setOpen(false)} className={linkClass("/profile")}>
                    Perfil
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className={linkClass("/admin")}>
                    Administració
                  </Link>
                )}

                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl font-extrabold bg-slate-900 text-white hover:bg-slate-800"
                >
                  Sortir
                </button>
              </>
            ) : (
              <>
                <Link to="/courses-public" onClick={() => setOpen(false)} className={linkClass("/courses-public")}>
                  Cursos públics
                </Link>
                <Link to="/help" onClick={() => setOpen(false)} className={linkClass("/help")}>
                  Ajuda
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full px-4 py-3 rounded-xl font-extrabold bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
