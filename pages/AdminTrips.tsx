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
    approveTrip,
    setTripPublished,
    cancelTrip,
    deleteTrip,
  } = useApp();

  const isAdmin = canManageSystem?.() ?? false;

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [levelRequired, setLevelRequired] = useState("B1");
  const [maxSpots, setMaxSpots] = useState<number>(12);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const userName = (uid: string) => users.find((u) => u.id === uid)?.name || uid;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...(trips || [])]
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

  const pending = useMemo(
    () => filtered.filter((t: any) => (t.approvalStatus || "pending") !== "approved"),
    [filtered]
  );

  const approved = useMemo(
    () => filtered.filter((t: any) => (t.approvalStatus || "pending") === "approved"),
    [filtered]
  );

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

    const max = Number(maxSpots);
    if (!Number.isFinite(max) || max < 1) {
      alert("Places màximes ha de ser un número >= 1.");
      return;
    }

    // Firestore NO accepta undefined -> només afegim si tenen valor
    const payload: any = {
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      levelRequired: String(levelRequired || "B1").trim(),
      maxSpots: max,
    };

    const p = price.trim();
    if (p) payload.price = p;

    const n = notes.trim();
    if (n) payload.notes = n;

    try {
      await createTrip(payload);
      resetForm();
      setOpen(false);

      // Si és admin, quedarà aprovada automàticament (segons la teua lògica d’AppContext)
      // Si és instructor, quedarà pendent i l’admin la veurà al bloc "Pendents d’aprovació".
      alert(isAdmin ? "Sortida creada ✅" : "Sortida creada ✅ (pendent d’aprovació)");
    } catch (err: any) {
      console.error("CREATE TRIP ERROR:", err);
      alert(
        "No s'ha pogut crear la sortida.\n" +
          `Detall: ${err?.code || err?.message || "error"}`
      );
    }
  };

  if (!canManageTrips()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-10 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Gestió de Sortides</h1>
          <p className="text-slate-600 mt-2">No tens permisos per gestionar sortides.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-7 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
                SORTIDES
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900">Gestió de Sortides</h1>
              <p className="text-slate-600 mt-1">
                Instructor crea → pendent · Admin aprova → després es pot publicar.
              </p>
            </div>

            <div className="w-full lg:w-[360px] space-y-3">
              <button
                onClick={() => setOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-extrabold bg-yellow-400 text-black hover:bg-yellow-500 shadow"
              >
                <Plus size={18} />
                Crear sortida
              </button>

              <div className="rounded-2xl border bg-white/80 px-4 py-3">
                <label className="text-xs font-black text-slate-600">Cerca ràpida</label>
                <input
                  className="mt-2 w-full rounded-xl border px-3 py-2 bg-white/90 focus:outline-none"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Títol, ubicació o data…"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PENDENTS (només admin) */}
        {isAdmin && (
          <div className="mt-8 rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
            <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
              PENDENTS D’APROVACIÓ
            </div>

            <h2 className="mt-3 text-xl font-extrabold text-slate-900">
              Sortides pendents ({pending.length})
            </h2>

            <div className="mt-5 space-y-3">
              {pending.length === 0 ? (
                <div className="text-sm text-slate-500">Cap pendent.</div>
              ) : (
                pending.map((t) => (
                  <div
                    key={t.id}
                    className="border rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap bg-white/70"
                  >
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 truncate">{t.title}</div>
                      <div className="text-sm text-slate-600">
                        {t.date} · {t.location} · Nivell {t.levelRequired} · Creat per{" "}
                        <b>{userName(t.createdBy)}</b>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        await approveTrip(t.id);
                        alert("Sortida aprovada. Ara la pots publicar.");
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-yellow-300 font-black hover:opacity-90"
                    >
                      Aprovar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* APROVADES */}
        <div className="mt-8 space-y-4">
          {approved.length === 0 ? (
            <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-10 text-center text-slate-500">
              No hi ha sortides aprovades.
            </div>
          ) : (
            approved.map((t) => (
              <TripCard
                key={t.id}
                trip={t}
                userName={userName}
                isAdmin={isAdmin}
                onPublish={(published) => setTripPublished(t.id, published)}
                onCancel={() => cancelTrip(t.id, prompt("Motiu (opcional):") || "")}
                onDelete={() => deleteTrip(t.id)}
              />
            ))
          )}
        </div>

        {/* Modal crear */}
        {open && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-3xl border bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-extrabold text-slate-900">Crear nova sortida</h3>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X />
                </button>
              </div>

              <form onSubmit={submit} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-black text-slate-900">Títol</label>
                  <input
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Sortida a ..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-black text-slate-900">Data</label>
                    <input
                      type="date"
                      className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-black text-slate-900">Places màx.</label>
                    <input
                      type="number"
                      min={1}
                      className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none"
                      value={maxSpots}
                      onChange={(e) => setMaxSpots(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-black text-slate-900">Ubicació</label>
                  <input
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Illes Columbretes"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-black text-slate-900">Nivell requerit</label>
                    <select
                      className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none"
                      value={levelRequired}
                      onChange={(e) => setLevelRequired(e.target.value)}
                    >
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="B3">B3</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-black text-slate-900">Preu (opcional)</label>
                    <input
                      className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 25€ / gratis"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-black text-slate-900">Notes (opcional)</label>
                  <textarea
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/90 focus:outline-none min-h-[120px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalls, material, trobada, etc."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                    className="px-5 py-3 rounded-2xl border font-black hover:bg-gray-50"
                  >
                    Cancel·lar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-slate-900 text-yellow-300 font-black hover:bg-slate-800 shadow"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= CARD ================= */

function TripCard({
  trip,
  userName,
  isAdmin,
  onPublish,
  onCancel,
  onDelete,
}: {
  trip: Trip;
  userName: (uid: string) => string;
  isAdmin: boolean;
  onPublish: (published: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const approved = (trip.participants || []) as string[];
  const isCancelled = trip.status === "cancelled";
  const approvalStatus = (trip as any).approvalStatus || "pending";

  return (
    <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-900">{trip.title}</h2>

            <span
              className={`text-xs font-black px-3 py-1 rounded-full border ${
                approvalStatus === "approved"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-yellow-50 border-yellow-200 text-yellow-900"
              }`}
            >
              {approvalStatus === "approved" ? "APROVADA" : "PENDENT"}
            </span>

            <span
              className={`text-xs font-black px-3 py-1 rounded-full border ${
                isCancelled
                  ? "bg-red-50 border-red-200 text-red-700"
                  : trip.published
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              {isCancelled ? "CANCEL·LADA" : trip.published ? "PUBLICADA" : "OCULTA"}
            </span>
          </div>

          <div className="text-sm text-slate-600 mt-1">
            {trip.date} · {trip.location} · Nivell: {trip.levelRequired} · Places:{" "}
            {approved.length}/{(trip as any).maxSpots ?? "—"} · Creat per{" "}
            <b>{userName(trip.createdBy)}</b>
          </div>

          {isCancelled && (trip as any).cancelledReason ? (
            <div className="mt-2 text-sm text-red-700">
              <span className="font-black">Motiu:</span> {(trip as any).cancelledReason}
            </div>
          ) : null}
        </div>

        {/* Accions: publicar i esborrar només admin */}
        <div className="flex flex-wrap gap-2">
          {isAdmin && !isCancelled && (
            <button
              onClick={() => onPublish(!trip.published)}
              className={`px-4 py-2 rounded-2xl font-black text-sm shadow-sm ${
                trip.published ? "bg-white border hover:bg-slate-50" : "bg-yellow-400 hover:bg-yellow-500"
              }`}
            >
              {trip.published ? "Ocultar" : "Publicar"}
            </button>
          )}

          {!isCancelled && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-2xl font-black text-sm border bg-white hover:bg-slate-50"
            >
              Cancel·lar
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                if (confirm("Segur que vols ESBORRAR definitivament esta sortida?")) onDelete();
              }}
              className="px-4 py-2 rounded-2xl font-black text-sm bg-red-600 text-white hover:bg-red-700 shadow"
            >
              Esborrar
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border bg-white/60 p-4">
        <div className="font-extrabold text-slate-900 mb-2">Participants ({approved.length})</div>

        {approved.length === 0 ? (
          <div className="text-sm text-slate-500">Encara ningú.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {approved.map((uid) => (
              <span
                key={uid}
                className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-yellow-300"
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
