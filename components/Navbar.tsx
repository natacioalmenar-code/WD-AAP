import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Navbar: React.FC = () => {
  const { currentUser, canManageSystem, logout, clubSettings } = useApp();
  const location = useLocation();

  const isAdmin = canManageSystem?.() ?? false;

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-xl font-extrabold transition ${
      location.pathname === path
        ? "bg-yellow-400 text-black"
        : "text-white/90 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="w-full bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-xs font-black text-white/80 uppercase tracking-wider">
              {clubSettings?.navbarPreTitle || "CLUB DE BUSSEIG"}
            </div>
            <div className="text-sm font-black text-white">
              {clubSettings?.heroTitle || "WEST DIVERS"}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/" className={linkClass("/")}>
            Inici
          </Link>

          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Panell
          </Link>

          {currentUser && (
            <Link to="/calendar" className={linkClass("/calendar")}>
              Calendari
            </Link>
          )}

          {currentUser && (
            <Link to="/chat" className={linkClass("/chat")}>
              Xat
            </Link>
          )}

          {currentUser && (
            <Link to="/dive-master" className={linkClass("/dive-master")}>
              Dive Master
            </Link>
          )}

          {/* Perfil només si NO és admin */}
          {currentUser && !isAdmin && (
            <Link to="/profile" className={linkClass("/profile")}>
              Perfil
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-yellow-400 text-black">
              ADMIN
            </span>
          )}

          {currentUser ? (
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-xl font-extrabold bg-white/10 text-white hover:bg-white/15"
            >
              Sortir
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl font-extrabold bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
