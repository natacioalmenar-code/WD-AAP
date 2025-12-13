import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, Clock, MapPin, ExternalLink, Users, CheckCircle } from "lucide-react";

export const SocialEvents: React.FC = () => {
  const { socialEvents, currentUser, joinSocialEvent, leaveSocialEvent } = useApp();

  if (!currentUser) return null;

  const sorted = useMemo(
    () => [...socialEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [socialEvents]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Esdeveniments Socials</h1>
        <p className="text-gray-600 mt-2">Apunta’t a sopars, xerrades i activitats socials.</p>
      </div>

      <div className="space-y-6">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            Encara no hi ha esdeveniments creats.
          </div>
        ) : (
          sorted.map((ev) => {
            const isSignedUp = ev.participants.includes(currentUser.id);
            const spotsLeft = (ev.maxSpots ?? 0) - ev.participants.length;
            const isFull = ev.maxSpots != null ? spotsLeft <= 0 : false;

            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  {ev.imageUrl ? (
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{ev.title}</h2>
                      {isSignedUp && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle size={12} /> INSCRIT
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        {ev.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-orange-500" />
                        {ev.time || "-"}
                      </div>

                      <div className="flex items-center gap-2 md:col-span-2">
                        <MapPin size={16} className="text-orange-500" />
                        {ev.locationUrl ? (
                          <a
                            href={ev.locationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 truncate"
                          >
                            {ev.location || "Ubicació"} <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="truncate">{ev.location || "-"}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-orange-500" />
                        {ev.participants.length} / {ev.maxSpots ?? "-"}
                      </div>
                    </div>

                    {ev.description && <p className="text-gray-600 mb-4">{ev.description}</p>}
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-end">
                    {isSignedUp ? (
                      <button
                        onClick={() => leaveSocialEvent(ev.id)}
                        className="px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                      >
                        Desapuntar-me
                      </button>
                    ) : (
                      <button
                        onClick={() => joinSocialEvent(ev.id)}
                        disabled={isFull}
                        className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${
                          isFull
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md"
                        }`}
                      >
                        {isFull ? "COMPLET" : "Apuntar-me"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

