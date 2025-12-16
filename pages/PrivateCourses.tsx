import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Calendar,
  GraduationCap,
  Clock,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import { PageHero } from "../components/PageHero";

export const PrivateCourses: React.FC = () => {
  const {
    courses,
    users,
    currentUser,
    joinCourse,
    leaveCourse,
    canManageTrips,
    createCourse,
  } = useApp();

  const [open, setOpen] = useState(false);

  // Formulari (mínim)
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [levelRequired, setLevelRequired] = useState("B1");
  const [maxSpots, setMaxSpots] = useState<number>(12);
  const [imageUrl, setImageUrl] = useState("");

  if (!currentUser) return null;

  const nameFromId = (id: string) =>
    users.find((u) => u.id === id)?.name || "Persona desconeguda";

  const sorted = useMemo(
    () =>
      [...courses].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [courses]
  );

  const canCreateHere = currentUser && canManageTrips(); // admin o instructor

  const resetForm = () => {
    setTitle("");
    setDate("");
    setSchedule("");
    setDescription("");
    setPrice("");
    setLevelRequired("B1");
    setMaxSpots(12);
    setImageUrl("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim() || !schedule.trim() || !description.trim()) {
      alert("Omple com a mínim: títol, data d’inici, horari i descripció.");
      return;
    }

    createCourse({
      title: title.trim(),
      date: date.trim(),
      schedule: schedule.trim(),
      description: description.trim(),
      price: price.trim() || "—",
      levelRequired,
      maxSpots: Number(maxSpots) || 0,
      imageUrl: imageUrl.trim() || undefined,
    });

    resetForm();
    setOpen(false);
  };

  return (
    <div className="bg-slate-50">
      <PageHero
        title="Formació"
        subtitle="Cursos del club i formació continuada. Inscripció ràpida i gestió de places."
        badge="Club / Formació"
        right={
          canCreateHere ? (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black bg-yellow-400 text-black hover:bg-yellow-500 transition shadow"
            >
              <Plus size={18} />
              Crear curs
            </button>
          ) : null
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="space-y-6">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Encara no hi ha cursos creats.
          </div>
        ) : (
          sorted.map((course) => {
            const isSignedUp = course.participants.includes(currentUser.id);
            const max = course.maxSpots ?? 0;
            const spotsLeft =
              course.maxSpots != null ? max - course.participants.length : null;
            const isFull =
              course.maxSpots != null ? (spotsLeft ?? 0) <= 0 : false;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-bold text-lg">
                      {course.price}
                    </span>
                  </div>
                </div>

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

                    <p className="text-gray-600 mb-4">{course.description}</p>

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
                        <p className="text-sm text-gray-500 mt-2">
                          Encara no hi ha ningú apuntat/da.
                        </p>
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

      {/* MODAL CREAR CURS */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-extrabold text-slate-900">Crear nou curs</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Tancar"
              >
                <X />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700">Títol</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Data inici</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Places màx.</label>
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={maxSpots}
                    onChange={(e) => setMaxSpots(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Horari</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="Ex: Dissabtes 10:00-13:00"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Preu</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="Ex: 120€"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Nivell requerit</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={levelRequired}
                  onChange={(e) => setLevelRequired(e.target.value)}
                >
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="B3">B3</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Imatge (URL) (opcional)</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Descripció</label>
                <textarea
                  className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[110px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl border font-semibold"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white font-extrabold hover:bg-orange-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
