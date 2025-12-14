import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import type { Course } from "../types";

export const Courses: React.FC = () => {
  const { courses, currentUser, joinCourse, leaveCourse, canManageTrips } = useApp();

  const list = useMemo(() => {
    return courses
      .filter((c) => canManageTrips() || c.published)
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [courses, canManageTrips]);

  const uid = currentUser?.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Cursos</h1>

      <div className="grid gap-4">
        {list.length === 0 && <div>No hi ha cursos.</div>}

        {list.map((course) => {
          const participants = course.participants || [];
          const isJoined = uid ? participants.includes(uid) : false;
          const isFull =
            course.maxSpots !== undefined &&
            participants.length >= course.maxSpots;
          const isCancelled = course.status === "cancelled";

          return (
            <div
              key={course.id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-extrabold text-lg">{course.title}</h2>
                  <div className="text-sm text-gray-600">
                    {course.date} · {course.schedule} · Nivell {course.levelRequired}
                  </div>
                  <div className="text-sm mt-1">
                    Places: {participants.length}/{course.maxSpots ?? "—"}
                  </div>

                  {isCancelled && (
                    <div className="text-red-600 font-bold text-sm mt-2">
                      ❌ Cancel·lat
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  {!uid || isCancelled ? null : isJoined ? (
                    <button
                      onClick={() => leaveCourse(course.id)}
                      className="px-4 py-2 rounded-xl bg-gray-100 font-bold"
                    >
                      Desapuntar-me
                    </button>
                  ) : isFull ? (
                    <span className="px-4 py-2 rounded-xl bg-gray-200 font-bold">
                      Complet
                    </span>
                  ) : (
                    <button
                      onClick={() => joinCourse(course.id)}
                      className="px-4 py-2 rounded-xl bg-yellow-400 font-bold hover:bg-yellow-300"
                    >
                      Apuntar-me
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
