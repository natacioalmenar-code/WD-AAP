import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const itemBase =
  "px-3 py-2 rounded-xl font-extrabold transition whitespace-nowrap";
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

    if (role === "admin")
      return { text: "ADMIN", cls: "border-red-400/40 bg-red-500/10 text-red-200" };

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

  return (
    <>
      {/* BARRA SUPERIOR NEGRA */}
      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* LOGO + NOM CLUB (ESQUERRA) */}
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

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${itemBase} ${isActive ? itemActive : itemInactive}`
              }
            >
              Inici
            </NavLink>

            {!currentUser && (
              <>
                <NavLink
                  to="/courses-public"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Cursos
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Inscripció
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Entrar
                </NavLink>
              </>
            )}

            {currentUser && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Panell
                </NavLink>
                <NavLink
                  to="/trips"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Sortides
                </NavLink>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Calendari
                </NavLink>
                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Recursos
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${itemBase} ${isActive ? itemActive : itemInactive}`
                  }
                >
                  Perfil
                </NavLink>

                {canManageSystem?.() && (
                  <NavLink
                    to="/admin-users"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Gestió
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* DRETA: CHIP + BOTÓ ACCÉS/SORTIR + HAMBURGUESA */}
          <div className="flex items-center gap-2">
            {currentUser && roleChip && (
              <span
                className={`hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-black border ${roleChip.cls}`}
              >
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

        {/* MENU MOBILE */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-black">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
              <NavLink
                onClick={() => setOpen(false)}
                to="/"
                className={({ isActive }) =>
                  `${itemBase} ${isActive ? itemActive : itemInactive}`
                }
              >
                Inici
              </NavLink>

              {!currentUser ? (
                <>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/courses-public"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Cursos
                  </NavLink>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/register"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Inscripció
                  </NavLink>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/login"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Entrar
                  </NavLink>

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="mt-2 px-4 py-3 rounded-xl bg-yellow-400 text-black font-black hover:bg-yellow-500 transition"
                  >
                    Accés Socis/es
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/dashboard"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Panell
                  </NavLink>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/trips"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Sortides
                  </NavLink>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/calendar"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Calendari
                  </NavLink>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/resources"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Recursos
                  </NavLink>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/profile"
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? itemActive : itemInactive}`
                    }
                  >
                    Perfil
                  </NavLink>

                  {canManageSystem?.() && (
                    <NavLink
                      onClick={() => setOpen(false)}
                      to="/admin-users"
                      className={({ isActive }) =>
                        `${itemBase} ${isActive ? itemActive : itemInactive}`
                      }
                    >
                      Gestió
                    </NavLink>
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

      {/* MODAL CONFIRMAR SORTIR (amb estil institucional) */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border">
            <div className="p-6">
              <h2 className="text-xl font-black text-slate-900">
                Vols sortir del compte?
              </h2>
              <p className="mt-2 text-slate-600">
                Tancaràs la sessió actual i hauràs de tornar a entrar.
              </p>

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
