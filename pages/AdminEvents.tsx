import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, X, Calendar, Clock, MapPin, Users } from "lucide-react";

export const SocialEvents: React.FC = () => {
  const {
    socialEvents,
    users,
    currentUser,
    joinSocialEvent,
    leaveSocialEvent,
    canManageSystem,
    createSocialEvent,
  } = useApp();

  const [open, setOpen] = useState(false);

  // Form crear esdeveniment (només admin)
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxSpots, setMaxSpots] = useState<number>(30);
  const [notes, setNotes] = useState("");

  const isAdmin = canManageSystem();

  const list = useMemo(() => {
    return [...socialEvents]
      .filter((e) => isAdmin || e.published)
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [socialEvents, isAdmin]);

  const uid = currentUser?.id;

  const nameFromId = (id: string) =>
    users.find((u) => u.id === id)?.name || "Persona desconeguda";

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setMaxSpots(30);
    setNotes("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim()) {
      alert("Omple com a mínim: títol i data.");
      return;
    }
    const ms = Number(maxSpots);
    if (ms < 0) {
      alert("Les places màximes han de ser un número (0 o més).");
      return;
    }

    await createSocialEvent({
      title: title.trim(),
      date: date.trim(),
      time: time.trim() || "",
      location: location.trim() || "",
      maxSpots: ms || 0,
      notes: notes.trim() || "",
    });

    resetForm();
    setOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Esdeveniments</h1>

        {isAdmin && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold bg-slate-900 text-yellow-300 hover:bg-slate-800 transition"
          >
            <Plus size={18} />
            Crear esdeveniment
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {list.length === 0 && <div>No hi ha esdeveniments.</div>}

        {list.map((event) => {
          const participants = event.participants || [];
          const isJoined = uid ? participants.includes(uid) : false;

          const hasMax = typeof event.maxSpots === "number" && event.maxSpots > 0;
          const isFull = hasMax ? participants.length >= (event.maxSpots as number) : false;

          const isCancelled = event.status === "cancelled";

          return (
            <div key={event.id} className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <h2 className="font-extrabold text-lg">{event.title}</h2>

                  <div className="mt-1 text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={16} />
                      {event.date}
                    </span>
                    {event.time ? (
                      <span className="inline-flex items-center gap-2">
                        <Clock size={16} />
                        {event.time}
                      </span>
                    ) : null}
                    {event.location ? (
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={16} />
                        {event.location}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-2">
                      <Users size={16} />
                      {participants.length}/{event.maxSpots ?? "—"}
                    </span>
                  </div>

                  {event.notes ? (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-bold">Notes:</span> {event.notes}
                    </div>
                  ) : null}

                  {isCancelled && (
                    <div className="text-red-600 font-bold text-sm mt-3">
                      ❌ Cancel·lat {event.cancelledReason ? `— ${event.cancelledReason}` : ""}
                    </div>
                  )}

                  {isAdmin && participants.length > 0 && (
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
                      onClick={() => leaveSocialEvent(event.id)}
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
                      onClick={() => joinSocialEvent(event.id)}
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

      {/* MODAL CREAR ESDEVENIMENT */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-extrabold text-slate-900">Crear nou esdeveniment</h3>
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
                  <label className="text-sm font-bold text-slate-700">Hora (opcional)</label>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Ubicació (opcional)</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Local social"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Places màximes (0 = il·limitat)</label>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={maxSpots}
                    onChange={(e) => setMaxSpots(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Notes (opcional)</label>
                <textarea
                  className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[90px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalls, què cal portar, etc."
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
                  Crear esdeveniment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
