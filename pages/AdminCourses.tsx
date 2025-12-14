import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { GraduationCap, PlusCircle } from "lucide-react";

export const AdminCourses: React.FC = () => {
  const { courses, createCourse, canManageTrips } = useApp();

  if (!canManageTrips()) {
    return <div className="p-8 text-center text-red-600">Accés denegat.</div>;
  }

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.date) {
      alert("Falten camps obligatoris (títol i data).");
      return;
    }

    createCourse({
      title: form.title,
      date: form.date,
      schedule: form.schedule || "-",
      description: form.description || "",
      price: form.price || "-",
      levelRequired: form.levelRequired,
      maxSpots: Number(form.maxSpots) || 0,
      imageUrl: form.imageUrl || "",
    } as any);

    setForm({
      title: "",
      date: "",
      schedule: "",
      description: "",
      price: "",
      levelRequired: "B1E",
      maxSpots: 10,
      imageUrl: "",
    });

    alert("Curs creat!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <GraduationCap /> Gestió de cursos
        </h1>
        <p className="text-gray-600 mt-2">Crea cursos perquè els/les socis/es s’hi puguin apuntar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PlusCircle className="text-orange-600" /> Crear curs
          </h2>

          <form onSubmit={submit} className="space-y-3">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Títol"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Horari (ex: 19:00 - 21:00)"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Preu (ex: 120€)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Places"
                value={form.maxSpots}
                onChange={(e) => setForm({ ...form, maxSpots: Number(e.target.value) })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nivell requerit (ex: B1E)"
                value={form.levelRequired}
                onChange={(e) => setForm({ ...form, levelRequired: e.target.value })}
              />
            </div>

            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Descripció"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="URL imatge (opcional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700"
            >
              Crear curs
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-4">Cursos creats ({sorted.length})</h2>

          {sorted.length === 0 ? (
            <p className="text-gray-500">Encara no n’hi ha.</p>
          ) : (
            <ul className="space-y-3">
              {sorted.map((c) => (
                <li key={c.id} className="border rounded-xl p-4">
                  <p className="font-bold text-slate-900">{c.title}</p>
                  <p className="text-sm text-gray-600">
                    {c.date} · {c.schedule} · Requisit: {c.levelRequired}
                  </p>
                  <p className="text-sm text-gray-600">Places: {c.maxSpots ?? "-"} · Preu: {c.price}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
