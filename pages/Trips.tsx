import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, Clock, MapPin, ArrowRight, ExternalLink, PlusCircle } from "lucide-react";

export const Trips: React.FC = () => {
  const {
    trips,
    users,
    currentUser,
    joinTrip,
    leaveTrip,
    createTrip,
    canManageTrips,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    locationUrl: "",
    depth: "",
    description: "",
    imageUrl: "",
    levelRequired: "B1E",
    maxSpots: "12",
  });

  if (!currentUser) return null;

  const canCreate = canManageTrips();

  const sortedTrips = useMemo(
    () => [...trips].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [trips]
  );

  const nameFromId = (id: string) => users.find((u) => u.id === id)?.name || "Persona desconeguda";

  const onSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const title = form.title.trim();
    const date = form.date.trim();
    const location = form.location.trim();
    const levelRequired = form.levelRequired.trim();
    const maxSpotsNum = Number(form.maxSpots);

    if (!title || !date || !location || !levelRequired) {
      alert("Falten dades: títol, data, lloc i nivell requerit són obligatoris.");
      return;
    }
    if (!Number.isFinite(maxSpotsNum) || maxSpotsNum <= 0) {
      alert("El número de places ha de ser un número positiu.");
      return;
    }

    createTrip({
      title,
      date,
      location,
      levelRequired,
      maxSpots: maxSpotsNum,
      time: form.time.trim() || undefined,
      depth: form.depth.trim() || undefined,
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      locationUrl: form.locationUrl.trim() || undefined,
    });

    setForm({
      title: "",
      date: "",
      time: "",
      location: "",
      locationUrl: "",
      depth: "",
      description: "",
      imageUrl: "",
      levelRequired: "B1E",
      maxSpots: "12",
    });
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="border-b border-gray-200 pb-4 w-full md:w-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
            Sortides i viatges
          </h1>
          <p className="text-gray-600 mt-2">Apunta’t a les properes immersions amb un sol clic.</p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreating((v) => !v)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold bg-slate-900 text-yellow-400 hover:bg-slate-800 transition-colors"
          >
            <PlusCircle size={18} />
            {isCreating ? "Tancar formulari" : "Crear sortida"}
          </button>
        )}
      </div>

      {canCreate && isCreating && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Nova sortida</h2>

          <form onSubmit={onSubmitCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Títol *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Immersió a Tossa, Viatge a... "
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data *</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lloc *</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Tossa de Mar, L'Estartit..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Enllaç ubicació (Maps)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.locationUrl}
                onChange={(e) => setForm({ ...form, locationUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profunditat</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.depth}
                onChange={(e) => setForm({ ...form, depth: e.target.value })}
                placeholder="Ex: 20-30m"
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

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL imatge</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripció</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[90px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Punt de trobada, què cal portar, etc."
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
                className="px-5 py-2 rounded-lg font-bold bg-yellow-400 text-black hover:bg-yellow-300"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {sortedTrips.map((trip) => {
          const isSignedUp = trip.participants.includes(currentUser.id);
          const spotsLeft = trip.maxSpots - trip.participants.length;
          const isFull = spotsLeft <= 0;

          return (
            <div
              key={trip.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-xl border border-gray-100"
            >
              <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                {trip.imageUrl ? (
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200" />
                )}

                <div className="absolute top-0 left-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-br-lg uppercase tracking-wider">
                  {trip.levelRequired}
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">{trip.title}</h2>
                    {isSignedUp && (
                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase">
                        Inscrit/a
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-4 text-sm text-gray-600 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-yellow-500" />
                      <span className="font-medium text-slate-800">{trip.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-yellow-500" />
                      <span>{trip.time || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2 md:col-span-1 lg:col-span-1">
                      <MapPin size={18} className="text-yellow-500" />
                      {trip.locationUrl ? (
                        <a
                          href={trip.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline truncate flex items-center gap-1"
                        >
                          {trip.location} <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="truncate">{trip.location}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight size={18} className="text-yellow-500" />
                      <span>{trip.depth || "-"}</span>
                    </div>
                  </div>

                  {trip.description && <p className="text-gray-600 mb-4 leading-relaxed">{trip.description}</p>}

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                        Apuntats/des
                      </p>
                      <span className="text-sm font-bold text-slate-700">
                        {trip.participants.length}{" "}
                        <span className="text-slate-400 font-normal">/ {trip.maxSpots}</span>
                      </span>
                    </div>

                    {trip.participants.length === 0 ? (
                      <p className="text-sm text-gray-500 mt-2">Encara no hi ha ningú apuntat/da.</p>
                    ) : (
                      <ul className="mt-2 space-y-1">
                        {trip.participants.map((uid) => (
                          <li key={uid} className="text-sm text-gray-700">
                            • {nameFromId(uid)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-4">
                  <div className="w-full md:w-auto">
                    {isSignedUp ? (
                      <button
                        onClick={() => leaveTrip(trip.id)}
                        className="w-full md:w-auto px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold"
                      >
                        Desapuntar-me
                      </button>
                    ) : (
                      <button
                        onClick={() => joinTrip(trip.id)}
                        disabled={isFull}
                        className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold shadow-md uppercase text-sm tracking-wider transition-all transform active:scale-95 ${
                          isFull
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg"
                        }`}
                      >
                        {isFull ? "Complet" : "Apunta-m’hi"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
