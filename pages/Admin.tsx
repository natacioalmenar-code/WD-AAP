import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { MapPin, GraduationCap, CalendarDays, Users, Settings } from "lucide-react";

export const Admin: React.FC = () => {
  const { canManageTrips, canManageSystem } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Gestió</h1>
        <p className="text-gray-600 mt-1">
          Crear, publicar i aprovar inscripcions. (Admins: control total)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {canManageTrips() && (
          <>
            <Link
              to="/admin-trips"
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 rounded-2xl p-3">
                  <MapPin className="text-black" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Sortides</div>
                  <div className="text-sm text-gray-600">Pendents, publicar, cancel·lar</div>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-courses"
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 rounded-2xl p-3">
                  <GraduationCap className="text-black" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Cursos</div>
                  <div className="text-sm text-gray-600">Aprovacions i publicació</div>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-events"
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 rounded-2xl p-3">
                  <CalendarDays className="text-black" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Esdeveniments</div>
                  <div className="text-sm text-gray-600">Quedades / activitats socials</div>
                </div>
              </div>
            </Link>
          </>
        )}

        {canManageSystem() && (
          <>
            <Link
              to="/admin-users"
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 rounded-2xl p-3">
                  <Users className="text-black" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Socis/es</div>
                  <div className="text-sm text-gray-600">Aprovar i assignar rols</div>
                </div>
              </div>
            </Link>

            <Link
              to="/admin-settings"
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 rounded-2xl p-3">
                  <Settings className="text-black" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Web/App</div>
                  <div className="text-sm text-gray-600">Logo, textos, imatges…</div>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
