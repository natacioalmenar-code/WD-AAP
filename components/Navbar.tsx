import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const itemBase = "px-3 py-2 rounded-xl font-extrabold transition whitespace-nowrap";
const itemInactive = "text-white/90 hover:text-yellow-300 hover:bg-white/10";
const itemActive = "text-yellow-300 bg-white/10";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, canManageSystem, clubSettings } = useApp();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const logoUrl = (clubSettings?.logoUrl || "/westdivers-logo.png").trim();
  const clubTitle = (clubSettings?.heroTitle || "WEST DIVERS").trim();
  const preTitle = (clubSettings?.navbarPreTitle || "CLUB DE BUSSEIG").trim();

  const roleChip = useMemo(() => {
    if (!currentUser) return null;
    const role = (currentUser.role || "").toString().toLowerCase();
    const status = (currentUser.status || "").toString().toLowerCase();

    if (role === "admin") return { text: "ADMIN", cls: "border-red-400/40 bg-red-500/10 text-red-200" };
    if (role === "pending" || status === "pending")
      return { text: "PENDING", cls: "border-yellow-300/40 bg-yellow-300/10 text-yellow-200" };
    return { text: "ACTIU", cls: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200" };
  }, [currentUser]);

  async function doLogout() {
    await logout();
    setConfirmLogout(false);
    setOpen(false);
    navigate("/login");
  }

  // Helper per no repetir codi
  const N = ({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `${itemBase} ${isActive ? itemActive : itemInactive}`}
    >
      {children}
    </NavLink>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo + nom */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img
              src={logoUrl}
              alt="logo club"
              className="h-10 w-10 rounded-lg bg-white object-contain"
            />
            <div className="leading-tight min-w-0">
              <div className="text-[10px] font-extrabold tracking-wider text-white/70">
                {preTitle}
              </div>
              <div className="text-sm font-black tracking-wide text-white truncate">
                {clubTitle}
              </div>
            </div>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-1">
            <N to="/">Inici</N>

            {/* Públic */}
            {!currentUser && (
              <>
                <N to="/courses-public">Cursos</N>
                <N to="/register">Inscripció</N>
                <N to="/login">Entrar</N>
              </>
            )}

            {/* Socis */}
            {currentUser && (
              <>
                <N to="/dashboard">Panell</N>
                <N to="/trips">Sortides</N>
                <N to="/courses-private">Formació</N>
                <N to="/social-events">Esdeveniments</N>
                <N to="/social-wall">Comunitat</N>
                <N to="/resources">Recursos</N>
                <N to="/calendar">Calendari</N>
                <N to="/profile">Perfil</N>
              </>
            )}

            {/* Admin */}
            {currentUser && canManageSystem?.() && (
              <>
                <span className="mx-2 text-white/20">|</span>
                <N to="/admin-users">Admin Socis</N>
                <N to="/admin-trips">Admin Sortides</N>
                <N to="/admin-courses">Admin Cursos</N>
                <N to="/admin-events">Admin Events</N>
                <N to="/admin-settings">Admin Config</N>
              </>
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {currentUser && roleChip && (
              <span className={`hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-black border ${roleChip.cls}`}>
                {roleChip.text}
                {currentUser.name ? ` · ${currentUser.name}` : ""}
              </span>
            )}

            {!currentUser ? (
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-yellow-400 text-black font-black hover:bg-yellow-500 transition"
              >
                Accés Socis/es
              </button>
            ) : (
              <button
                onClick={() => setConfirmLogout(true)}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white/10 text-white font-black hover:bg-white/15 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut size={16} />
                  Sortir
                </span>
              </button>
            )}

            <button
              className="md:hidden inline-flex px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15 transition"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-black">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
              <N to="/" onClick={() => setOpen(false)}>Inici</N>

              {!currentUser ? (
                <>
                  <N to="/courses-public" onClick={() => setOpen(false)}>Cursos</N>
                  <N to="/register" onClick={() => setOpen(false)}>Inscripció</N>
                  <N to="/login" onClick={() => setOpen(false)}>Entrar</N>
                  <button
                    onClick={() => { setOpen(false); navigate("/login"); }}
                    className="mt-2 px-4 py-3 rounded-xl bg-yellow-400 text-black font-black hover:bg-yellow-500 transition"
                  >
                    Accés Socis/es
                  </button>
                </>
              ) : (
                <>
                  <N to="/dashboard" onClick={() => setOpen(false)}>Panell</N>
                  <N to="/trips" onClick={() => setOpen(false)}>Sortides</N>
                  <N to="/courses-private" onClick={() => setOpen(false)}>Formació</N>
                  <N to="/social-events" onClick={() => setOpen(false)}>Esdeveniments</N>
                  <N to="/social-wall" onClick={() => setOpen(false)}>Comunitat</N>
                  <N to="/resources" onClick={() => setOpen(false)}>Recursos</N>
                  <N to="/calendar" onClick={() => setOpen(false)}>Calendari</N>
                  <N to="/profile" onClick={() => setOpen(false)}>Perfil</N>

                  {canManageSystem?.() && (
                    <>
                      <div className="h-px bg-white/10 my-2" />
                      <N to="/admin-users" onClick={() => setOpen(false)}>Admin Socis</N>
                      <N to="/admin-trips" onClick={() => setOpen(false)}>Admin Sortides</N>
                      <N to="/admin-courses" onClick={() => setOpen(false)}>Admin Cursos</N>
                      <N to="/admin-events" onClick={() => setOpen(false)}>Admin Events</N>
                      <N to="/admin-settings" onClick={() => setOpen(false)}>Admin Config</N>
                    </>
                  )}

                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="mt-2 px-4 py-3 rounded-xl bg-white/10 text-white font-black hover:bg-white/15 transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut size={16} />
                      Sortir
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Confirm logout */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border">
            <div className="p-6">
              <h2 className="text-xl font-black text-slate-900">Vols sortir del compte?</h2>
              <p className="mt-2 text-slate-600">Tancaràs la sessió actual i hauràs de tornar a entrar.</p>

              <div className="mt-6 flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="px-4 py-2 rounded-xl border font-black hover:bg-slate-50"
                >
                  Cancel·lar
                </button>
                <button
                  onClick={doLogout}
                  className="px-4 py-2 rounded-xl bg-black text-yellow-300 font-black hover:bg-black/90"
                >
                  Sortir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
