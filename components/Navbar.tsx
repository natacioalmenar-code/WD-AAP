import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar: React.FC = () => {
  const { clubSettings, currentUser, canManageSystem } = useApp();
  const location = useLocation();

  const isLogged = !!currentUser;

  const logo = clubSettings.logoUrl || "/westdivers-logo.png";
  const preTitle = clubSettings.navbarPreTitle || "CLUB DE BUSSEIG";
  const title = clubSettings.heroTitle || "WEST DIVERS";

  const navItemClass = ({ isActive }: any) =>
    cx(
      "px-3 py-2 rounded-xl text-sm font-extrabold transition",
      isActive ? "bg-white/10 text-yellow-300" : "text-white/85 hover:text-white hover:bg-white/10"
    );

  return (
    <header className="w-full bg-black/90 text-white sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* BRAND (✅ evita solapament) */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="logo" className="h-10 w-10 rounded-full border border-white/20 flex-shrink-0" />
            <div className="min-w-0 leading-tight">
              <div className="text-[10px] uppercase tracking-wide text-white/70 truncate">
                {preTitle}
              </div>
              <div className="text-sm font-extrabold truncate">{title}</div>
            </div>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={navItemClass}>
              Panell
            </NavLink>
            <NavLink to="/wall" className={navItemClass}>
              Mur social
            </NavLink>
            <NavLink to="/trips" className={navItemClass}>
              Sortides
            </NavLink>
            <NavLink to="/courses" className={navItemClass}>
              Cursos
            </NavLink>
            <NavLink to="/events" className={navItemClass}>
              Esdeveniments
            </NavLink>
            <NavLink to="/resources" className={navItemClass}>
              Material
            </NavLink>
            <NavLink to="/calendar" className={navItemClass}>
              Calendari
            </NavLink>
            <NavLink to="/help" className={navItemClass}>
              Ajuda
            </NavLink>

            {canManageSystem() && (
              <>
                <NavLink to="/admin" className={navItemClass}>
                  Gestió
                </NavLink>
                <NavLink to="/admin-users" className={navItemClass}>
                  Socis/es
                </NavLink>
                <NavLink to="/admin-web" className={navItemClass}>
                  Web
                </NavLink>
              </>
            )}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {isLogged ? (
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm"
                title="Perfil"
              >
                <span className="w-8 h-8 rounded-full bg-yellow-400 text-black grid place-items-center font-extrabold">
                  {(currentUser?.name || "W").slice(0, 1).toUpperCase()}
                </span>
                <span className="max-w-[140px] truncate">
                  {currentUser?.name || "Perfil"}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-extrabold hover:bg-yellow-300"
              >
                Accés Socis/es
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
