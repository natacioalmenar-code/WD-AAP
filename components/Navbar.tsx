import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext as useApp } from '../context/AppContext';
import { Menu, X, LogOut, Users, PenTool, ClipboardList, GraduationCap, CalendarDays } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, canManageTrips, canManageSystem, clubSettings } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isPublic = !currentUser;
  const showInstructor = canManageTrips(); // admin o instructor
  const showAdmin = canManageSystem();     // només admin

  const NavItem = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`px-3 py-2 rounded-md text-sm font-bold tracking-wide transition-colors ${
          isActive
            ? 'bg-yellow-400 text-black shadow-md'
            : 'text-gray-300 hover:text-yellow-400 hover:bg-slate-800'
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
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-yellow-400 rounded-full p-1 group-hover:scale-105 transition-transform">
                <img src={clubSettings.logoUrl} alt="West Divers Logo" className="h-9 w-9 object-contain" />
              </div>
              <div className="flex flex-col">
                {clubSettings.navbarPreTitle && (
                  <span className="text-[10px] text-gray-400 leading-none font-bold uppercase tracking-widest">
                    {clubSettings.navbarPreTitle}
                  </span>
                )}
                <span className="text-white text-xl font-extrabold tracking-wider group-hover:text-yellow-400 transition-colors">
                  {clubSettings.heroTitle}
                </span>
              </div>
            </Link>
          </div>

          {/* DESKTOP */}
          <div className="hidden xl:block">
            <div className="ml-10 flex items-baseline space-x-2">
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

                  {/* ✅ Gestió (Instructor/Admin) */}
                  {showInstructor && (
                    <>
                      <Link
                        to="/admin-trips"
                        className="px-3 py-2 rounded-md text-sm font-bold text-yellow-300 hover:text-yellow-200 flex items-center gap-1 border border-transparent hover:border-yellow-900"
                        title="Gestionar sortides"
                      >
                        <ClipboardList size={16} /> GESTIÓ SORTIDES
                      </Link>

                      <Link
                        to="/courses-private"
                        className="px-3 py-2 rounded-md text-sm font-bold text-yellow-300 hover:text-yellow-200 flex items-center gap-1 border border-transparent hover:border-yellow-900"
                        title="Gestionar formació"
                      >
                        <GraduationCap size={16} /> GESTIÓ FORMACIÓ
                      </Link>

                      <Link
                        to="/social-events"
                        className="px-3 py-2 rounded-md text-sm font-bold text-yellow-300 hover:text-yellow-200 flex items-center gap-1 border border-transparent hover:border-yellow-900"
                        title="Gestionar esdeveniments"
                      >
                        <CalendarDays size={16} /> GESTIÓ ESDEV.
                      </Link>
                    </>
                  )}

                  {/* ✅ Admin extra */}
                  {showAdmin && (
                    <>
                      <Link
                        to="/admin-users"
                        className="px-3 py-2 rounded-md text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 border border-transparent hover:border-purple-900"
                      >
                        <Users size={16} /> SOCIS/ES
                      </Link>
                      <Link
                        to="/admin-settings"
                        className="px-3 py-2 rounded-md text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 border border-transparent hover:border-cyan-900"
                      >
                        <PenTool size={16} /> WEB
                      </Link>
                    </>
                  )}

                  <div className="ml-6 flex items-center space-x-4 pl-6 border-l border-slate-700">
                    <Link to="/profile" className="flex items-center gap-2 group">
                      <div className="text-right hidden 2xl:block">
                        <p className="text-xs text-yellow-400 font-bold">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-400">{currentUser.level}</p>
                      </div>
                      <img
                        src={currentUser.avatarUrl}
                        alt="Perfil"
                        className="h-9 w-9 rounded-full border-2 border-slate-600 group-hover:border-yellow-400 transition-colors object-cover"
                      />
                    </Link>

                    <button
                      onClick={logout}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Tancar sessió"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <div className="-mr-2 flex xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-yellow-400 hover:bg-slate-800 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="xl:hidden bg-slate-900 pb-3 pt-2 border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavItem to="/" label="INICI" />

            {isPublic ? (
              <>
                <NavItem to="/courses-public" label="CURSOS" />
                <NavItem to="/login" label="ACCÉS SOCIS/ES" />
              </>
            ) : (
              <>
                <NavItem to="/dashboard" label="EL MEU PANELL" />
                <NavItem to="/calendar" label="CALENDARI" />
                <NavItem to="/trips" label="SORTIDES" />
                <NavItem to="/courses-private" label="FORMACIÓ" />
                <NavItem to="/social-events" label="ESDEVENIMENTS" />
                <NavItem to="/social-wall" label="MUR SOCIAL" />
                <NavItem to="/resources" label="BIBLIOTECA" />

                <div className="border-t border-slate-800 my-2 pt-2">
                  <NavItem to="/profile" label="EL MEU PERFIL" />

                  {/* ✅ Gestió (Instructor/Admin) */}
                  {showInstructor && <NavItem to="/admin-trips" label="GESTIÓ SORTIDES" />}
                  {showInstructor && <NavItem to="/courses-private" label="GESTIÓ FORMACIÓ" />}
                  {showInstructor && <NavItem to="/social-events" label="GESTIÓ ESDEVENIMENTS" />}

                  {/* ✅ Admin extra */}
                  {showAdmin && <NavItem to="/admin-users" label="GESTIÓ SOCIS/ES" />}
                  {showAdmin && <NavItem to="/admin-settings" label="CONFIGURACIÓ WEB" />}

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-red-400 hover:bg-slate-800"
                  >
                    TANCAR SESSIÓ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
