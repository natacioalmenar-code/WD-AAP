import React from "react";
import { Link } from "react-router-dom";
import { ClipboardList, GraduationCap, CalendarDays, Users } from "lucide-react";

export const Admin: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Panell d’Administració</h1>
      <p className="text-gray-600 mb-8">Accés ràpid a la gestió (admin / instructor).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin-trips" className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-yellow-500" />
            <div>
              <p className="font-bold text-slate-900">Gestió Sortides</p>
              <p className="text-sm text-gray-600">Crear i administrar sortides.</p>
            </div>
          </div>
        </Link>

        <Link to="/admin-courses" className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-yellow-500" />
            <div>
              <p className="font-bold text-slate-900">Gestió Cursos</p>
              <p className="text-sm text-gray-600">Crear i administrar cursos.</p>
            </div>
          </div>
        </Link>

        <Link to="/admin-events" className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-yellow-500" />
            <div>
              <p className="font-bold text-slate-900">Gestió Esdeveniments</p>
              <p className="text-sm text-gray-600">Crear i administrar esdeveniments socials.</p>
            </div>
          </div>
        </Link>

        <Link to="/admin-users" className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Users className="text-yellow-500" />
            <div>
              <p className="font-bold text-slate-900">Gestió Socis</p>
              <p className="text-sm text-gray-600">Aprovar i canviar rols (només admin).</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
