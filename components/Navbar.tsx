import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext as useApp } from "../context/AppContext";
import { Menu, X, LogOut } from "lucide-react";

export const Navbar: React.FC = () => {
  const { currentUser, logout, canManageSystem, canManageTrips, clubSettings } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isPublic = !currentUser;
  const showAdmin = canManageSystem();
  const showManagement = canManageTrips(); // ✅ admin o instructor

  const NavItem = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`px-3 py-2 rounded-md text-sm font-bold tracking-wide transition-colors ${
          isActive
            ? "bg-yellow-400 text-black shadow-md"
            : "text-gray-300 hover:text-yellow-400 hover:bg-slate-800"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-slate-900 sticky top-0 z-50 shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-yellow-400 rounded-full p-1">
              <img src={clubSettings.logoUrl} className="h-9 w-9 object-contain" />
            </div>
            <div>
              {clubSettings.navbarPreTitle && (
                <div className="text-[10px] text-gray-400 font-bold uppercase">
                  {clubSettings.navbarPreTitle}
                </div>
              )}
              <div className="text-white text-xl font-extrabold">{clubSettings.heroTitle}</div>
            </div>
          </Link>

          {/* DESKTOP */}
          <div className="hidden xl:flex items-center space-x-2">
            <NavItem to="/" label="INICI" />

            {isPublic ? (
              <>
                <NavItem to="/courses-public" label="CURSOS" />
                <NavItem to="/login" label="SOCIS/ES" />
              </>
            ) : (
              <>
                <NavItem to="/dashboard" label="PANELL" />
                <NavItem to="/calendar" label="CALENDARI" />
                <NavItem to="/trips" label="SORTIDES" />
                <NavItem to="/courses-private" label="FORMACIÓ" />
                <NavItem to="/social-events" label="ESDEVENIMENTS" />
                <NavItem to="/social-wall" label="MUR SOCIAL" />
                <NavItem to="/resources" label="MATERIAL" />

                {/* ✅ GESTIÓ per admin + instructor */}
                {showManagement && <NavItem to="/admin" label="GESTIÓ" />}

                {/* ✅ Només admin */}
                {showAdmin && (
                  <>
                    <NavItem to="/admin-users" label="SOCIS/ES" />
                    <NavItem to="/admin-settings" label="WEB" />
                  </>
                )}

                <div className="ml-4 flex items-center gap-3 border-l border-slate-700 pl-4">
                  <Link to="/profile" className="flex items-center gap-2">
                    <div className="hidden 2xl:block text-right">
                      <div className="text-xs text-yellow-400 font-bold">{currentUser.name}</div>
                      <div className="text-[10px] text-gray-400">{currentUser.level}</div>
                    </div>
                    <img
                      src={currentUser.avatarUrl}
                      className="h-9 w-9 rounded-full border-2 border-slate-600"
                      alt="avatar"
                    />
                  </Link>

                  <button onClick={logout} title="Tancar sessió">
                    <LogOut className="text-slate-400 hover:text-white" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-gray-400 hover:text-yellow-400"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-t border-slate-800 p-3 space-y-1">
          <NavItem to="/" label="INICI" />

          {isPublic ? (
            <>
              <NavItem to="/courses-public" label="CURSOS" />
              <NavItem to="/login" label="ACCÉS SOCIS/ES" />
            </>
          ) : (
            <>
              <NavItem to="/dashboard" label="PANELL" />
              <NavItem to="/calendar" label="CALENDARI" />
              <NavItem to="/trips" label="SORTIDES" />
              <NavItem to="/courses-private" label="FORMACIÓ" />
              <NavItem to="/social-events" label="ESDEVENIMENTS" />
              <NavItem to="/social-wall" label="MUR SOCIAL" />
              <NavItem to="/resources" label="MATERIAL" />
              <NavItem to="/profile" label="EL MEU PERFIL" />

              {/* ✅ GESTIÓ per admin + instructor */}
              {showManagement && <NavItem to="/admin" label="GESTIÓ" />}

              {/* ✅ Només admin */}
              {showAdmin && (
                <>
                  <NavItem to="/admin-users" label="SOCIS/ES" />
                  <NavItem to="/admin-settings" label="WEB" />
                </>
              )}

              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 font-bold text-red-400"
              >
                TANCAR SESSIÓ
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
