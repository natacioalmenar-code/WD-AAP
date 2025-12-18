import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Course } from "../types";

export const AdminCourses: React.FC = () => {
  const {
    courses,
    users,
    canManageSystem,
    canManageTrips,
    approveCourse,
    setCoursePublished,
    cancelCourse,
    deleteCourse,
  } = useApp();

  const [q, setQ] = useState("");

  const userName = (uid: string) => users.find((u) => u.id === uid)?.name || uid;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...courses]
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

  const pending = filtered.filter((c: any) => (c.approvalStatus || "pending") !== "approved");
  const approved = filtered.filter((c: any) => (c.approvalStatus || "pending") === "approved");

  if (!canManageTrips()) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold text-slate-900">Cursos</h1>
          <p className="text-gray-600 mt-2">No tens permisos per veure la gestió.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestió de Cursos</h1>
          <p className="text-gray-600 mt-1">
            Instructor crea → pendent · Admin aprova → després es pot publicar.
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="text-sm font-bold text-slate-700">Cerca</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Títol, nivell o data…"
          />
        </div>
      </div>

      {/* PENDENTS */}
      {canManageSystem() && (
        <div className="mb-8 bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
                PENDENTS D’APROVACIÓ
              </div>
              <h2 className="mt-3 text-xl font-extrabold text-slate-900">
                Cursos pendents ({pending.length})
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                Aprova per permetre publicar-los al calendari i secció de formació.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {pending.length === 0 ? (
              <div className="text-sm text-gray-500">Cap pendent.</div>
            ) : (
              pending.map((c) => (
                <CourseRow
                  key={c.id}
                  course={c}
                  userName={userName}
                  isPending
                  onApprove={() => approveCourse(c.id)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* APROVATS */}
      <div className="space-y-4">
        {approved.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-gray-500">
            No hi ha cursos aprovats.
          </div>
        ) : (
          approved.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              userName={userName}
              canDelete={canManageSystem()}
              onPublish={() => setCoursePublished(c.id, !c.published)}
              onCancel={() => cancelCourse(c.id, prompt("Motiu (opcional):") || "")}
              onDelete={() => deleteCourse(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

function CourseRow({
  course,
  userName,
  isPending,
  onApprove,
}: {
  course: Course;
  userName: (uid: string) => string;
  isPending?: boolean;
  onApprove: () => void;
}) {
  return (
    <div className="border rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <div className="font-extrabold text-slate-900 truncate">{course.title}</div>
        <div className="text-sm text-slate-600">
          {course.date} · {course.schedule} · Nivell: {course.levelRequired} · Creat per:{" "}
          <b>{userName(course.createdBy)}</b>
        </div>
      </div>

      {isPending ? (
        <button
          onClick={onApprove}
          className="px-4 py-2 rounded-xl bg-slate-900 text-yellow-300 font-black hover:opacity-90"
        >
          Aprovar
        </button>
      ) : null}
    </div>
  );
}

function CourseCard({
  course,
  userName,
  canDelete,
  onPublish,
  onCancel,
  onDelete,
}: {
  course: Course;
  userName: (uid: string) => string;
  canDelete: boolean;
  onPublish: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const approved = course.participants || [];
  const isCancelled = course.status === "cancelled";

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-900">{course.title}</h2>

            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : course.published
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isCancelled ? "CANCEL·LAT" : course.published ? "PUBLICAT" : "OCULT"}
            </span>

            <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-900 text-yellow-300">
              APROVAT
            </span>
          </div>

          <div className="text-sm text-gray-600 mt-1">
            {course.date} · Horari: {course.schedule} · Nivell: {course.levelRequired} · Places:{" "}
            {approved.length}/{course.maxSpots ?? "—"} · Preu: {course.price || "—"} · Creat per:{" "}
            <b>{userName(course.createdBy)}</b>
          </div>

          {isCancelled && course.cancelledReason ? (
            <div className="mt-2 text-sm text-red-700">
              <span className="font-bold">Motiu:</span> {course.cancelledReason}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isCancelled && (
            <button
              onClick={onPublish}
              className={`px-4 py-2 rounded-xl font-extrabold text-sm ${
                course.published
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-yellow-400 hover:bg-yellow-300"
              }`}
            >
              {course.published ? "Ocultar" : "Publicar"}
            </button>
          )}

          {!isCancelled && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl font-extrabold text-sm border hover:bg-gray-50"
            >
              Cancel·lar
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => {
                if (confirm("Segur que vols ESBORRAR definitivament este curs?")) onDelete();
              }}
              className="px-4 py-2 rounded-xl font-extrabold text-sm bg-red-600 text-white hover:bg-red-700"
            >
              Esborrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
