import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Users, MapPinned, GraduationCap, CalendarDays, Settings } from "lucide-react";

export const AdminManagementCards: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useApp();

  const pendingCount = useMemo(() => {
    return (users || []).filter((u: any) => (u.role === "pending" || u.status === "pending")).length;
  }, [users]);

  const Card = ({
    title,
    desc,
    icon,
    to,
    badge,
  }: {
    title: string;
    desc: string;
    icon: React.ReactNode;
    to: string;
    badge?: string;
  }) => (
    <button
      onClick={() => navigate(to)}
      className="bg-white border rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition w-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black">
            {icon}
          </div>
          <div>
            <div className="font-black text-slate-900">{title}</div>
            <div className="text-sm text-slate-600 mt-1">{desc}</div>
          </div>
        </div>

        {badge ? (
          <span className="text-xs font-black px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-200">
            {badge}
          </span>
        ) : null}
      </div>
    </button>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-black rounded-3xl p-6 md:p-8 text-white border border-white/10">
        <div className="text-yellow-300 font-black text-sm tracking-wider">PANEL D’ADMINISTRACIÓ</div>
        <h2 className="text-2xl md:text-3xl font-black mt-2">Gestió ràpida</h2>
        <p className="text-white/80 mt-2">
          Accedeix a les seccions d’administració. Només l’admin pot aprovar socis/es.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            title="Socis/es"
            desc="Aprovar pendents, canviar rols i revisar dades."
            icon={<Users size={18} />}
            to="/admin-users"
            badge={pendingCount > 0 ? `Pendents: ${pendingCount}` : undefined}
          />
          <Card
            title="Sortides"
            desc="Crear i editar sortides del club."
            icon={<MapPinned size={18} />}
            to="/admin-trips"
          />
          <Card
            title="Cursos"
            desc="Gestionar formació i especialitats."
            icon={<GraduationCap size={18} />}
            to="/admin-courses"
          />
          <Card
            title="Esdeveniments"
            desc="Crear i publicar esdeveniments socials."
            icon={<CalendarDays size={18} />}
            to="/admin-events"
          />
          <Card
            title="Configuració"
            desc="Logo, textos, imatges i paràmetres del club."
            icon={<Settings size={18} />}
            to="/admin-settings"
          />
        </div>
      </div>
    </section>
  );
};
