import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded font-semibold ${
    isActive ? "underline" : "hover:underline"
  }`;

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, canManageSystem } = useApp();

  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogout(false);
    navigate("/login");
  };

  return (
    <>
      <header className="w-full border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-lg">
            WD-AAP
          </Link>

          <nav className="flex items-center gap-2 flex-wrap">
            <NavLink to="/" className={linkClass}>
              Inici
            </NavLink>

            {currentUser && (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Panell
                </NavLink>
                <NavLink to="/trips" className={linkClass}>
                  Sortides
                </NavLink>
                <NavLink to="/calendar" className={linkClass}>
                  Calendari
                </NavLink>
                <NavLink to="/resources" className={linkClass}>
                  Recursos
                </NavLink>
                <NavLink to="/profile" className={linkClass}>
                  Perfil
                </NavLink>
              </>
            )}

            {!currentUser && (
              <>
                <NavLink to="/courses-public" className={linkClass}>
                  Cursos
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Inscripció
                </NavLink>
                <NavLink to="/login" className={linkClass}>
                  Entrar
                </NavLink>
              </>
            )}

            {/* ADMIN */}
            {currentUser && canManageSystem() && (
              <>
                <span className="mx-2 opacity-40">|</span>
                <NavLink to="/admin-users" className={linkClass}>
                  Admin · Socis
                </NavLink>
                <NavLink to="/admin-settings" className={linkClass}>
                  Admin · Config
                </NavLink>
              </>
            )}

            {/* SORTIR */}
            {currentUser && (
              <>
                <span className="mx-2 opacity-40">|</span>
                <button
                  onClick={() => setShowLogout(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded font-bold text-red-600 hover:underline"
                >
                  <LogOut size={16} />
                  Sortir
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* MODAL CONFIRMACIÓ SORTIR */}
      {showLogout && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowLogout(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900">
              Vols sortir del compte?
            </h2>

            <p className="text-gray-600 mt-2">
              Tancaràs la sessió actual i hauràs de tornar a entrar.
            </p>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setShowLogout(false)}
                className="px-4 py-2 rounded-xl border font-bold hover:bg-gray-50"
              >
                Cancel·lar
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-extrabold hover:bg-red-700"
              >
                Sortir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
