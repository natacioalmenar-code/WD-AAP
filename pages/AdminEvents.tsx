import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { SocialEvent } from "../types";

export const AdminEvents: React.FC = () => {
  const {
    socialEvents,
    users,
    canManageSystem,
    setSocialEventPublished,
    cancelSocialEvent,
    deleteSocialEvent,
    approveSocialEventRequest,
    rejectSocialEventRequest,
  } = useApp();

  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...socialEvents]
      .filter((e) => {
        if (!needle) return true;
        return (
          e.title.toLowerCase().includes(needle) ||
          (e.location || "").toLowerCase().includes(needle) ||
          (e.date || "").includes(needle)
        );
      })
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [socialEvents, q]);

  const userName = (uid: string) => users.find((u) => u.id === uid)?.name || uid;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestió d’Esdeveniments</h1>
          <p className="text-gray-600 mt-1">Publicar/ocultar, cancel·lar i aprovar sol·licituds.</p>
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
            No hi ha esdeveniments.
          </div>
        ) : (
          list.map((e) => <EventCard key={e.id} event={e} userName={userName} />)
        )}
      </div>
    </div>
  );

  function EventCard({
    event,
    userName,
  }: {
    event: SocialEvent;
    userName: (uid: string) => string;
  }) {
    const pending = event.pendingParticipants || [];
    const approved = event.participants || [];
    const isCancelled = event.status === "cancelled";

    const togglePublish = async () => {
      await setSocialEventPublished(event.id, !event.published);
    };

    const doCancel = async () => {
      const reason = prompt("Motiu de cancel·lació (opcional):") || "";
      await cancelSocialEvent(event.id, reason);
    };

    const doDelete = async () => {
      if (!canManageSystem()) return;
      const ok = confirm("Segur que vols ESBORRAR definitivament este esdeveniment?");
      if (ok) await deleteSocialEvent(event.id);
    };

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
              {event.time ? ` · ${event.time}` : ""}{" "}
              {event.location ? ` · ${event.location}` : ""} · Places: {approved.length}/
              {event.maxSpots ?? "—"}
            </div>

            {isCancelled && event.cancelledReason ? (
              <div className="mt-2 text-sm text-red-700">
                <span className="font-bold">Motiu:</span> {event.cancelledReason}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {!isCancelled && (
              <button
                onClick={togglePublish}
                className={`px-4 py-2 rounded-xl font-extrabold text-sm ${
                  event.published
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-yellow-400 hover:bg-yellow-300"
                }`}
              >
                {event.published ? "Ocultar" : "Publicar"}
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

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="border rounded-2xl p-4">
            <div className="font-extrabold text-slate-900 mb-2">
              Sol·licituds pendents ({pending.length})
            </div>

            {pending.length === 0 ? (
              <div className="text-sm text-gray-500">Cap pendent.</div>
            ) : (
              <div className="space-y-2">
                {pending.map((uid) => (
                  <div
                    key={uid}
                    className="flex items-center justify-between gap-2 border rounded-xl p-2"
                  >
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {userName(uid)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveSocialEventRequest(event.id, uid)}
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white font-bold text-xs hover:bg-green-700"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejectSocialEventRequest(event.id, uid)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 font-bold text-xs hover:bg-gray-200"
                      >
                        Denegar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-2xl p-4">
            <div className="font-extrabold text-slate-900 mb-2">
              Participants aprovats ({approved.length})
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
      </div>
    );
  }
};
