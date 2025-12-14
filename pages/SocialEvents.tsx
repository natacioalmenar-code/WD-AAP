import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  CheckCircle,
  PlusCircle,
} from "lucide-react";

export const SocialEvents: React.FC = () => {
  const {
    socialEvents,
    currentUser,
    joinSocialEvent,
    leaveSocialEvent,
    createSocialEvent,
    canManageTrips,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);

  // Formulari (admin/instructor)
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    locationUrl: "",
    description: "",
    imageUrl: "",
    maxSpots: "",
  });

  if (!currentUser) return null;

  const canCreate = canManageTrips(); // admin o instructor

  const sorted = useMemo(
    () => [...socialEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [socialEvents]
  );

  const onSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const title = form.title.trim();
    const date = form.date.trim();

    if (!title || !date) {
      alert("Falten dades: títol i data són obligatoris.");
      return;
    }

    const maxSpotsNum =
      form.maxSpots.trim() === "" ? undefined : Number(form.maxSpots.trim());

    if (maxSpotsNum !== undefined && (!Number.isFinite(maxSpotsNum) || maxSpotsNum <= 0)) {
      alert("El número de places ha de ser un número positiu (o deixa-ho en blanc).");
      return;
    }

    createSocialEvent({
      title,
      date,
      time: form.time.trim() || undefined,
      location: form.location.trim() || undefined,
      locationUrl: form.locationUrl.trim() || undefined,
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      maxSpots: maxSpotsNum,
    });

    // reset
    setForm({
      title: "",
      date: "",
      time: "",
      location: "",
      locationUrl: "",
      description: "",
      imageUrl: "",
      maxSpots: "",
    });
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Esdeveniments socials</h1>
          <p className="text-gray-600 mt-2">Apunta’t a sopars, xerrades i activitats socials.</p>
        </div>

        {/* ✅ Botó crear (només admin/instructor) */}
        {canCreate && (
          <button
            onClick={() => setIsCreating((v) => !v)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold bg-slate-900 text-yellow-400 hover:bg-slate-800 transition-colors"
          >
            <PlusCircle size={18} />
            {isCreating ? "Tancar formulari" : "Crear esdeveniment"}
          </button>
        )}
      </div>

      {/* ✅ Formulari crear */}
      {canCreate && isCreating && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Nou esdeveniment</h2>

          <form onSubmit={onSubmitCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Títol *
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Sopar de Nadal, Xerrada, Barbacoa..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Data *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Hora
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Lloc
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Restaurant, local, platja..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Enllaç ubicació (Google Maps)
              </label>
              <input
                value={form.locationUrl}
                onChange={(e) => setForm({ ...form, locationUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Places màximes (opcional)
              </label>
              <input
                value={form.maxSpots}
                onChange={(e) => setForm({ ...form, maxSpots: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Ex: 20"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                URL imatge (opcional)
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Descripció (opcional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[90px]"
                placeholder="Detalls, què cal portar, preu, etc."
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

      {/* Llistat */}
      <div className="space-y-6">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Encara no hi ha esdeveniments creats.
          </div>
        ) : (
          sorted.map((ev) => {
            const isSignedUp = ev.participants.includes(currentUser.id);
            const spotsLeft = ev.maxSpots != null ? ev.maxSpots - ev.participants.length : null;
            const isFull = ev.maxSpots != null ? spotsLeft! <= 0 : false;

            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  {ev.imageUrl ? (
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{ev.title}</h2>
                      {isSignedUp && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle size={12} /> INSCRIT/A
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        {ev.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        {ev.time || "-"}
                      </div>

                      <div className="flex items-center gap-2 md:col-span-2">
                        <MapPin size={16} className="text-orange-500" />
                        {ev.locationUrl ? (
                          <a
                            href={ev.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 truncate"
                          >
                            {ev.location || "Ubicació"} <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="truncate">{ev.location || "-"}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-orange-500" />
                        {ev.participants.length} / {ev.maxSpots ?? "-"}
                        {spotsLeft != null && (
                          <span className="text-gray-400">({spotsLeft} places)</span>
                        )}
                      </div>
                    </div>

                    {ev.description && <p className="text-gray-600 mb-4">{ev.description}</p>}
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-end">
                    {isSignedUp ? (
                      <button
                        onClick={() => leaveSocialEvent(ev.id)}
                        className="px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                      >
                        Desapuntar-me
                      </button>
                    ) : (
                      <button
                        onClick={() => joinSocialEvent(ev.id)}
                        disabled={isFull}
                        className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${
                          isFull
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md"
                        }`}
                      >
                        {isFull ? "COMPLET" : "Apuntar-me"}
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
  );
};

