import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  FileText,
  BookOpen,
  LogOut,
  Shield,
} from "lucide-react";

const navItemBase =
  "flex items-center gap-2 px-3 py-2 rounded-xl font-extrabold transition";

export const Navbar: React.FC = () => {
  const { currentUser, logout, canManageTrips, canManageSystem } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO + NOM */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => go("/")}
        >
          <img
            src="/westdivers-logo.png"
            alt="West Divers"
            className="h-9 w-9 object-contain"
          />
          <span className="font-extrabold tracking-wide">WEST DIVERS</span>
        </div>

        {/* DESKTOP */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavItem to="/social" icon={<Home size={18} />} label="Mur social" />
          <NavItem to="/trips" icon={<Users size={18} />} label="Sortides" />
          <NavItem to="/courses" icon={<BookOpen size={18} />} label="Cursos" />
          <NavItem
            to="/resources"
            icon={<FileText size={18} />}
            label="Material"
          />
          <NavItem
            to="/calendar"
            icon={<Calendar size={18} />}
            label="Calendari"
          />

          {canManageTrips() && (
            <NavItem
              to="/dashboard"
              icon={<Shield size={18} />}
              label="Administració"
            />
          )}
        </nav>

        {/* USUARI */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
            <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center font-extrabold">
              {currentUser.name?.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-sm">{currentUser.name}</span>
          </div>

          <button
            onClick={logout}
            title="Tancar sessió"
            className="p-2 rounded-xl hover:bg-white/10"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* BOTÓ MÒBIL */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-white/10"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      </div>

      {/* MENÚ MÒBIL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 text-white">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/westdivers-logo.png"
                className="h-8 w-8"
                alt="logo"
              />
              <span className="font-extrabold">WEST DIVERS</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10"
            >
              <X />
            </button>
          </div>

          <div className="px-4 pt-4 space-y-2">
            <MobileItem
              icon={<Home />}
              label="Mur social"
              onClick={() => go("/social")}
            />
            <MobileItem
              icon={<Users />}
              label="Sortides"
              onClick={() => go("/trips")}
            />
            <MobileItem
              icon={<BookOpen />}
              label="Cursos"
              onClick={() => go("/courses")}
            />
            <MobileItem
              icon={<FileText />}
              label="Material"
              onClick={() => go("/resources")}
            />
            <MobileItem
              icon={<Calendar />}
              label="Calendari"
              onClick={() => go("/calendar")}
            />

            {canManageTrips() && (
              <MobileItem
                icon={<Shield />}
                label="Administració"
                onClick={() => go("/dashboard")}
              />
            )}

            <div className="border-t border-white/20 my-4" />

            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-extrabold">
                {currentUser.name?.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="font-extrabold">{currentUser.name}</div>
                <div className="text-xs text-white/70">
                  {currentUser.role}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-extrabold"
            >
              <LogOut />
              Tancar sessió
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const NavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${navItemBase} ${
          isActive
            ? "bg-white text-black"
            : "hover:bg-white/10 text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const MobileItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 font-extrabold text-left"
  >
    {icon}
    {label}
  </button>
);
