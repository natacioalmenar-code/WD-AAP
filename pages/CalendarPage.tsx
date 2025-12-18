import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { PageHero } from "../components/PageHero";

type ItemType = "trip" | "course" | "event";

type CalendarItem = {
  id: string;
  type: ItemType;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  location?: string;
  subtitle?: string;
  published: boolean;
  status?: string; // active | cancelled
};

const TypePill: React.FC<{ type: ItemType }> = ({ type }) => {
  const cfg =
    type === "trip"
      ? { label: "SORTIDA", cls: "bg-slate-900 text-yellow-300" }
      : type === "course"
      ? { label: "CURS", cls: "bg-indigo-900 text-indigo-100" }
      : { label: "ESDEVENIMENT", cls: "bg-emerald-900 text-emerald-100" };

  return (
    <span className={`inline-flex items-center text-[11px] font-black px-3 py-1 rounded-full ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const StatusPill: React.FC<{ published: boolean; status?: string; canSeeDrafts: boolean }> = ({
  published,
  status,
  canSeeDrafts,
}) => {
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center text-[11px] font-black px-3 py-1 rounded-full border bg-red-50 border-red-200 text-red-800">
        CANCEL·LAT
      </span>
    );
  }

  if (!published && canSeeDrafts) {
    return (
      <span className="inline-flex items-center text-[11px] font-black px-3 py-1 rounded-full border bg-slate-50 border-slate-200 text-slate-700">
        OCULT
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-[11px] font-black px-3 py-1 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-900">
      PUBLICAT
    </span>
  );
};

function formatDayLabel(isoDate: string) {
  // isoDate: YYYY-MM-DD
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map((x) => Number(x));
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("ca-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function safeDateKey(d: string) {
  // Ensure we can sort even if empty
  return typeof d === "string" && d.trim() ? d.trim() : "9999-12-31";
}

export const Calendar: React.FC = () => {
  const { currentUser, trips, courses, socialEvents, canManageTrips, canManageSystem } = useApp();

  const [q, setQ] = useState("");
  const [showTrips, setShowTrips] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showPast, setShowPast] = useState(false);

  const canSeeDrafts = useMemo(() => {
    // Admin i instructor (canManageTrips) poden veure ocults
    return (canManageSystem?.() ?? false) || (canManageTrips?.() ?? false);
  }, [canManageSystem, canManageTrips]);

  const items = useMemo<CalendarItem[]>(() => {
    const list: CalendarItem[] = [];

    (trips || []).forEach((t: any) => {
      list.push({
        id: t.id,
        type: "trip",
        title: t.title || "Sortida",
        date: t.date || "",
        location: t.location || "",
        subtitle: t.levelRequired ? `Nivell: ${t.levelRequired}` : "",
        published: !!t.published,
        status: t.status || "active",
      });
    });

    (courses || []).forEach((c: any) => {
      list.push({
        id: c.id,
        type: "course",
        title: c.title || "Curs",
        date: c.date || "",
        location: "",
        subtitle: [c.schedule ? `Horari: ${c.schedule}` : "", c.levelRequired ? `Nivell: ${c.levelRequired}` : ""]
          .filter(Boolean)
          .join(" · "),
        published: !!c.published,
        status: c.status || "active",
      });
    });

    (socialEvents || []).forEach((e: any) => {
      list.push({
        id: e.id,
        type: "event",
        title: e.title || "Esdeveniment",
        date: e.date || "",
        time: e.time || "",
        location: e.location || "",
        subtitle: e.notes ? String(e.notes).slice(0, 140) : "",
        published: !!e.published,
        status: e.status || "active",
      });
    });

    return list;
  }, [trips, courses, socialEvents]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const nowKey = (() => {
      const dt = new Date();
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const d = String(dt.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    })();

    return items
      .filter((it) => {
        if (!showTrips && it.type === "trip") return false;
        if (!showCourses && it.type === "course") return false;
        if (!showEvents && it.type === "event") return false;

        // Socis/es: només publicats (i no cancel·lats si vols amagar-los; jo els mostre però marcats)
        if (!canSeeDrafts && !it.published) return false;

        // Past
        if (!showPast && safeDateKey(it.date) < nowKey) return false;

        if (!needle) return true;
        const hay = `${it.title} ${it.location || ""} ${it.subtitle || ""} ${it.date || ""}`.toLowerCase();
        return hay.includes(needle);
      })
      .sort((a, b) => safeDateKey(a.date).localeCompare(safeDateKey(b.date)));
  }, [items, q, showTrips, showCourses, showEvents, showPast, canSeeDrafts]);

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    filtered.forEach((it) => {
      const key = safeDateKey(it.date);
      const arr = map.get(key) || [];
      arr.push(it);
      map.set(key, arr);
    });

    // Order keys
    const keys = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
    return keys.map((k) => ({
      date: k,
      label: formatDayLabel(k),
      items: (map.get(k) || []).sort((a, b) => {
        // sort within day: by type then title
        const order = (x: ItemType) => (x === "trip" ? 1 : x === "course" ? 2 : 3);
        const d = order(a.type) - order(b.type);
        if (d !== 0) return d;
        return (a.title || "").localeCompare(b.title || "");
      }),
    }));
  }, [filtered]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <PageHero
        compact
        title="Calendari del Club"
        subtitle="Sortides, cursos i esdeveniments — tot en un mateix lloc."
        badge={
          <span>
            {canSeeDrafts ? (
              <>
                Mode gestió · Mostrant també <b>ocults</b>
              </>
            ) : (
              <>
                Mode soci/a · Mostrant <b>publicats</b>
              </>
            )}
          </span>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Controls premium */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-500">FILTRES</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowTrips((v) => !v)}
                  className={`px-4 py-2 rounded-2xl font-black text-sm border ${
                    showTrips ? "bg-slate-900 text-yellow-300 border-slate-900" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  Sortides
                </button>
                <button
                  onClick={() => setShowCourses((v) => !v)}
                  className={`px-4 py-2 rounded-2xl font-black text-sm border ${
                    showCourses ? "bg-indigo-900 text-indigo-100 border-indigo-900" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  Cursos
                </button>
                <button
                  onClick={() => setShowEvents((v) => !v)}
                  className={`px-4 py-2 rounded-2xl font-black text-sm border ${
                    showEvents ? "bg-emerald-900 text-emerald-100 border-emerald-900" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  Esdeveniments
                </button>

                <button
                  onClick={() => setShowPast((v) => !v)}
                  className={`px-4 py-2 rounded-2xl font-black text-sm border ${
                    showPast ? "bg-yellow-400 text-black border-yellow-400" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {showPast ? "Mostrant passats" : "Amagar passats"}
                </button>
              </div>
            </div>

            <div className="w-full lg:w-96">
              <label className="text-sm font-black text-slate-900">Cerca</label>
              <input
                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Títol, ubicació, nivell, data…"
              />
            </div>
          </div>
        </div>

        {/* Calendari en “quadres per dia” */}
        <div className="space-y-5">
          {grouped.length === 0 ? (
            <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-10 text-center text-slate-600">
              No hi ha elements per mostrar amb estos filtres.
            </div>
          ) : (
            grouped.map((day) => (
              <div key={day.date} className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-white/40">
                  <div className="text-xs font-black text-slate-500">DIA</div>
                  <div className="mt-1 text-lg font-black text-slate-900 capitalize">{day.label}</div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {day.items.map((it) => (
                    <div key={`${it.type}-${it.id}`} className="rounded-3xl border bg-white/60 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <TypePill type={it.type} />
                            <StatusPill published={it.published} status={it.status} canSeeDrafts={canSeeDrafts} />
                          </div>

                          <div className="mt-3 text-base font-black text-slate-900 break-words">
                            {it.title}
                          </div>

                          <div className="mt-2 text-sm text-slate-600">
                            {it.time ? <span className="font-bold">{it.time}</span> : null}
                            {it.time && (it.location || it.subtitle) ? " · " : null}
                            {it.location ? it.location : null}
                            {it.location && it.subtitle ? " · " : null}
                            {it.subtitle ? it.subtitle : null}
                          </div>
                        </div>
                      </div>

                      {it.status === "cancelled" ? (
                        <div className="mt-4 text-xs font-black text-red-700 bg-red-50 border border-red-200 rounded-2xl px-3 py-2">
                          Aquest element està cancel·lat.
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-xs text-slate-500">
          Nota: els socis/es veuen el calendari amb elements <b>publicats</b>. L’administració i instructors veuen també
          els <b>ocults</b> per revisar-los.
        </div>
      </div>
    </div>
  );
};
