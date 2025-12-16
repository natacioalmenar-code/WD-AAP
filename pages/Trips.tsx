import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, X, Calendar, MapPin, BadgeCheck, Users } from "lucide-react";
import { PageHero } from "../components/PageHero";

export const Trips: React.FC = () => {
  const {
    trips,
    users,
    currentUser,
    joinTrip,
    leaveTrip,
    canManageTrips,
    createTrip,
  } = useApp();

  const [open, setOpen] = useState(false);

  // Form crear sortida
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [levelRequired, setLevelRequired] = useState("B1E");
  const [maxSpots, setMaxSpots] = useState<number>(12);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const canCreateHere = canManageTrips(); // admin o instructor (segons AppContext)

  const list = useMemo(() => {
    return [...trips]
      .filter((t) => canCreateHere || t.published)
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [trips, canCreateHere]);

  const uid = currentUser?.id;

  const nameFromId = (id: string) =>
    users.find((u) => u.id === id)?.name || "Persona desconeguda";

  const resetForm = () => {
    setTitle("");
    setDate("");
    setLocation("");
    setLevelRequired("B1E");
    setMaxSpots(12);
    setPrice("");
    setNotes("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim() || !location.trim()) {
      alert("Omple com a mínim: títol, data i ubicació.");
      return;
    }
    const ms = Number(maxSpots);
    if (!ms || ms < 1) {
      alert("Les places màximes han de ser un número >= 1.");
      return;
    }

    await createTrip({
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      levelRequired: levelRequired.trim() || "B1E",
      maxSpots: ms,
      price: price.trim() || "",
      notes: notes.trim() || "",
    });

    resetForm();
    setOpen(false);
  };

  return (
    <div className="bg-slate-50">
      <PageHero
        title="Sortides"
        subtitle="Consulta les sortides publicades i apunta’t si hi ha places disponibles."
        badge="Club / Sortides"
        right={
          canCreateHere ? (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black bg-yellow-400 text-black hover:bg-yellow-500 transition shadow"
            >
              <Plus size={18} />
              Crear sortida
            </button>
          ) : null
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="grid gap-4">
        {list.length === 0 && <div>No hi ha sortides.</div>}

        {list.map((trip) => {
          const participants = trip.participants || [];
          const isJoined = uid ? participants.includes(uid) : false;
          const isFull = participants.length >= trip.maxSpots;
          const isCancelled = trip.status === "cancelled";

          return (
            <div key={trip.id} className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <h2 className="font-extrabold text-lg">{trip.title}</h2>

                  <div className="mt-1 text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={16} />
                      {trip.date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} />
                      {trip.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <BadgeCheck size={16} />
                      Nivell: {trip.levelRequired}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users size={16} />
                      {participants.length}/{trip.maxSpots}
                    </span>
                  </div>

                  {(trip.price || trip.notes) && (
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      {trip.price ? (
                        <div>
                          <span className="font-bold">Preu:</span> {trip.price}
                        </div>
                      ) : null}
                      {trip.notes ? (
                        <div>
                          <span className="font-bold">Notes:</span> {trip.notes}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {isCancelled && (
                    <div className="text-red-600 font-bold text-sm mt-3">
                      ❌ Cancel·lada {trip.cancelledReason ? `— ${trip.cancelledReason}` : ""}
                    </div>
                  )}

                  {canCreateHere && participants.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2">
                        Participants
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {participants.map((pid) => (
                          <span
                            key={pid}
                            className="text-xs font-bold px-2 py-1 rounded-full bg-slate-900 text-yellow-300"
                          >
                            {nameFromId(pid)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  {!uid || isCancelled ? null : isJoined ? (
                    <button
                      onClick={() => leaveTrip(trip.id)}
                      className="px-4 py-2 rounded-xl bg-gray-100 font-bold"
                    >
                      Desapuntar-me
                    </button>
                  ) : isFull ? (
                    <span className="px-4 py-2 rounded-xl bg-gray-200 font-bold">
                      Complet
                    </span>
                  ) : (
                    <button
                      onClick={() => joinTrip(trip.id)}
                      className="px-4 py-2 rounded-xl bg-yellow-400 font-bold hover:bg-yellow-300"
                    >
                      Apuntar-me
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      </div>

      {/* MODAL CREAR SORTIDA */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-extrabold text-slate-900">Crear nova sortida</h3>
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
                  <label className="text-sm font-bold text-slate-700">Data</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Ubicació</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Dénia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Nivell requerit</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={levelRequired}
                    onChange={(e) => setLevelRequired(e.target.value)}
                    placeholder="B1E, B2E…"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Places màximes</label>
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={maxSpots}
                    onChange={(e) => setMaxSpots(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Preu (opcional)</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 35€"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Notes (opcional)</label>
                <textarea
                  className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[90px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Punt de trobada, material, etc."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl font-bold bg-gray-100 hover:bg-gray-200"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-extrabold bg-slate-900 text-yellow-300 hover:bg-slate-800"
                >
                  Crear sortida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
