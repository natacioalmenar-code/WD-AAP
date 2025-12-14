import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import type { SocialEvent } from "../types";

export const SocialEvents: React.FC = () => {
  const {
    socialEvents,
    currentUser,
    joinSocialEvent,
    leaveSocialEvent,
    canManageTrips,
  } = useApp();

  const list = useMemo(() => {
    return socialEvents
      .filter((e) => canManageTrips() || e.published)
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [socialEvents, canManageTrips]);

  const uid = currentUser?.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Esdeveniments</h1>

      <div className="grid gap-4">
        {list.length === 0 && <div>No hi ha esdeveniments.</div>}

        {list.map((event) => {
          const participants = event.participants || [];
          const isJoined = uid ? participants.includes(uid) : false;
          const isFull =
            event.maxSpots !== undefined &&
            participants.length >= event.maxSpots;
          const isCancelled = event.status === "cancelled";

          return (
            <div
              key={event.id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-extrabold text-lg">{event.title}</h2>
                  <div className="text-sm text-gray-600">
                    {event.date}
                    {event.time ? ` · ${event.time}` : ""} · {event.location}
                  </div>
                  <div className="text-sm mt-1">
                    Places: {participants.length}/{event.maxSpots ?? "—"}
                  </div>

                  {isCancelled && (
                    <div className="text-red-600 font-bold text-sm mt-2">
                      ❌ Cancel·lat
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
    </div>
  );
};
