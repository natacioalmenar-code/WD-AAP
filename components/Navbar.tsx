import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const navItem =
  "px-3 py-2 rounded-xl font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition";

const navActive = "bg-slate-100 text-slate-900";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, canManageSystem } = useApp();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const roleLabel = useMemo(() => {
    if (!currentUser) return null;
    const r = (currentUser.role || "").toString().toLowerCase();
    const s = (currentUser.status || "").toString().toLowerCase();

    if (r === "admin") return { text: "ADMIN", cls: "chip border-red-200 bg-red-50 text-red-700" };
    if (r === "pending" || s === "pending")
      return { text: "PENDING", cls: "chip border-yellow-200 bg-yellow-50 text-yellow-800" };
    return { text: "ACTIU", cls: "chip border-emerald-200 bg-emerald-50 text-emerald-700" };
  }, [currentUser]);

  async function doLogout() {
    await logout();
    setConfirmLogout(false);
    setOpen(false);
    navigate("/login");
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="container-app py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-yellow-400 flex items-center justify-center font-black">
              WD
            </div>
            <div className="leading-tight">
              <div className="font-black">WD-AAP</div>
              <div className="text-xs text-slate-500">Club · Sortides · Cursos</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
              Inici
            </NavLink>

            {currentUser ? (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Panell
                </NavLink>
                <NavLink to="/trips" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Sortides
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Calendari
                </NavLink>
                <NavLink to="/resources" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Recursos
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Perfil
                </NavLink>

                {canManageSystem() && (
                  <NavLink to="/admin-users" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Admin
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/courses-public" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Cursos
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Inscripció
                </NavLink>
                <NavLink to="/login" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                  Entrar
                </NavLink>
              </>
            )}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {currentUser && roleLabel && (
              <span className={roleLabel.cls}>
                {roleLabel.text}
                {currentUser.name ? ` · ${currentUser.name}` : ""}
              </span>
            )}

            {currentUser && (
              <button className="btn btn-ghost py-2 px-3" onClick={() => setConfirmLogout(true)}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Sortir</span>
              </button>
            )}

            <button
              className="md:hidden btn btn-ghost py-2 px-3"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden border-t bg-white">
            <div className="container-app py-3 flex flex-col gap-2">
              <NavLink onClick={() => setOpen(false)} to="/" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                Inici
              </NavLink>

              {currentUser ? (
                <>
                  <NavLink onClick={() => setOpen(false)} to="/dashboard" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Panell
                  </NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/trips" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Sortides
                  </NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/calendar" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Calendari
                  </NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/resources" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Recursos
                  </NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/profile" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Perfil
                  </NavLink>

                  {canManageSystem() && (
                    <NavLink onClick={() => setOpen(false)} to="/admin-users" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                      Admin
                    </NavLink>
                  )}

                  <button className="btn btn-danger" onClick={() => setConfirmLogout(true)}>
                    <LogOut size={16} /> Sortir
                  </button>
                </>
              ) : (
                <>
                  <NavLink onClick={() => setOpen(false)} to="/courses-public" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Cursos
                  </NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/register" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Inscripció
                  </NavLink>
                  <NavLink onClick={() => setOpen(false)} to="/login" className={({ isActive }) => `${navItem} ${isActive ? navActive : ""}`}>
                    Entrar
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Confirm logout modal */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="card w-full max-w-sm">
            <div className="card-pad">
              <h2 className="text-xl font-black">Vols sortir del compte?</h2>
              <p className="muted mt-2">Tancaràs la sessió actual i hauràs de tornar a entrar.</p>

              <div className="flex gap-2 justify-end mt-6">
                <button className="btn btn-ghost" onClick={() => setConfirmLogout(false)}>
                  Cancel·lar
                </button>
                <button className="btn btn-danger" onClick={doLogout}>
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
