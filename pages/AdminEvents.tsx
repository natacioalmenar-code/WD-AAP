import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { PlusCircle, CalendarDays, MapPin, Users } from "lucide-react";

type AdminEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  createdBy: string;
  participants: string[];
};

export const AdminEvents: React.FC = () => {
  const { currentUser } = useApp();

  const [events, setEvents] = useState<AdminEvent[]>(() => {
    const raw = localStorage.getItem("westdivers-events-v1");
    return raw ? (JSON.parse(raw) as AdminEvent[]) : [];
  });

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events]
  );

  if (!currentUser) return null;

  const save = (next: AdminEvent[]) => {
    setEvents(next);
    localStorage.setItem("westdivers-events-v1", JSON.stringify(next));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Falta el títol.");
    if (!form.date.trim()) return alert("Falta la data.");
    if (!form.location.trim()) return alert("Falta la ubicació.");
    if (!form.description.trim()) return alert("Falta la descripció.");

    const newEvent: AdminEvent = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      title: form.title.trim(),
      date: form.date.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      createdBy: currentUser.id,
      participants: [],
    };

    save([...events, newEvent]);

    setForm({ title: "", date: "", location: "", description: "" });
    alert("✅ Esdeveniment creat!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
          Gestió Esdeveniments
        </h1>
        <p className="text-gray-600 mt-2">Crea esdeveniments socials del club.</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="text-yellow-500" />
          <h2 className="text-xl font-bold text-slate-900">Crear nou esdeveniment</h2>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-2"
            placeholder="Títol"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="date"
            className="border rounded-lg p-2"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Ubicació"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <textarea
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Descripció"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button
            type="submit"
            className="md:col-span-2 bg-yellow-400 text-black font-extrabold rounded-lg py-3 hover:bg-yellow-300 transition"
          >
            Crear Esdeveniment
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-gray-500 italic">Encara no hi ha esdeveniments creats.</p>
        ) : (
          sorted.map((ev) => (
            <div key={ev.id} className="bg-white rounded-2xl border shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900">{ev.title}</h3>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={16} className="text-yellow-500" /> {ev.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={16} className="text-yellow-500" /> {ev.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={16} className="text-yellow-500" /> {ev.participants.length} apuntats
                </span>
              </div>

              <p className="text-gray-600 mt-3">{ev.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
