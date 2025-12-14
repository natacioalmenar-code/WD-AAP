import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, CalendarDays, Clock, Euro, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";

export const CoursesPublic: React.FC = () => {
  const { courses, clubSettings } = useApp();

  const sorted = useMemo(() => {
    return [...courses].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [courses]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-yellow-400 rounded-2xl p-3">
            <GraduationCap className="text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Cursos</h1>
            <p className="text-gray-600">
              Formació i especialitats a {clubSettings.heroTitle || "WEST DIVERS"}.
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-bold text-slate-900">Vols reservar plaça?</p>
            <p className="text-sm text-gray-600">
              La inscripció i la gestió de places és només per a socis/es.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="bg-slate-900 text-white px-4 py-2 rounded-xl font-extrabold text-sm hover:bg-slate-800"
            >
              Accés socis/es
            </Link>
            <Link
              to="/"
              className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-extrabold text-sm hover:bg-yellow-300"
            >
              Tornar a inici
            </Link>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
          <p className="text-lg font-extrabold text-slate-900 mb-2">Encara no hi ha cursos</p>
          <p className="text-gray-600">
            Quan l’equip instructor en cree, apareixeran aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sorted.map((c) => (
            <div key={c.id} className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              {c.imageUrl ? (
                <img src={c.imageUrl} alt={c.title} className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 w-full bg-gradient-to-r from-slate-900 to-slate-800" />
              )}

              <div className="p-5">
                <h2 className="text-lg font-extrabold text-slate-900 mb-2">{c.title}</h2>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    <span className="font-semibold">{c.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{c.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro size={16} />
                    <span>{c.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span>
                      <span className="font-semibold">Nivell:</span> {c.levelRequired || "—"}
                    </span>
                  </div>
                </div>

                {c.description ? (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-4">{c.description}</p>
                ) : null}

                <div className="mt-4 flex items-center justify-between">
                  {typeof c.maxSpots === "number" ? (
                    <span className="text-xs text-gray-500">
                      Places: {c.maxSpots === 0 ? "Il·limitades" : c.maxSpots}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">&nbsp;</span>
                  )}

                  <Link
                    to="/login"
                    className="text-sm font-extrabold text-yellow-700 hover:text-yellow-800"
                  >
                    Inicia sessió per inscriure’t →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
