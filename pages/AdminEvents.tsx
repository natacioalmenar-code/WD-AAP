import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export const AdminEvents: React.FC = () => {
  const { socialEvents, createSocialEvent, currentUser } = useApp();

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    maxSpots: 30,
    imageUrl: "",
    locationUrl: "",
  });

  const sorted = useMemo(
    () => [...socialEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [socialEvents]
  );

  if (!currentUser) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.date) {
      alert("Falten camps obligatoris (títol i data).");
      return;
    }

    createSocialEvent({
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      description: form.description,
      maxSpots: Number(form.maxSpots) || 0,
      imageUrl: form.imageUrl || "",
      locationUrl: form.locationUrl || "",
    });

    setForm((p) => ({
      ...p,
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      imageUrl: "",
      locationUrl: "",
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Gestió d’Esdeveniments</h1>
        <p className="text-gray-600 mt-2">Crear esdeveniments socials (admin / instructor).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Crear esdeveniment</h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Títol *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Ex: Sopar, Xerrada, Sortida social..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora</label>
                <input
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Ex: 20:30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lloc</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Ex: Restaurant X"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Enllaç ubicació (opcional)</label>
              <input
                value={form.locationUrl}
                onChange={(e) => setForm({ ...form, locationUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Places</label>
                <input
                  type="number"
                  value={form.maxSpots}
                  onChange={(e) => setForm({ ...form, maxSpots: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg p-2"
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
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripció</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[110px]"
                placeholder="Info..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-extrabold py-2 rounded-lg hover:bg-yellow-300"
            >
              Crear esdeveniment
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Esdeveniments creats</h2>

          {sorted.length === 0 ? (
            <p className="text-gray-500">Encara no hi ha esdeveniments.</p>
          ) : (
            <div className="space-y-4">
              {sorted.map((ev) => (
                <div key={ev.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{ev.title}</p>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p className="flex items-center gap-2"><Calendar size={16} /> {ev.date}</p>
                        <p className="flex items-center gap-2"><Clock size={16} /> {ev.time || "-"}</p>
                        <p className="flex items-center gap-2"><MapPin size={16} /> {ev.location || "-"}</p>
                        <p className="flex items-center gap-2">
                          <Users size={16} /> {ev.participants.length} / {ev.maxSpots ?? "-"}
                        </p>
                      </div>
                    </div>

                    {ev.imageUrl ? (
                      <img
                        src={ev.imageUrl}
                        alt={ev.title}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg border" />
                    )}
                  </div>

                  {ev.description && (
                    <p className="text-sm text-gray-600 mt-3">{ev.description}</p>
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
