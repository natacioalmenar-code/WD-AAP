import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { CalendarDays, PlusCircle } from "lucide-react";

export const AdminEvents: React.FC = () => {
  const { socialEvents, createSocialEvent, canManageTrips } = useApp();

  if (!canManageTrips()) {
    return <div className="p-8 text-center text-red-600">Accés denegat.</div>;
  }

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    locationUrl: "",
    description: "",
    maxSpots: 0,
    imageUrl: "",
  });

  const sorted = useMemo(
    () => [...socialEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [socialEvents]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.date) {
      alert("Falten camps obligatoris (títol i data).");
      return;
    }

    const maxSpots = Number(form.maxSpots);
    createSocialEvent({
      title: form.title,
      date: form.date,
      time: form.time || "",
      location: form.location || "",
      locationUrl: form.locationUrl || "",
      description: form.description || "",
      imageUrl: form.imageUrl || "",
      maxSpots: maxSpots > 0 ? maxSpots : undefined,
    } as any);

    setForm({
      title: "",
      date: "",
      time: "",
      location: "",
      locationUrl: "",
      description: "",
      maxSpots: 0,
      imageUrl: "",
    });

    alert("Esdeveniment creat!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <CalendarDays /> Gestió d’esdeveniments
        </h1>
        <p className="text-gray-600 mt-2">Crea esdeveniments socials perquè la gent s’hi apunti.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PlusCircle className="text-orange-600" /> Crear esdeveniment
          </h2>

          <form onSubmit={submit} className="space-y-3">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Títol"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Hora (opcional)"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Lloc (opcional)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="URL ubicació (Google Maps) (opcional)"
              value={form.locationUrl}
              onChange={(e) => setForm({ ...form, locationUrl: e.target.value })}
            />

            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Descripció (opcional)"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Places (0 = il·limitat)"
                value={form.maxSpots}
                onChange={(e) => setForm({ ...form, maxSpots: Number(e.target.value) })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="URL imatge (opcional)"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700"
            >
              Crear esdeveniment
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-4">Esdeveniments creats ({sorted.length})</h2>

          {sorted.length === 0 ? (
            <p className="text-gray-500">Encara no n’hi ha.</p>
          ) : (
            <ul className="space-y-3">
              {sorted.map((ev) => (
                <li key={ev.id} className="border rounded-xl p-4">
                  <p className="font-bold text-slate-900">{ev.title}</p>
                  <p className="text-sm text-gray-600">
                    {ev.date} {ev.time ? `· ${ev.time}` : ""} {ev.location ? `· ${ev.location}` : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    Places: {ev.maxSpots ?? "il·limitat"} · Apuntats/des: {ev.participants.length}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
