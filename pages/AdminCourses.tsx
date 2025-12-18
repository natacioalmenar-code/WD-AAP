import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Course } from "../types";

export const AdminCourses: React.FC = () => {
  const {
    courses,
    users,
    canManageSystem,
    setCoursePublished,
    cancelCourse,
    deleteCourse,
  } = useApp();

  const isAdmin = canManageSystem?.() ?? false;
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...(courses || [])]
      .filter((c) => {
        if (!needle) return true;
        return (
          (c.title || "").toLowerCase().includes(needle) ||
          (c.levelRequired || "").toLowerCase().includes(needle) ||
          (c.date || "").includes(needle)
        );
      })
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [courses, q]);

  const userName = (uid: string) =>
    users.find((u) => u.id === uid)?.name || uid;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-7">
          <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
            ADMIN · CURSOS
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
            Gestió de Cursos
          </h1>
          <p className="text-slate-600 mt-1">
            Publicar, cancel·lar i gestionar cursos del club.
          </p>

          <div className="mt-6 max-w-sm">
            <label className="text-xs font-black text-slate-600">
              Cerca
            </label>
            <input
              className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Títol, nivell o data…"
            />
          </div>
        </div>

        {/* Llista */}
        <div className="mt-8 space-y-4">
          {list.length === 0 ? (
            <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-10 text-center text-slate-500">
              No hi ha cursos.
            </div>
          ) : (
            list.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                userName={userName}
                isAdmin={isAdmin}
                onPublish={(v) => setCoursePublished(course.id, v)}
                onCancel={() =>
                  cancelCourse(course.id, prompt("Motiu (opcional):") || "")
                }
                onDelete={() => deleteCourse(course.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function CourseCard({
  course,
  userName,
  isAdmin,
  onPublish,
  onCancel,
  onDelete,
}: {
  course: Course;
  userName: (uid: string) => string;
  isAdmin: boolean;
  onPublish: (published: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const approved = course.participants || [];
  const isCancelled = course.status === "cancelled";

  return (
    <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-900">
              {course.title}
            </h2>

            <span
              className={`text-xs font-black px-3 py-1 rounded-full border ${
                isCancelled
                  ? "bg-red-50 border-red-200 text-red-700"
                  : course.published
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {isCancelled
                ? "CANCEL·LAT"
                : course.published
                ? "PUBLICAT"
                : "OCULT"}
            </span>
          </div>

          <div className="text-sm text-slate-600 mt-1">
            {course.date || "—"} ·{" "}
            {course.schedule || "Horari no indicat"} · Nivell:{" "}
            {course.levelRequired || "—"} · Places:{" "}
            {approved.length}/{course.maxSpots ?? "—"} · Preu:{" "}
            {course.price || "—"}
          </div>

          {isCancelled && course.cancelledReason && (
            <div className="mt-2 text-sm text-red-700">
              <span className="font-black">Motiu:</span>{" "}
              {course.cancelledReason}
            </div>
          )}
        </div>

        {/* ACCIONS — NOMÉS ADMIN */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            {!isCancelled && (
              <button
                onClick={() => onPublish(!course.published)}
                className={`px-4 py-2 rounded-2xl font-black text-sm ${
                  course.published
                    ? "bg-white border hover:bg-slate-50"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                {course.published ? "Ocultar" : "Publicar"}
              </button>
            )}

            {!isCancelled && (
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-2xl font-black text-sm border bg-white hover:bg-slate-50"
              >
                Cancel·lar
              </button>
            )}

            <button
              onClick={() => {
                if (
                  confirm("Segur que vols ESBORRAR definitivament este curs?")
                )
                  onDelete();
              }}
              className="px-4 py-2 rounded-2xl font-black text-sm bg-red-600 text-white hover:bg-red-700"
            >
              Esborrar
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border bg-white/60 p-4">
        <div className="font-extrabold text-slate-900 mb-2">
          Participants ({approved.length})
        </div>

        {approved.length === 0 ? (
          <div className="text-sm text-slate-500">Encara ningú.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {approved.map((uid) => (
              <span
                key={uid}
                className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-yellow-300"
              >
                {userName(uid)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
