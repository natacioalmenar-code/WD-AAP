import React, { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Trip } from "../types";

export const AdminTrips: React.FC = () => {
  const {
    trips,
    users,
    canManageTrips,
    canManageSystem,
    createTrip,
    setTripPublished,
    cancelTrip,
    deleteTrip,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [levelRequired, setLevelRequired] = useState("B1");
  const [maxSpots, setMaxSpots] = useState<number>(12);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...trips]
      .filter((t) => {
        if (!needle) return true;
        return (
          (t.title || "").toLowerCase().includes(needle) ||
          (t.location || "").toLowerCase().includes(needle) ||
          (t.date || "").includes(needle)
        );
      })
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [trips, q]);

  const userName = (uid: string) => users.find((u) => u.id === uid)?.name || uid;

  const resetForm = () => {
    setTitle("");
    setDate("");
    setLocation("");
    setLevelRequired("B1");
    setMaxSpots(12);
    setPrice("");
    setNotes("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageTrips()) {
      alert("Només administració o instructors poden crear sortides.");
      return;
    }
    if (!title.trim() || !date.trim() || !location.trim()) {
      alert("Omple: títol, data i ubicació.");
      return;
    }

    await createTrip({
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      levelRequired,
      maxSpots: Number(maxSpots) || 0,
      price: price.trim() || undefined,
      notes: notes.trim() || undefined,
    } as any);

    resetForm();
    setOpen(false);
  };

  if (!canManageTrips()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Gestió de Sortides</h1>
          <p className="text-gray-600 mt-2">No tens permisos per gestionar sortides.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestió de Sortides</h1>
          <p className="text-gray-600 mt-1">Crear, publicar/ocultar, cancel·lar i esborrar (admin).</p>
        </div>

        <div className="w-full md:w-80 space-y-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-extrabold bg-yellow-400 text-black hover:bg-yellow-500"
          >
            <Plus size={18} />
            Crear sortida
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
            No hi ha sortides.
          </div>
        ) : (
          list.map((t) => (
            <TripCard
              key={t.id}
              trip={t}
              userName={userName}
              canDelete={canManageSystem()}
              onPublish={(published) => setTripPublished(t.id, published)}
              onCancel={() => cancelTrip(t.id, prompt("Motiu (opcional):") || "")}
              onDelete={() => deleteTrip(t.id)}
            />
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-extrabold text-slate-900">Crear nova sortida</h3>
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
                  <label className="text-sm font-bold text-slate-700">Places màx.</label>
                  <input type="number" min={1} className="mt-1 w-full rounded-xl border px-3 py-2" value={maxSpots} onChange={(e) => setMaxSpots(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Ubicació</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Nivell requerit</label>
                  <select className="mt-1 w-full rounded-xl border px-3 py-2" value={levelRequired} onChange={(e) => setLevelRequired(e.target.value)}>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="B3">B3</option>
                    <option value="INSTRUCTOR">INSTRUCTOR</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Preu (opcional)</label>
                  <input className="mt-1 w-full rounded-xl border px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
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

function TripCard({
  trip,
  userName,
  canDelete,
  onPublish,
  onCancel,
  onDelete,
}: {
  trip: Trip;
  userName: (uid: string) => string;
  canDelete: boolean;
  onPublish: (published: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const approved = (trip.participants || []) as string[];
  const isCancelled = trip.status === "cancelled";

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-900">{trip.title}</h2>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : trip.published
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isCancelled ? "CANCEL·LADA" : trip.published ? "PUBLICADA" : "OCULTA"}
            </span>
          </div>

          <div className="text-sm text-gray-600 mt-1">
            {trip.date} · {trip.location} · Nivell: {trip.levelRequired} · Places:{" "}
            {approved.length}/{(trip as any).maxSpots ?? "—"}
          </div>

          {isCancelled && (trip as any).cancelledReason ? (
            <div className="mt-2 text-sm text-red-700">
              <span className="font-bold">Motiu:</span> {(trip as any).cancelledReason}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isCancelled && (
            <button
              onClick={() => onPublish(!trip.published)}
              className={`px-4 py-2 rounded-xl font-extrabold text-sm ${
                trip.published ? "bg-gray-100 hover:bg-gray-200" : "bg-yellow-400 hover:bg-yellow-500"
              }`}
            >
              {trip.published ? "Ocultar" : "Publicar"}
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

          {canDelete && (
            <button
              onClick={() => {
                if (confirm("Segur que vols ESBORRAR definitivament esta sortida?")) onDelete();
              }}
              className="px-4 py-2 rounded-xl font-extrabold text-sm bg-red-600 text-white hover:bg-red-700"
            >
              Esborrar
            </button>
          )}
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
