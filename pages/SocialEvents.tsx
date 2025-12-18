import React, { useMemo, useState } from "react";
import { Plus, X, Trash2, Eye, EyeOff, Ban } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageHero } from "../components/PageHero";
import type { SocialEvent } from "../types";

export const SocialEvents: React.FC = () => {
  const {
    currentUser,
    socialEvents,
    canManageSystem,
    createSocialEvent,
    setSocialEventPublished,
    cancelSocialEvent,
    deleteSocialEvent,
  } = useApp();

  const isAdmin = canManageSystem?.() ?? false;

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxSpots, setMaxSpots] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const [msg, setMsg] = useState<string>("");
  const [busy, setBusy] = useState<string>("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...(socialEvents || [])]
      .filter((e) => {
        if (!needle) return true;
        return (
          (e.title || "").toLowerCase().includes(needle) ||
          (e.location || "").toLowerCase().includes(needle) ||
          (e.date || "").includes(needle)
        );
      })
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [socialEvents, q]);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setMaxSpots(0);
    setNotes("");
  };

  const safeAlert = (text: string) => {
    setMsg(text);
    window.setTimeout(() => setMsg(""), 4500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!title.trim() || !date.trim()) {
      safeAlert("Ompli mínim: títol i data.");
      return;
    }

    try {
      setBusy("create");
      await createSocialEvent({
        title: title.trim(),
        date: date.trim(),
        time: time.trim() || undefined,
        location: location.trim() || undefined,
        maxSpots: maxSpots ? Number(maxSpots) : undefined,
        notes: notes.trim() || undefined,
      } as any);

      resetForm();
      setOpen(false);
      safeAlert("Esdeveniment creat ✅ (ara el pots publicar)");
    } catch (err: any) {
      console.error("CREATE SOCIAL EVENT ERROR:", err);
      safeAlert(`Error creant: ${err?.code || err?.message || "desconegut"}`);
    } finally {
      setBusy("");
    }
  };

  const togglePublish = async (eventId: string, next: boolean) => {
    try {
      setBusy(`pub:${eventId}`);
      await setSocialEventPublished(eventId, next);
      safeAlert(next ? "Publicat ✅" : "Ocultat ✅");
    } catch (err: any) {
      console.error("PUBLISH SOCIAL EVENT ERROR:", err);
      safeAlert(`Error publicant: ${err?.code || err?.message || "desconegut"}`);
    } finally {
      setBusy("");
    }
  };

  const doCancel = async (eventId: string) => {
    try {
      const reason = prompt("Motiu de cancel·lació (opcional):") || "";
      setBusy(`cancel:${eventId}`);
      await cancelSocialEvent(eventId, reason);
      safeAlert("Cancel·lat ✅");
    } catch (err: any) {
      console.error("CANCEL SOCIAL EVENT ERROR:", err);
      safeAlert(`Error cancel·lant: ${err?.code || err?.message || "desconegut"}`);
    } finally {
      setBusy("");
    }
  };

  const doDelete = async (eventId: string) => {
    if (!isAdmin) return;

    const ok = confirm("Segur que vols ESBORRAR definitivament este esdeveniment?");
    if (!ok) return;

    try {
      setBusy(`del:${eventId}`);
      await deleteSocialEvent(eventId);
      safeAlert("Esborrat ✅");
    } catch (err: any) {
      console.error("DELETE SOCIAL EVENT ERROR:", err);
      safeAlert(`Error esborrant: ${err?.code || err?.message || "desconegut"}`);
    } finally {
      setBusy("");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <PageHero
        compact
        title={isAdmin ? "Esdeveniments (Admin)" : "Esdeveniments"}
        subtitle={
          isAdmin
            ? "Crea, publica, cancel·la i esborra esdeveniments socials."
            : "Consulta les properes activitats del club."
        }
        badge={
          <span>
            Rol: <b>{currentUser.role}</b> · Estat: <b>{currentUser.status}</b>
          </span>
        }
        right={
          isAdmin ? (
            <button
              onClick={() => setOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-yellow-400 text-black font-black hover:bg-yellow-500 shadow"
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={18} /> Crear
              </span>
            </button>
          ) : undefined
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {msg ? (
          <div className="mb-5 rounded-2xl border bg-slate-900 text-yellow-300 px-4 py-3 text-sm font-black">
            {msg}
          </div>
        ) : null}

        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-xs font-black text-slate-500">LLISTA</div>
              <div className="text-2xl font-black text-slate-900">Esdeveniments</div>
              <div className="text-sm text-slate-600 mt-1">
                {isAdmin ? "Gestiona visibilitat i control total." : "Només veus els publicats."}
              </div>
            </div>

            <div className="w-full md:w-80">
              <label className="text-sm font-black text-slate-900">Cerca</label>
              <input
                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Títol, ubicació o data…"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {list.length === 0 ? (
              <div className="rounded-2xl border bg-white/60 p-8 text-center text-slate-600">
                No hi ha esdeveniments.
              </div>
            ) : (
              list
                .filter((e) => (isAdmin ? true : !!e.published))
                .map((e) => {
                  const isCancelled = e.status === "cancelled";
                  const tag =
                    isCancelled ? "CANCEL·LAT" : e.published ? "PUBLICAT" : "OCULT";

                  return (
                    <div key={e.id} className="rounded-3xl border bg-white/60 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="text-lg font-black text-slate-900">{e.title}</div>
                            <span
                              className={`text-xs font-black px-3 py-1 rounded-full border ${
                                isCancelled
                                  ? "bg-red-50 border-red-200 text-red-800"
                                  : e.published
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "bg-slate-50 border-slate-200 text-slate-700"
                              }`}
                            >
                              {tag}
                            </span>
                          </div>

                          <div className="text-sm text-slate-600 mt-2">
                            <b>{e.date}</b>
                            {e.time ? ` · ${e.time}` : ""}
                            {e.location ? ` · ${e.location}` : ""}
                            {typeof e.maxSpots === "number" && e.maxSpots > 0
                              ? ` · Places: ${e.maxSpots}`
                              : ""}
                          </div>

                          {isCancelled && (e as any).cancelledReason ? (
                            <div className="mt-3 text-sm text-red-700">
                              <b>Motiu:</b> {(e as any).cancelledReason}
                            </div>
                          ) : null}

                          {e.notes ? (
                            <div className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">
                              {e.notes}
                            </div>
                          ) : null}
                        </div>

                        {isAdmin ? (
                          <div className="flex flex-wrap gap-2">
                            {!isCancelled && (
                              <button
                                disabled={busy === `pub:${e.id}`}
                                onClick={() => togglePublish(e.id, !e.published)}
                                className={`px-4 py-2 rounded-2xl font-black text-sm shadow-sm ${
                                  e.published
                                    ? "bg-white border hover:bg-slate-50"
                                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                                }`}
                              >
                                <span className="inline-flex items-center gap-2">
                                  {e.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                  {e.published ? "Ocultar" : "Publicar"}
                                </span>
                              </button>
                            )}

                            {!isCancelled && (
                              <button
                                disabled={busy === `cancel:${e.id}`}
                                onClick={() => doCancel(e.id)}
                                className="px-4 py-2 rounded-2xl font-black text-sm border bg-white hover:bg-slate-50"
                              >
                                <span className="inline-flex items-center gap-2">
                                  <Ban size={16} /> Cancel·lar
                                </span>
                              </button>
                            )}

                            <button
                              disabled={busy === `del:${e.id}`}
                              onClick={() => doDelete(e.id)}
                              className="px-4 py-2 rounded-2xl font-black text-sm bg-red-600 text-white hover:bg-red-700"
                            >
                              <span className="inline-flex items-center gap-2">
                                <Trash2 size={16} /> Esborrar
                              </span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {open && isAdmin ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl border bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <div className="text-xs font-black text-slate-500">NOU</div>
                <div className="text-lg font-black text-slate-900">Crear esdeveniment</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100"
                aria-label="Tancar"
              >
                <X />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-black text-slate-900">Títol</label>
                <input
                  className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Sopar de club / Xarrada de seguretat…"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-black text-slate-900">Data</label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-900">Hora (opcional)</label>
                  <input
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="20:00"
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-900">Places (opcional)</label>
                  <input
                    type="number"
                    min={0}
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                    value={maxSpots}
                    onChange={(e) => setMaxSpots(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-900">Ubicació (opcional)</label>
                <input
                  className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Local del club / Restaurant…"
                />
              </div>

              <div>
                <label className="text-sm font-black text-slate-900">Notes (opcional)</label>
                <textarea
                  className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none min-h-[120px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalls, preu, què portar, etc."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                  }}
                  className="px-5 py-2 rounded-2xl border font-black bg-white hover:bg-slate-50"
                >
                  Cancel·lar
                </button>

                <button
                  type="submit"
                  disabled={busy === "create"}
                  className={`px-5 py-2 rounded-2xl font-black shadow ${
                    busy === "create"
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 text-yellow-300 hover:bg-slate-800"
                  }`}
                >
                  {busy === "create" ? "Creant..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};
