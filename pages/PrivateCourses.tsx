import React from "react";
import { useApp } from "../context/AppContext";
import { Calendar, GraduationCap, Clock, CheckCircle } from "lucide-react";

export const PrivateCourses: React.FC = () => {
  const { courses, users, currentUser, joinCourse, leaveCourse } = useApp();

  if (!currentUser) return null;

  const nameFromId = (id: string) =>
    users.find((u) => u.id === id)?.name || "Persona desconeguda";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Formació continuada
        </h1>
        <p className="text-gray-600 mt-2">
          Millora el teu nivell i especialitza’t amb l’equip instructor.
        </p>
      </div>

      <div className="space-y-6">
        {courses.map((course) => {
          const isSignedUp = course.participants.includes(currentUser.id);
          const spotsLeft = course.maxSpots - course.participants.length;
          const isFull = spotsLeft <= 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row"
            >
              {/* Image */}
              <div className="md:w-1/3 h-48 md:h-auto relative">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="text-white font-bold text-lg">
                    {course.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {course.title}
                    </h2>
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

                  <p className="text-gray-600 mb-4">
                    {course.description}
                  </p>

                  {/* Participants list */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                        Persones inscrites
                      </p>
                      <span className="text-sm font-semibold text-gray-700">
                        {course.participants.length}
                        <span className="text-gray-400 font-normal">
                          {" "}
                          / {course.maxSpots}
                        </span>
                      </span>
                    </div>

                    {course.participants.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Encara no hi ha ningú inscrit/a.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {course.participants.map((uid) => (
                          <li
                            key={uid}
                            className="text-sm text-gray-700"
                          >
                            • {nameFromId(uid)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {spotsLeft} places disponibles de {course.maxSpots}
                  </span>

                  <div className="w-full md:w-auto">
                    {isSignedUp ? (
                      <button
                        onClick={() => leaveCourse(course.id)}
                        className="w-full md:w-auto px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold uppercase text-sm"
                      >
                        Desapuntar-me
                      </button>
                    ) : (
                      <button
                        onClick={() => joinCourse(course.id)}
                        disabled={isFull}
                        className={`w-full md:w-auto px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all ${
                          isFull
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md"
                        }`}
                      >
                        {isFull ? "COMPLET" : "Inscriure’m"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
