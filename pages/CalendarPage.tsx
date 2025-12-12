import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { CalendarDays, MapPin, GraduationCap, Users } from "lucide-react";

type CalendarItem =
  | {
      kind: "trip";
      id: string;
      title: string;
      date: string;
      location?: string;
      levelRequired?: string;
      participants: string[];
    }
  | {
      kind: "course";
      id: string;
      title: string;
      date: string;
      schedule?: string;
      levelRequired?: string;
      participants: string[];
    };

export const CalendarPage: React.FC = () => {
  const { currentUser, trips, courses, users } = useApp();
  const [filter, setFilter] = useState<"all" | "trips" | "courses">("all");

  if (!currentUser) return null;

  const nameFromId = (id: string) =>
    users.find((u) => u.id === id)?.name || "Persona desconeguda";

  const items = useMemo<CalendarItem[]>(() => {
    const tripItems: CalendarItem[] = trips.map((t) => ({
      kind: "trip",
      id: t.id,
      title: t.title,
      date: t.date,
      location: t.location,
      levelRequired: t.levelRequired,
      participants: t.participants ?? [],
    }));

    const courseItems: CalendarItem[] = courses.map((c) => ({
      kind: "course",
      id: c.id,
      title: c.title,
      date: c.date,
      schedule: c.schedule,
      levelRequired: c.levelRequired,
      participants: c.participants ?? [],
    }));

    const merged = [...tripItems, ...courseItems];

    merged.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return da - db;
    });

    return merged;
  }, [trips, courses]);

  const filtered = useMemo(() => {
    if (filter === "trips") return items.filter((i) => i.kind === "trip");
    if (filter === "courses") return items.filter((i) => i.kind === "course");
    return items;
  }, [items, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const item of filtered) {
      const key = item.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
  }, [filtered]);

  const niceDate = (isoOrText: string) => {
    // si ja tens dates en format text, no ho trenquem
    const d = new Date(isoOrText);
    if (Number.isNaN(d.getTime())) return isoOrText;
    return d.toLocaleDateString("ca-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
            Calendari
          </h1>
          <p className="text-gray-600 mt-2">
            Agenda de sortides i cursos del club.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
              filter === "all"
                ? "bg-slate-900 text-yellow-400 border-slate-900"
                : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Tot
          </button>
          <button
            onClick={() => setFilter("trips")}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
              filter === "trips"
                ? "bg-slate-900 text-yellow-400 border-slate-900"
                : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Sortides
          </button>
          <button
            onClick={() => setFilter("courses")}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
              filter === "courses"
                ? "bg-slate-900 text-yellow-400 border-slate-900"
                : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Cursos
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-600">
          Encara no hi ha cap activitat al calendari.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, dayItems]) => (
            <div key={date} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-yellow-400 flex items-center gap-2">
                <CalendarDays size={18} />
                <span className="font-extrabold capitalize">{niceDate(date)}</span>
                <span className="ml-auto text-xs font-bold bg-yellow-400 text-black px-2 py-1 rounded-full">
                  {dayItems.length} activitat(s)
                </span>
              </div>

              <div className="p-6 space-y-4">
                {dayItems.map((item) => {
                  const isTrip = item.kind === "trip";
                  const badge =
                    item.kind === "trip"
                      ? "SORTIDA"
                      : "CURS";

                  return (
                    <div
                      key={`${item.kind}-${item.id}`}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold px-2 py-1 rounded-full ${
                                isTrip
                                  ? "bg-yellow-100 text-yellow-900"
                                  : "bg-orange-100 text-orange-900"
                              }`}
                            >
                              {badge}
                            </span>
                            {item.levelRequired && (
                              <span className="text-xs font-bold text-slate-500">
                                Requisit: {item.levelRequired}
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                            {item.title}
                          </h3>

                          <div className="mt-2 text-sm text-gray-600 flex flex-col md:flex-row md:items-center gap-2">
                            {isTrip ? (
                              item.location ? (
                                <span className="flex items-center gap-2">
                                  <MapPin size={16} className="text-yellow-500" />
                                  {item.location}
                                </span>
                              ) : null
                            ) : (
                              (item as any).schedule ? (
                                <span className="flex items-center gap-2">
                                  <GraduationCap size={16} className="text-orange-500" />
                                  {(item as any).schedule}
                                </span>
                              ) : null
                            )}

                            <span className="flex items-center gap-2">
                              <Users size={16} className="text-slate-500" />
                              {item.participants.length} apuntats/des
                            </span>
                          </div>

                          {/* Llista de noms (visible per tothom dins) */}
                          {item.participants.length > 0 && (
                            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">
                                Apuntats/des
                              </p>
                              <ul className="space-y-1">
                                {item.participants.map((uid) => (
                                  <li key={uid} className="text-sm text-gray-700">
                                    • {nameFromId(uid)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
