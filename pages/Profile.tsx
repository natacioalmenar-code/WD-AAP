import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { FECDAS_LEVELS, type FecdAsLevel } from "../types";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const Profile: React.FC = () => {
  const { currentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || "");
  const [certification, setCertification] = useState(currentUser?.certification || "");
  const [level, setLevel] = useState<FecdAsLevel>(
    (currentUser?.level as FecdAsLevel) || "B1E"
  );
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

  const save = async () => {
    if (!canEdit) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("El nom no pot estar buit.");
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", currentUser.id), {
        name: trimmedName,
        avatarUrl: avatarUrl.trim(),
        certification: certification.trim(),
        level,
        updatedAt: serverTimestamp(),
      });
      alert("Perfil actualitzat ✅");
    } catch (e) {
      alert("No s’ha pogut guardar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-extrabold text-slate-900">El meu perfil</h1>
          <p className="text-sm text-gray-600 mt-1">
            Actualitza la teua informació personal.
          </p>
        </div>

        <div className="p-6 space-y-5">
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
            <label className="text-sm font-bold text-slate-700">Certificació</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
              placeholder="Ex: FEDAS/CMAS, PADI, SSI..."
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Nivell</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={level}
              onChange={(e) => setLevel(e.target.value as FecdAsLevel)}
            >
              {FECDAS_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Si el teu rol és <b>admin</b> o <b>instructor</b>, el rol mana igualment.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className={`px-5 py-2 rounded-xl font-extrabold ${
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
