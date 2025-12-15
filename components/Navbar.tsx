import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Menu,
  X,
  LogOut,
  Home,
  Calendar,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Shield,
  HelpCircle,
  User,
} from "lucide-react";

const navBase =
  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-extrabold tracking-wide transition";

const activeCls = "bg-white text-black";
const idleCls = "text-gray-200 hover:bg-white/10 hover:text-white";

export const Navbar: React.FC = () => {
  const { currentUser, logout, canManageTrips, canManageSystem, clubSettings } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isPublic = !currentUser;

  const close = () => setOpen(false);

  // ✅ Logout “pro”: tanca menú + redirigeix a login
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      close();
      navigate("/login");
    }
  };

  const Brand = (
    <Link to="/" className="flex items-center gap-3" onClick={close}>
      <img
        src={clubSettings.logoUrl || "/westdivers-logo.png"}
        className="h-10 w-10 object-contain"
        alt="logo"
      />
      <div className="leading-tight">
        {clubSettings.navbarPreTitle ? (
          <div className="text-[10px] text-gray-300 font-extrabold uppercase">
            {clubSettings.navbarPreTitle}
          </div>
        ) : null}
        <div className="text-white text-lg font-extrabold tracking-wide">
          {clubSettings.heroTitle || "WEST DIVERS"}
        </div>
      </div>
    </Link>
  );

  const NavItem = ({
    to,
    icon,
    label,
    onClick,
  }: {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }) => (
    <NavLink
      to={to}
      onClick={() => {
        onClick?.();
        close();
      }}
      className={({ isActive }) =>
        `${navBase} ${isActive ? activeCls : idleCls}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  const MobileItem = ({
    to,
    icon,
    label,
  }: {
    to: string;
    icon: React.ReactNode;
    label: string;
  }) => (
    <Link
      to={to}
      onClick={close}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 font-extrabold"
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <nav className="bg-black sticky top-0 z-50 shadow border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {Brand}

        {/* DESKTOP */}
        <div className="hidden xl:flex items-center gap-1">
          {isPublic ? (
            <>
              <NavItem to="/" icon={<Home size={18} />} label="Inici" />
              <NavItem to="/courses-public" icon={<BookOpen size={18} />} label="Cursos" />
              <NavItem to="/login" icon={<Users size={18} />} label="Accés socis/es" />
              <NavItem to="/help" icon={<HelpCircle size={18} />} label="Ajuda" />
            </>
          ) : (
            <>
              <NavItem to="/dashboard" icon={<Home size={18} />} label="Panell" />
              <NavItem to="/social-wall" icon={<MessageSquare size={18} />} label="Mur social" />
              <NavItem to="/trips" icon={<Users size={18} />} label="Sortides" />
              <NavItem to="/courses-private" icon={<BookOpen size={18} />} label="Cursos" />
              <NavItem to="/social-events" icon={<MessageSquare size={18} />} label="Esdeveniments" />
              <NavItem to="/resources" icon={<FileText size={18} />} label="Material" />
              <NavItem to="/calendar" icon={<Calendar size={18} />} label="Calendari" />
              <NavItem to="/help" icon={<HelpCircle size={18} />} label="Ajuda" />

              {canManageTrips() && (
                <NavItem to="/admin" icon={<Shield size={18} />} label="Gestió" />
              )}
              {canManageSystem() && (
                <>
                  <NavItem to="/admin-users" icon={<Shield size={18} />} label="Socis/es" />
                  <NavItem to="/admin-settings" icon={<Shield size={18} />} label="Web" />
                </>
              )}

              <div className="ml-3 flex items-center gap-2 pl-3 border-l border-white/10">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10"
                  title="El meu perfil"
                >
                  <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center font-extrabold text-white">
                    {(currentUser?.name || "W").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="hidden 2xl:block leading-tight">
                    <div className="text-xs font-extrabold text-white">
                      {currentUser?.name}
                    </div>
                    <div className="text-[10px] text-gray-300">
                      {currentUser?.role}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl hover:bg-white/10 text-white"
                  title="Tancar sessió"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="xl:hidden p-2 rounded-xl hover:bg-white/10 text-white"
          aria-label="Obrir menú"
        >
          <Menu />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/90 text-white">
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            {Brand}
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10"
              aria-label="Tancar menú"
            >
              <X />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {isPublic ? (
              <>
                <MobileItem to="/" icon={<Home />} label="Inici" />
                <MobileItem to="/courses-public" icon={<BookOpen />} label="Cursos" />
                <MobileItem to="/login" icon={<Users />} label="Accés socis/es" />
                <MobileItem to="/help" icon={<HelpCircle />} label="Ajuda" />
              </>
            ) : (
              <>
                <MobileItem to="/dashboard" icon={<Home />} label="Panell" />
                <MobileItem to="/social-wall" icon={<MessageSquare />} label="Mur social" />
                <MobileItem to="/trips" icon={<Users />} label="Sortides" />
                <MobileItem to="/courses-private" icon={<BookOpen />} label="Cursos" />
                <MobileItem to="/social-events" icon={<MessageSquare />} label="Esdeveniments" />
                <MobileItem to="/resources" icon={<FileText />} label="Material" />
                <MobileItem to="/calendar" icon={<Calendar />} label="Calendari" />
                <MobileItem to="/profile" icon={<User />} label="El meu perfil" />
                <MobileItem to="/help" icon={<HelpCircle />} label="Ajuda" />

                {canManageTrips() && <MobileItem to="/admin" icon={<Shield />} label="Gestió" />}
                {canManageSystem() && (
                  <>
                    <MobileItem to="/admin-users" icon={<Shield />} label="Socis/es" />
                    <MobileItem to="/admin-settings" icon={<Shield />} label="Web" />
                  </>
                )}

                <div className="border-t border-white/10 my-3" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-500 font-extrabold"
                >
                  <LogOut />
                  Tancar sessió
                </button>
              </>
            )}

            <div className="pt-4 text-xs text-white/60">
              Ruta actual: <span className="font-bold">{location.pathname}</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
