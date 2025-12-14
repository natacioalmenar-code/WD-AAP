import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import type { Trip } from "../types";

export const Trips: React.FC = () => {
  const { trips, currentUser, joinTrip, leaveTrip, canManageTrips } = useApp();

  const list = useMemo(() => {
    return trips
      .filter((t) => canManageTrips() || t.published)
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [trips, canManageTrips]);

  const uid = currentUser?.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Sortides</h1>

      <div className="grid gap-4">
        {list.length === 0 && <div>No hi ha sortides.</div>}

        {list.map((trip) => {
          const participants = trip.participants || [];
          const isJoined = uid ? participants.includes(uid) : false;
          const isFull = participants.length >= trip.maxSpots;
          const isCancelled = trip.status === "cancelled";

          return (
            <div
              key={trip.id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-extrabold text-lg">{trip.title}</h2>
                  <div className="text-sm text-gray-600">
                    {trip.date} · {trip.location} · Nivell {trip.levelRequired}
                  </div>
                  <div className="text-sm mt-1">
                    Places: {participants.length}/{trip.maxSpots}
                  </div>

                  {isCancelled && (
                    <div className="text-red-600 font-bold text-sm mt-2">
                      ❌ Cancel·lada
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
  );
};
