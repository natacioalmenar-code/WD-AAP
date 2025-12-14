import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, X } from "lucide-react";

export const Trips: React.FC = () => {
  const { trips, currentUser, canManageTrips, createTrip, joinTrip, leaveTrip } = useApp();
  const [open, setOpen] = useState(false);

  // formulari (mínim)
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [levelRequired, setLevelRequired] = useState("B1");
  const [maxSpots, setMaxSpots] = useState<number>(12);

  const sorted = useMemo(
    () => [...trips].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [trips]
  );

  const canCreateHere = currentUser && canManageTrips();

  const resetForm = () => {
    setTitle("");
    setDate("");
    setLocation("");
    setLevelRequired("B1");
    setMaxSpots(12);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim() || !location.trim()) {
      alert("Omple títol, data i ubicació.");
      return;
    }

    createTrip({
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      levelRequired,
      maxSpots: Number(maxSpots) || 0,
      // si el teu Trip té més camps obligatoris, posa'ls aquí:
      // time: "",
      // depth: "",
      // description: "",
      // imageUrl: "",
      // locationUrl: "",
    });

    resetForm();
    setOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SORTIDES I VIATGES</h1>
          <p className="text-gray-600 mt-2">Apunta’t a les properes immersions amb un sol clic.</p>
        </div>

        {canCreateHere && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold bg-slate-900 text-yellow-300 hover:bg-slate-800 transition"
          >
            <Plus size={18} />
            Crear sortida
          </button>
        )}
      </div>

      {/* LLISTA */}
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Encara no hi ha sortides creades.
          </div>
        ) : (
          sorted.map((t) => {
            const isSignedUp = currentUser ? t.participants.includes(currentUser.id) : false;

            return (
              <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{t.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {t.date} · {t.location} · Nivell: {t.levelRequired} · Places: {t.participants.length}/{t.maxSpots}
                    </p>
                  </div>

                  {currentUser && (
                    isSignedUp ? (
                      <button
                        onClick={() => leaveTrip(t.id)}
                        className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                      >
                        Desapuntar-me
                      </button>
                    ) : (
                      <button
                        onClick={() => joinTrip(t.id)}
                        className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-bold"
                      >
                        Apuntar-me
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL CREAR */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-extrabold text-slate-900">Crear nova sortida</h3>
              <button
                onClick={() => { setOpen(false); }}
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
                  <label className="text-sm font-bold text-slate-700">Places màx.</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={maxSpots}
                    onChange={(e) => setMaxSpots(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Ubicació</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Nivell requerit</label>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={levelRequired}
                  onChange={(e) => setLevelRequired(e.target.value)}
                >
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="B3">B3</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { resetForm(); setOpen(false); }}
                  className="px-5 py-2 rounded-xl border font-semibold"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white font-extrabold hover:bg-orange-700"
                >
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
