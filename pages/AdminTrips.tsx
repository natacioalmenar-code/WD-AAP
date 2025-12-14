import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Trip } from "../types";

export const AdminTrips: React.FC = () => {
  const {
    trips,
    users,
    canManageSystem,
    setTripPublished,
    cancelTrip,
    deleteTrip,
  } = useApp();

  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...trips]
      .filter((t) => {
        if (!needle) return true;
        return (
          t.title.toLowerCase().includes(needle) ||
          (t.location || "").toLowerCase().includes(needle) ||
          (t.date || "").includes(needle)
        );
      })
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [trips, q]);

  const userName = (uid: string) => users.find((u) => u.id === uid)?.name || uid;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestió de Sortides</h1>
          <p className="text-gray-600 mt-1">
            Publicar/ocultar, cancel·lar i veure participants.
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="text-sm font-bold text-slate-700">Cerca</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Títol, ubicació o data…"
          />
        </div>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-gray-500">
            No hi ha sortides.
          </div>
        ) : (
          list.map((t) => <TripCard key={t.id} trip={t} userName={userName} />)
        )}
      </div>
    </div>
  );

  function TripCard({
    trip,
    userName,
  }: {
    trip: Trip;
    userName: (uid: string) => string;
  }) {
    const approved = trip.participants || [];
    const isCancelled = trip.status === "cancelled";

    const togglePublish = async () => {
      await setTripPublished(trip.id, !trip.published);
    };

    const doCancel = async () => {
      const reason = prompt("Motiu de cancel·lació (opcional):") || "";
      await cancelTrip(trip.id, reason);
    };

    const doDelete = async () => {
      if (!canManageSystem()) return;
      const ok = confirm("Segur que vols ESBORRAR definitivament esta sortida?");
      if (ok) await deleteTrip(trip.id);
    };

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
              {approved.length}/{trip.maxSpots}
            </div>

            {isCancelled && trip.cancelledReason ? (
              <div className="mt-2 text-sm text-red-700">
                <span className="font-bold">Motiu:</span> {trip.cancelledReason}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {!isCancelled && (
              <button
                onClick={togglePublish}
                className={`px-4 py-2 rounded-xl font-extrabold text-sm ${
                  trip.published
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-yellow-400 hover:bg-yellow-300"
                }`}
              >
                {trip.published ? "Ocultar" : "Publicar"}
              </button>
            )}

            {!isCancelled && (
              <button
                onClick={doCancel}
                className="px-4 py-2 rounded-xl font-extrabold text-sm border hover:bg-gray-50"
              >
                Cancel·lar
              </button>
            )}

            {canManageSystem() && (
              <button
                onClick={doDelete}
                className="px-4 py-2 rounded-xl font-extrabold text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Esborrar
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 border rounded-2xl p-4">
          <div className="font-extrabold text-slate-900 mb-2">
            Participants ({approved.length})
          </div>

          {approved.length === 0 ? (
            <div className="text-sm text-gray-500">Encara ningú.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {approved.map((uid) => (
                <span
                  key={uid}
                  className="text-xs font-bold px-2 py-1 rounded-full bg-slate-900 text-yellow-300"
                >
                  {userName(uid)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
};
