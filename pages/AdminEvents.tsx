import React, { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { SocialEvent } from "../types";

export const AdminEvents: React.FC = () => {
  const {
    socialEvents,
    users,
    canManageSystem,
    createSocialEvent,
    setSocialEventPublished,
    cancelSocialEvent,
    deleteSocialEvent,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxSpots, setMaxSpots] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...socialEvents]
      .filter((e) => {
        if (!needle) return true;
        return (
          (e.title || "").toLowerCase().includes(needle) ||
          ((e as any).location || "").toLowerCase().includes(needle) ||
          (e.date || "").includes(needle)
        );
      })
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [socialEvents, q]);

  const userName = (uid: string) => users.find((u) => u.id === uid)?.name || uid;

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setMaxSpots(0);
    setNotes("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageSystem()) {
      alert("Només administració pot crear esdeveniments.");
      return;
    }
    if (!title.trim() || !date.trim()) {
      alert("Omple: títol i data.");
      return;
    }

    await createSocialEvent({
      title: title.trim(),
      date: date.trim(),
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      maxSpots: maxSpots ? Number(maxSpots) : undefined,
      notes: notes.trim() || undefined,
    } as any);

    resetForm();
    setOpen(false);
  };

  if (!canManageSystem()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Gestió d’Esdeveniments</h1>
          <p className="text-gray-600 mt-2">Només administració pot crear/gestionar esdeveniments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestió d’Esdeveniments</h1>
          <p className="text-gray-600 mt-1">Crear, publicar/ocultar, cancel·lar i esborrar.</p>
        </div>

        <div className="w-full md:w-80 space-y-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-extrabold bg-yellow-400 text-black hover:bg-yellow-500"
          >
            <Plus size={18} />
            Crear esdeveniment
          </button>

          <div>
            <label className="text-sm font-bold text-slate-700">Cerca</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Títol, ubicació o data…"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-gray-500">
            No hi ha esdeveniments.
          </div>
        ) : (
          list.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              userName={userName}
              onPublish={(published) => setSocialEventPublished(ev.id, published)}
              onCancel={() => cancelSocialEvent(ev.id, prompt("Motiu (opcional):") || "")}
              onDelete={() => deleteSocialEvent(ev.id)}
            />
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-extrabold text-slate-900">Crear nou esdeveniment</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700">Títol</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Data</label>
                  <input type="date" className="mt-1 w-full rounded-xl border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Hora (opcional)</label>
                  <input type="time" className="mt-1 w-full rounded-xl border px-3 py-2" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Ubicació (opcional)</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Places màx. (0 = il·limitat)</label>
                <input type="number" min={0} className="mt-1 w-full rounded-xl border px-3 py-2" value={maxSpots} onChange={(e) => setMaxSpots(Number(e.target.value))} />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Notes (opcional)</label>
                <textarea className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[110px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { resetForm(); setOpen(false); }} className="px-5 py-2 rounded-xl border font-semibold">
                  Cancel·lar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-slate-900 text-yellow-300 font-extrabold hover:bg-slate-800">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function EventCard({
  event,
  userName,
  onPublish,
  onCancel,
  onDelete,
}: {
  event: SocialEvent;
  userName: (uid: string) => string;
  onPublish: (published: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const approved = (event.participants || []) as string[];
  const isCancelled = event.status === "cancelled";

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-900">{event.title}</h2>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : event.published
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isCancelled ? "CANCEL·LAT" : event.published ? "PUBLICAT" : "OCULT"}
            </span>
          </div>

          <div className="text-sm text-gray-600 mt-1">
            {event.date}
            {(event as any).time ? ` · ${(event as any).time}` : ""}
            {(event as any).location ? ` · ${(event as any).location}` : ""} · Participants: {approved.length}
          </div>

          {isCancelled && (event as any).cancelledReason ? (
            <div className="mt-2 text-sm text-red-700">
              <span className="font-bold">Motiu:</span> {(event as any).cancelledReason}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isCancelled && (
            <button
              onClick={() => onPublish(!event.published)}
              className={`px-4 py-2 rounded-xl font-extrabold text-sm ${
                event.published ? "bg-gray-100 hover:bg-gray-200" : "bg-yellow-400 hover:bg-yellow-500"
              }`}
            >
              {event.published ? "Ocultar" : "Publicar"}
            </button>
          )}

          {!isCancelled && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl font-extrabold text-sm border hover:bg-gray-50"
            >
              Cancel·lar
            </button>
          )}

          <button
            onClick={() => {
              if (confirm("Segur que vols ESBORRAR definitivament este esdeveniment?")) onDelete();
            }}
            className="px-4 py-2 rounded-xl font-extrabold text-sm bg-red-600 text-white hover:bg-red-700"
          >
            Esborrar
          </button>
        </div>
      </div>

      <div className="mt-5 border rounded-2xl p-4">
        <div className="font-extrabold text-slate-900 mb-2">Participants ({approved.length})</div>

        {approved.length === 0 ? (
          <div className="text-sm text-gray-500">Encara ningú.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {approved.map((uid) => (
              <span key={uid} className="text-xs font-bold px-2 py-1 rounded-full bg-slate-900 text-yellow-300">
                {userName(uid)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
