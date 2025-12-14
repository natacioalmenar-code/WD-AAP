import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, GraduationCap, Clock, CheckCircle } from "lucide-react";

export const PrivateCourses: React.FC = () => {
  const { courses, users, currentUser, joinCourse, leaveCourse } = useApp();

  if (!currentUser) return null;

  const nameFromId = (id: string) =>
    users.find((u) => u.id === id)?.name || "Persona desconeguda";

  const sorted = useMemo(
    () => [...courses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [courses]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Formació continuada</h1>
        <p className="text-gray-600 mt-2">Millora el teu nivell i especialitza’t amb el nostre equip.</p>
      </div>

      <div className="space-y-6">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Encara no hi ha cursos creats.
          </div>
        ) : (
          sorted.map((course) => {
            const isSignedUp = course.participants.includes(currentUser.id);
            const max = course.maxSpots ?? 0;
            const spotsLeft = course.maxSpots != null ? max - course.participants.length : null;
            const isFull = course.maxSpots != null ? (spotsLeft ?? 0) <= 0 : false;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-bold text-lg">{course.price}</span>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h2>
                      {isSignedUp && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle size={12} /> INSCRIT/A
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        Inici: {course.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        {course.schedule}
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-orange-500" />
                        Requisit: {course.levelRequired}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{course.description}</p>

                    {/* ✅ Participants list (NOMS) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                          Apuntats/des
                        </p>
                        <span className="text-sm font-bold text-slate-700">
                          {course.participants.length}{" "}
                          <span className="text-slate-400 font-normal">
                            {course.maxSpots != null ? `/ ${course.maxSpots}` : ""}
                          </span>
                        </span>
                      </div>

                      {course.participants.length === 0 ? (
                        <p className="text-sm text-gray-500 mt-2">Encara no hi ha ningú apuntat/da.</p>
                      ) : (
                        <ul className="mt-2 space-y-1">
                          {course.participants.map((uid) => (
                            <li key={uid} className="text-sm text-gray-700">
                              • {nameFromId(uid)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-end">
                    {isSignedUp ? (
                      <button
                        onClick={() => leaveCourse(course.id)}
                        className="px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                      >
                        Desapuntar-me
                      </button>
                    ) : (
                      <button
                        onClick={() => joinCourse(course.id)}
                        disabled={isFull}
                        className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${
                          isFull
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md"
                        }`}
                      >
                        {isFull ? "COMPLET" : "Inscriure’m al curs"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
