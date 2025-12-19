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

function safeDateKey(d: string) {
  return typeof d === "string" && d.trim() ? d.trim() : "9999-12-31";
}

function todayKey() {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addMonths(base: Date, delta: number) {
  return new Date(base.getFullYear(), base.getMonth() + delta, 1);
}

function formatMonthTitle(dt: Date) {
  return dt.toLocaleDateString("ca-ES", { month: "long", year: "numeric" });
}

function formatDayHeaderLabel(dt: Date) {
  return dt.toLocaleDateString("ca-ES", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function isoFromYMD(y: number, m: number, d: number) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

const TypeDot: React.FC<{ type: ItemType }> = ({ type }) => {
  const cls =
    type === "trip"
      ? "bg-yellow-400"
      : type === "course"
      ? "bg-indigo-500"
      : "bg-emerald-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${cls}`} />;
};

const TypePill: React.FC<{ type: ItemType }> = ({ type }) => {
  const cfg =
    type === "trip"
      ? { label: "SORTIDA", cls: "bg-slate-900 text-yellow-300" }
      : type === "course"
      ? { label: "CURS", cls: "bg-indigo-900 text-indigo-100" }
      : { label: "ESDEV.", cls: "bg-emerald-900 text-emerald-100" };

  return <span className={`inline-flex items-center text-[11px] font-black px-3 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>;
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

export const CalendarPage: React.FC = () => {
  const { currentUser, trips, courses, socialEvents, canManageTrips, canManageSystem } = useApp();

  const [q, setQ] = useState("");
  const [showTrips, setShowTrips] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showPast, setShowPast] = useState(false);

  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey());

  const canSeeDrafts = useMemo(() => {
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
    const nowKey = todayKey();

    return items.filter((it) => {
      if (!showTrips && it.type === "trip") return false;
      if (!showCourses && it.type === "course") return false;
      if (!showEvents && it.type === "event") return false;

      if (!canSeeDrafts && !it.published) return false;

      if (!showPast && safeDateKey(it.date) < nowKey) return false;

      if (!needle) return true;
      const hay = `${it.title} ${it.location || ""} ${it.subtitle || ""} ${it.date || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, q, showTrips, showCourses, showEvents, showPast, canSeeDrafts]);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    filtered.forEach((it) => {
      const key = safeDateKey(it.date);
      const arr = map.get(key) || [];
      arr.push(it);
      map.set(key, arr);
    });

    // ordena dins del mateix dia
    map.forEach((arr, key) => {
      arr.sort((a, b) => {
        const order = (x: ItemType) => (x === "trip" ? 1 : x === "course" ? 2 : 3);
        const d = order(a.type) - order(b.type);
        if (d !== 0) return d;
        return (a.title || "").localeCompare(b.title || "");
      });
      map.set(key, arr);
    });

    return map;
  }, [filtered]);

  // Mes actual (segons offset)
  const monthDate = useMemo(() => addMonths(new Date(new Date().getFullYear(), new Date().getMonth(), 1), monthOffset), [monthOffset]);

  // Graella del mes (6 setmanes x 7 dies)
  const calendarCells = useMemo(() => {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth(); // 0-11
    const firstOfMonth = new Date(y, m, 1);

    // A Catalunya volem que la setmana comenci Dilluns:
    // JS: getDay() = 0 diumenge ... 6 dissabte
    // Volem index dilluns=0 ... diumenge=6
    const jsDay = firstOfMonth.getDay();
    const mondayIndex = (jsDay + 6) % 7;

    const start = new Date(y, m, 1 - mondayIndex); // dilluns de la primera setmana visible
    const cells: { date: Date; iso: string; inMonth: boolean }[] = [];

    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const iso = isoFromYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
      cells.push({ date: d, iso, inMonth: d.getMonth() === m });
    }
    return cells;
  }, [monthDate]);

  const selectedItems = useMemo(() => {
    return (byDate.get(selectedDate) || []).slice();
  }, [byDate, selectedDate]);

  // Si no hi ha usuari -> res
  if (!currentUser) return null;

  const monthTitle = formatMonthTitle(monthDate);
  const today = todayKey();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <PageHero
        compact
        title="Calendari del Club"
        subtitle="Vista mensual — ràpid i visual."
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

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* FILTRES */}
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

        {/* CALENDARI + DETALL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GRAELLA */}
          <div className="lg:col-span-2 rounded-3xl border bg-white/70 backdrop-blur shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-white/40 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-500">MES</div>
                <div className="mt-1 text-lg font-black text-slate-900 capitalize">{monthTitle}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMonthOffset((v) => v - 1)}
                  className="px-4 py-2 rounded-2xl font-black border bg-white hover:bg-slate-50"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    setMonthOffset(0);
                    setSelectedDate(todayKey());
                  }}
                  className="px-4 py-2 rounded-2xl font-black border bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  Avui
                </button>
                <button
                  onClick={() => setMonthOffset((v) => v + 1)}
                  className="px-4 py-2 rounded-2xl font-black border bg-white hover:bg-slate-50"
                >
                  →
                </button>
              </div>
            </div>

            {/* Headers setmana */}
            <div className="grid grid-cols-7 gap-px bg-slate-200">
              {["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"].map((w) => (
                <div key={w} className="bg-white/60 px-3 py-2 text-xs font-black text-slate-600">
                  {w}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-px bg-slate-200">
              {calendarCells.map((cell) => {
                const dayItems = byDate.get(cell.iso) || [];
                const isSelected = cell.iso === selectedDate;
                const isToday = cell.iso === today;

                const inMonthCls = cell.inMonth ? "bg-white/70" : "bg-slate-50/70";
                const selectedCls = isSelected ? "ring-2 ring-yellow-400" : "";
                const todayCls = isToday ? "border-yellow-400" : "border-transparent";

                // compta per tipus (per mostrar punts)
                const hasTrip = dayItems.some((x) => x.type === "trip");
                const hasCourse = dayItems.some((x) => x.type === "course");
                const hasEvent = dayItems.some((x) => x.type === "event");

                return (
                  <button
                    key={cell.iso}
                    onClick={() => setSelectedDate(cell.iso)}
                    className={`text-left p-3 min-h-[92px] border ${todayCls} ${inMonthCls} hover:bg-white transition ${selectedCls}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-black ${cell.inMonth ? "text-slate-900" : "text-slate-400"}`}>
                        {cell.date.getDate()}
                      </div>

                      {dayItems.length > 0 ? (
                        <span className="text-xs font-black px-2 py-1 rounded-full bg-slate-900 text-white">
                          {dayItems.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {hasTrip ? <TypeDot type="trip" /> : null}
                      {hasCourse ? <TypeDot type="course" /> : null}
                      {hasEvent ? <TypeDot type="event" /> : null}
                      {dayItems.length === 0 ? <span className="text-xs text-slate-400">—</span> : null}
                    </div>

                    {/* preview 1 item */}
                    {dayItems.length > 0 ? (
                      <div className="mt-2 text-xs font-bold text-slate-700 line-clamp-2">
                        {dayItems[0].title}
                        {dayItems.length > 1 ? "…" : ""}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t bg-white/40 text-xs text-slate-600 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <TypeDot type="trip" /> <span className="font-bold">Sortides</span>
              </div>
              <div className="flex items-center gap-2">
                <TypeDot type="course" /> <span className="font-bold">Cursos</span>
              </div>
              <div className="flex items-center gap-2">
                <TypeDot type="event" /> <span className="font-bold">Esdeveniments</span>
              </div>
            </div>
          </div>

          {/* DETALL DIA */}
          <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-white/40">
              <div className="text-xs font-black text-slate-500">DIA SELECCIONAT</div>
              <div className="mt-1 text-lg font-black text-slate-900 capitalize">
                {formatDayHeaderLabel(new Date(Number(selectedDate.slice(0, 4)), Number(selectedDate.slice(5, 7)) - 1, Number(selectedDate.slice(8, 10))))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedItems.length === 0 ? (
                <div className="rounded-2xl border bg-white/60 p-5 text-slate-600 text-center">
                  No hi ha elements aquest dia amb els filtres actuals.
                </div>
              ) : (
                selectedItems.map((it) => (
                  <div key={`${it.type}-${it.id}`} className="rounded-3xl border bg-white/60 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <TypePill type={it.type} />
                      <StatusPill published={it.published} status={it.status} canSeeDrafts={canSeeDrafts} />
                    </div>

                    <div className="mt-3 text-base font-black text-slate-900 break-words">{it.title}</div>

                    <div className="mt-2 text-sm text-slate-600">
                      {it.time ? <span className="font-bold">{it.time}</span> : null}
                      {it.time && (it.location || it.subtitle) ? " · " : null}
                      {it.location ? it.location : null}
                      {it.location && it.subtitle ? " · " : null}
                      {it.subtitle ? it.subtitle : null}
                    </div>

                    {it.status === "cancelled" ? (
                      <div className="mt-4 text-xs font-black text-red-700 bg-red-50 border border-red-200 rounded-2xl px-3 py-2">
                        Aquest element està cancel·lat.
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4 border-t bg-white/40 text-xs text-slate-500">
              Nota: els socis/es veuen només <b>publicats</b>. Admin/instructors poden veure també <b>ocults</b> per revisar-los.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
