import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { PlusCircle, Users, Calendar, Clock, GraduationCap } from "lucide-react";

export const AdminCourses: React.FC = () => {
  const { courses, createCourse, currentUser } = useApp();

  const [form, setForm] = useState({
    title: "",
    date: "",
    schedule: "",
    description: "",
    price: "",
    levelRequired: "B1E",
    maxSpots: 12,
    imageUrl: "",
  });

  const sorted = useMemo(
    () => [...courses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [courses]
  );

  if (!currentUser) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) return alert("Falta el títol.");
    if (!form.date.trim()) return alert("Falta la data.");
    if (!form.schedule.trim()) return alert("Falta l'horari.");
    if (!form.description.trim()) return alert("Falta la descripció.");
    if (!form.price.trim()) return alert("Falta el preu.");

    createCourse({
      title: form.title.trim(),
      date: form.date.trim(),
      schedule: form.schedule.trim(),
      description: form.description.trim(),
      price: form.price.trim(),
      levelRequired: form.levelRequired,
      maxSpots: Number(form.maxSpots) || 12,
      imageUrl: form.imageUrl.trim(),
    });

    setForm({
      title: "",
      date: "",
      schedule: "",
      description: "",
      price: "",
      levelRequired: "B1E",
      maxSpots: 12,
      imageUrl: "",
    });

    alert("✅ Curs creat!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
          Gestió Cursos
        </h1>
        <p className="text-gray-600 mt-2">Crea cursos i gestiona informació.</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="text-yellow-500" />
          <h2 className="text-xl font-bold text-slate-900">Crear nou curs</h2>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-2"
            placeholder="Títol"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="date"
            className="border rounded-lg p-2"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            className="border rounded-lg p-2"
            placeholder="Horari (ex: 19:00-21:00)"
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          />

          <input
            className="border rounded-lg p-2"
            placeholder="Preu (ex: 120€)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <select
            className="border rounded-lg p-2"
            value={form.levelRequired}
            onChange={(e) => setForm({ ...form, levelRequired: e.target.value })}
          >
            {["B1E", "B2E", "B3E", "GG", "IN1E", "IN2E", "IN3E"].map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border rounded-lg p-2"
            placeholder="Places màximes"
            value={form.maxSpots}
            onChange={(e) => setForm({ ...form, maxSpots: Number(e.target.value) })}
          />

          <input
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Imatge (URL) - opcional"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <textarea
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Descripció"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button
            type="submit"
            className="md:col-span-2 bg-yellow-400 text-black font-extrabold rounded-lg py-3 hover:bg-yellow-300 transition"
          >
            Crear Curs
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-gray-500 italic">Encara no hi ha cursos creats.</p>
        ) : (
          sorted.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={16} className="text-yellow-500" /> {c.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={16} className="text-yellow-500" /> {c.schedule}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap size={16} className="text-yellow-500" /> {c.levelRequired}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={16} className="text-yellow-500" /> {c.participants.length} /{" "}
                    {c.maxSpots ?? "-"}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-sm font-bold text-slate-900">
                Preu: <span className="text-gray-700">{c.price}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
