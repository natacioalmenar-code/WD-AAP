import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { FECDAS_LEVELS, FECDAS_SPECIALTIES, type FecdAsLevel } from "../types";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { BadgeCheck, Star, Plus, X } from "lucide-react";

function uniqueStrings(list: string[]) {
  return Array.from(new Set(list.map((x) => x.trim()).filter(Boolean)));
}

function rankLevel(level: string): number {
  // Ordre de “nivell principal” (el més alt que marque)
  const order: string[] = ["B1E", "B2E", "B3E", "GG", "IN1E", "IN2E", "IN3E"];
  const idx = order.indexOf(level);
  return idx === -1 ? -1 : idx;
}

function computePrimaryLevel(levels: FecdAsLevel[]) {
  const filtered = levels.filter((l) => l !== "PENDENT");
  if (!filtered.length) return "B1E";
  return filtered.sort((a, b) => rankLevel(b) - rankLevel(a))[0] || "B1E";
}

export const Profile: React.FC = () => {
  const { currentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || "");
  const [certification, setCertification] = useState(currentUser?.certification || "");

  // ✅ Nivells: si ja té levels, usem això. Si no, fem fallback a level.
  const initialLevels: FecdAsLevel[] = useMemo(() => {
    const fromArray = (currentUser?.levels || []).filter(Boolean) as FecdAsLevel[];
    if (fromArray.length) return uniqueStrings(fromArray) as FecdAsLevel[];

    const single = (currentUser?.level || "B1E") as string;
    if (FECDAS_LEVELS.includes(single as FecdAsLevel)) return [single as FecdAsLevel];

    return ["B1E"];
  }, [currentUser]);

  const [levels, setLevels] = useState<FecdAsLevel[]>(initialLevels);

  // ✅ Especialitats
  const initialSpecialties: string[] = useMemo(() => {
    const arr = (currentUser?.specialties || []).filter(Boolean) as string[];
    return uniqueStrings(arr);
  }, [currentUser]);

  const [specialties, setSpecialties] = useState<string[]>(initialSpecialties);
  const [customSpecialty, setCustomSpecialty] = useState("");

  const [saving, setSaving] = useState(false);

  const canEdit = useMemo(() => !!currentUser, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-gray-700">Has d’iniciar sessió per veure el perfil.</p>
        </div>
      </div>
    );
  }

  const toggleLevel = (lvl: FecdAsLevel) => {
    setLevels((prev) => {
      const has = prev.includes(lvl);
      const next = has ? prev.filter((x) => x !== lvl) : [...prev, lvl];

      // Evitem quedar-nos a 0 (mínim 1)
      if (next.length === 0) return ["B1E"];
      return next;
    });
  };

  const toggleSpecialty = (sp: string) => {
    setSpecialties((prev) => {
      const has = prev.includes(sp);
      return has ? prev.filter((x) => x !== sp) : [...prev, sp];
    });
  };

  const addCustomSpecialty = () => {
    const t = customSpecialty.trim();
    if (!t) return;
    setSpecialties((prev) => uniqueStrings([...prev, t]));
    setCustomSpecialty("");
  };

  const removeSpecialty = (sp: string) => {
    setSpecialties((prev) => prev.filter((x) => x !== sp));
  };

  const save = async () => {
    if (!canEdit) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("El nom no pot estar buit.");
      return;
    }

    const cleanLevels = uniqueStrings(levels) as FecdAsLevel[];
    const cleanSpecialties = uniqueStrings(specialties);

    // ✅ mantenim camp “level” antic com a “principal” (el més alt seleccionat)
    const primary = computePrimaryLevel(cleanLevels);

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", currentUser.id), {
        name: trimmedName,
        avatarUrl: avatarUrl.trim(),
        certification: certification.trim(),

        // antic + nou
        level: primary,
        levels: cleanLevels,
        specialties: cleanSpecialties,

        updatedAt: serverTimestamp(),
      });
      alert("Perfil actualitzat ✅");
    } catch {
      alert("No s’ha pogut guardar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const allLevels = FECDAS_LEVELS.filter((l) => l !== "PENDENT");
  const allSpecialties = FECDAS_SPECIALTIES;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-extrabold text-slate-900">El meu perfil</h1>
          <p className="text-sm text-gray-600 mt-1">
            Actualitza la teua informació i les teues titulacions/especialitats.
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Dades personals */}
          <section className="space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl || currentUser.avatarUrl || "/avatar-default.png"}
                alt="avatar"
                className="w-16 h-16 rounded-full border object-cover"
              />
              <div className="flex-1">
                <label className="text-sm font-bold text-slate-700">Avatar URL</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  (Opcional) URL d’una imatge pública.
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Nom i cognoms</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Certificació (opcional)</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="Ex: FECDAS/CMAS, PADI, SSI..."
              />
            </div>
          </section>

          {/* Titulacions */}
          <section className="bg-gray-50 border rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-green-700" />
              <h2 className="text-lg font-extrabold text-slate-900">Titulacions (nivells)</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Marca tots els nivells que tens. (El sistema guarda també un nivell principal automàtic.)
            </p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allLevels.map((lvl) => {
                const checked = levels.includes(lvl);
                return (
                  <label
                    key={lvl}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      checked ? "bg-white border-black" : "bg-white/60 hover:bg-white border-gray-200"
                    }`}
                  >
                    <span className="font-extrabold text-slate-900">{lvl}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLevel(lvl)}
                      className="h-5 w-5"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-gray-600">
              Nivell principal guardat:{" "}
              <span className="font-extrabold text-slate-900">
                {computePrimaryLevel(levels)}
              </span>
            </div>
          </section>

          {/* Especialitats */}
          <section className="bg-gray-50 border rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Especialitats</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Marca les especialitats que tens. Si no està a la llista, pots afegir-la.
            </p>

            {/* Selecció */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allSpecialties.map((sp) => {
                const checked = specialties.includes(sp);
                return (
                  <label
                    key={sp}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      checked ? "bg-white border-black" : "bg-white/60 hover:bg-white border-gray-200"
                    }`}
                  >
                    <span className="font-bold text-slate-900">{sp}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSpecialty(sp)}
                      className="h-5 w-5"
                    />
                  </label>
                );
              })}
            </div>

            {/* Afegir manual */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                className="w-full rounded-xl border px-3 py-2"
                placeholder="Afegir especialitat (manual) ex: Apnea, Scooter, etc."
                value={customSpecialty}
                onChange={(e) => setCustomSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addCustomSpecialty();
                }}
              />
              <button
                onClick={addCustomSpecialty}
                className="px-4 py-2 rounded-xl bg-black text-white font-extrabold hover:bg-gray-900 inline-flex items-center gap-2"
              >
                <Plus size={18} /> Afegir
              </button>
            </div>

            {/* Resum seleccionades */}
            {specialties.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-extrabold text-slate-900 mb-2">
                  Especialitats seleccionades:
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((sp) => (
                    <span
                      key={sp}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border text-sm font-bold text-slate-800"
                    >
                      {sp}
                      <button
                        onClick={() => removeSpecialty(sp)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Eliminar"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Guardar */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl font-extrabold ${
                saving
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {saving ? "Guardant..." : "Guardar canvis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
