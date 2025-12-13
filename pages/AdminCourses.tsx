import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, Clock, GraduationCap, Euro, Users } from "lucide-react";

export const AdminCourses: React.FC = () => {
  const { courses, createCourse, currentUser } = useApp();

  const [form, setForm] = useState({
    title: "",
    date: "",
    schedule: "",
    description: "",
    price: "",
    levelRequired: "B1E",
    maxSpots: 10,
    imageUrl: "",
  });

  const sorted = useMemo(
    () => [...courses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [courses]
  );

  if (!currentUser) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.date) {
      alert("Falten camps obligatoris (títol i data).");
      return;
    }

    createCourse({
      title: form.title,
      date: form.date,
      schedule: form.schedule,
      description: form.description,
      price: form.price,
      levelRequired: form.levelRequired,
      maxSpots: Number(form.maxSpots) || 0,
      imageUrl: form.imageUrl || "",
    });

    setForm((p) => ({
      ...p,
      title: "",
      date: "",
      schedule: "",
      description: "",
      price: "",
      imageUrl: "",
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Gestió de Cursos</h1>
        <p className="text-gray-600 mt-2">Crear cursos (admin / instructor).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Crear curs</h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Títol *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Ex: Nitrox, Rescat..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data inici *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horari</label>
                <input
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Ex: 19:00-21:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preu</label>
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Ex: 120€"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Places</label>
                <input
                  type="number"
                  value={form.maxSpots}
                  onChange={(e) => setForm({ ...form, maxSpots: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nivell requerit</label>
              <input
                value={form.levelRequired}
                onChange={(e) => setForm({ ...form, levelRequired: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Ex: B1E"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imatge (URL)</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripció</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[110px]"
                placeholder="Info del curs..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-extrabold py-2 rounded-lg hover:bg-yellow-300"
            >
              Crear curs
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Cursos creats</h2>

          {sorted.length === 0 ? (
            <p className="text-gray-500">Encara no hi ha cursos.</p>
          ) : (
            <div className="space-y-4">
              {sorted.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p className="flex items-center gap-2"><Calendar size={16} /> {c.date}</p>
                        <p className="flex items-center gap-2"><Clock size={16} /> {c.schedule || "-"}</p>
                        <p className="flex items-center gap-2"><GraduationCap size={16} /> {c.levelRequired}</p>
                        <p className="flex items-center gap-2"><Euro size={16} /> {c.price || "-"}</p>
                        <p className="flex items-center gap-2">
                          <Users size={16} /> {c.participants.length} / {c.maxSpots ?? "-"}
                        </p>
                      </div>
                    </div>

                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg border" />
                    )}
                  </div>

                  {c.description && (
                    <p className="text-sm text-gray-600 mt-3">{c.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
