import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, GraduationCap, Clock, CheckCircle, PlusCircle } from "lucide-react";

export const PrivateCourses: React.FC = () => {
  const {
    courses,
    currentUser,
    joinCourse,
    leaveCourse,
    createCourse,
    canManageTrips,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    schedule: "",
    description: "",
    price: "",
    levelRequired: "B1E",
    maxSpots: "12",
    imageUrl: "",
  });

  if (!currentUser) return null;

  const canCreate = canManageTrips();

  const sorted = useMemo(
    () => [...courses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [courses]
  );

  const onSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const title = form.title.trim();
    const date = form.date.trim();
    const schedule = form.schedule.trim();
    const description = form.description.trim();
    const price = form.price.trim();
    const levelRequired = form.levelRequired.trim();
    const maxSpotsNum = Number(form.maxSpots);

    if (!title || !date || !schedule || !description || !price || !levelRequired) {
      alert("Falten dades: hi ha camps obligatoris (títol, data, horari, descripció, preu, nivell).");
      return;
    }
    if (!Number.isFinite(maxSpotsNum) || maxSpotsNum <= 0) {
      alert("El número de places ha de ser un número positiu.");
      return;
    }

    createCourse({
      title,
      date,
      schedule,
      description,
      price,
      levelRequired,
      maxSpots: maxSpotsNum,
      imageUrl: form.imageUrl.trim() || undefined,
    });

    setForm({
      title: "",
      date: "",
      schedule: "",
      description: "",
      price: "",
      levelRequired: "B1E",
      maxSpots: "12",
      imageUrl: "",
    });
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Formació continuada</h1>
          <p className="text-gray-600 mt-2">
            Millora el teu nivell i especialitza't amb els nostres instructors/es.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreating((v) => !v)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold bg-slate-900 text-yellow-400 hover:bg-slate-800 transition-colors"
          >
            <PlusCircle size={18} />
            {isCreating ? "Tancar formulari" : "Crear curs"}
          </button>
        )}
      </div>

      {canCreate && isCreating && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Nou curs</h2>

          <form onSubmit={onSubmitCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Títol *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nitrox, Rescat, Perfeccionament..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data inici *</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horari *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                placeholder="Ex: 19:00–21:00 (teoria) + dissabte mar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preu *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Ex: 120€"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nivell requerit *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.levelRequired}
                onChange={(e) => setForm({ ...form, levelRequired: e.target.value })}
                placeholder="B1E / B2E..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Places *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                inputMode="numeric"
                value={form.maxSpots}
                onChange={(e) => setForm({ ...form, maxSpots: e.target.value })}
                placeholder="12"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL imatge</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripció *</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[90px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Contingut del curs, requisits, què inclou..."
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg font-bold bg-orange-600 text-white hover:bg-orange-700"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Encara no hi ha cursos creats.
          </div>
        ) : (
          sorted.map((course) => {
            const isSignedUp = course.participants.includes(currentUser.id);
            const max = course.maxSpots ?? 0;
            const spotsLeft = max - course.participants.length;
            const isFull = course.maxSpots != null ? spotsLeft <= 0 : false;

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
                    <div className="flex justify-between items-start gap-3">
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
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-between items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {course.maxSpots != null ? (
                        <>
                          {spotsLeft} places disponibles de {course.maxSpots}
                        </>
                      ) : (
                        <>
                          {course.participants.length} persones inscrites
                        </>
                      )}
                    </span>

                    <div className="w-full md:w-auto">
                      {isSignedUp ? (
                        <button
                          onClick={() => leaveCourse(course.id)}
                          className="w-full md:w-auto px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                        >
                          Desapuntar-me
                        </button>
                      ) : (
                        <button
                          onClick={() => joinCourse(course.id)}
                          disabled={isFull}
                          className={`w-full md:w-auto px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
