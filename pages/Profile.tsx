import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Camera, Save, ShieldCheck, GraduationCap, KeyRound, FileText, Plus, Trash2 } from "lucide-react";

type Tab = "personal" | "docs" | "certs" | "password";

const LEVELS = ["B1E", "B2E", "B3E", "GG", "IN1E", "IN2E", "IN3E"] as const;

export const Profile: React.FC = () => {
  const { currentUser, users, logout } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  // Guard: sense user, fora
  if (!currentUser) return null;

  // --- LocalStorage per dades extra del perfil (per no tocar encara AppContext)
  // Clau per usuari/a
  const EXTRA_KEY = useMemo(() => `wd-profile-extra-${currentUser.id}`, [currentUser.id]);

  type ExtraProfile = {
    avatarUrl?: string; // URL opcional
    phone?: string;
    birthDate?: string;
    address?: string;

    // documents (text lliure per ara)
    licenseInsurance?: string; // Llicència / assegurança
    medicalCertificate?: string; // Certificat mèdic
    highestCertificationDoc?: string; // Titulació més elevada (doc o text)

    // titulacions
    level?: string; // nivell del club (B1E..)
    specialties?: string[]; // especialitzacions FECDAS/CMAS
    otherCertifications?: string; // text lliure

    // password (simulada)
    password?: string;
  };

  const [extra, setExtra] = useState<ExtraProfile>({
    avatarUrl: currentUser.avatarUrl || "",
    level: currentUser.level || "B1E",
    specialties: [],
    otherCertifications: "",
    licenseInsurance: "",
    medicalCertificate: "",
    highestCertificationDoc: "",
    phone: "",
    birthDate: "",
    address: "",
    password: "",
  });

  // Inputs auxiliars
  const [newSpecialty, setNewSpecialty] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  // carregar extra
  useEffect(() => {
    const raw = localStorage.getItem(EXTRA_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ExtraProfile;
      setExtra((prev) => ({
        ...prev,
        ...parsed,
        // assegurem arrays
        specialties: Array.isArray(parsed.specialties) ? parsed.specialties : prev.specialties,
      }));
    } catch {
      // ignorem
    }
  }, [EXTRA_KEY]);

  // guardar extra
  const saveExtra = (next: ExtraProfile) => {
    setExtra(next);
    localStorage.setItem(EXTRA_KEY, JSON.stringify(next));
  };

  const roleLabel =
    currentUser.role === "admin"
      ? "Administració"
      : currentUser.role === "instructor"
      ? "Instructor/a"
      : "Soci/a";

  const email = currentUser.email || "";
  const name = currentUser.name || "";

  // avatar: si no hi ha URL, no mostrem cap foto aleatòria
  const avatarToShow = extra.avatarUrl?.trim() ? extra.avatarUrl.trim() : "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {avatarToShow ? (
            <img
              src={avatarToShow}
              alt="Foto de perfil"
              className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-md bg-slate-100 flex items-center justify-center text-slate-400 font-extrabold">
              {name?.slice(0, 1)?.toUpperCase() || "W"}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900">{name}</h1>
          <p className="text-gray-500 mt-1">{email}</p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
            <span className="bg-slate-900 text-yellow-400 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
              {roleLabel}
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
              Nivell: {extra.level || currentUser.level || "—"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold hover:bg-slate-800"
            title="Tancar sessió"
          >
            Sortir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-8">
        {[
          { key: "personal", label: "Dades personals" },
          { key: "docs", label: "Documents" },
          { key: "certs", label: "Titulacions" },
          { key: "password", label: "Contrasenya" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as Tab)}
            className={`px-6 py-3 font-extrabold text-sm uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
              activeTab === (t.key as Tab)
                ? "border-yellow-400 text-slate-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="animate-fade-in">
        {/* 1) DADES PERSONALS */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} /> Perfil
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Nom i cognoms
                  </label>
                  <input
                    value={name}
                    disabled
                    className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    (Ara mateix el nom es canvia des del registre. Si vols, després afegim “editar nom”.)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Correu electrònic
                  </label>
                  <input
                    value={email}
                    disabled
                    className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Telèfon (opcional)
                  </label>
                  <input
                    value={extra.phone || ""}
                    onChange={(e) => saveExtra({ ...extra, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="+34 ..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                      Data naixement (opcional)
                    </label>
                    <input
                      type="date"
                      value={extra.birthDate || ""}
                      onChange={(e) => saveExtra({ ...extra, birthDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                      Adreça (opcional)
                    </label>
                    <input
                      value={extra.address || ""}
                      onChange={(e) => saveExtra({ ...extra, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Població, zona..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Camera size={18} /> Foto de perfil
              </h3>

              <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                URL de la foto (opcional)
              </label>
              <input
                value={extra.avatarUrl || ""}
                onChange={(e) => saveExtra({ ...extra, avatarUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-400 mt-2">
                Si ho deixes buit, no es mostrarà cap imatge aleatòria.
              </p>

              <div className="mt-4">
                <button
                  onClick={() => saveExtra({ ...extra, avatarUrl: (extra.avatarUrl || "").trim() })}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-black font-extrabold hover:bg-yellow-300"
                >
                  <Save size={16} /> Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2) DOCUMENTS */}
        {activeTab === "docs" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} /> Documents
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Llicència / Assegurança (text lliure)
                  </label>
                  <textarea
                    value={extra.licenseInsurance || ""}
                    onChange={(e) => saveExtra({ ...extra, licenseInsurance: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 min-h-[90px]"
                    placeholder="Ex: Llicència FECDAS 2026, assegurança DAN, núm pòlissa..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Certificat mèdic (text lliure)
                  </label>
                  <textarea
                    value={extra.medicalCertificate || ""}
                    onChange={(e) => saveExtra({ ...extra, medicalCertificate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 min-h-[90px]"
                    placeholder="Ex: vigent fins 2026-05-01..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Titulació més elevada (text lliure)
                  </label>
                  <textarea
                    value={extra.highestCertificationDoc || ""}
                    onChange={(e) =>
                      saveExtra({ ...extra, highestCertificationDoc: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 min-h-[90px]"
                    placeholder="Ex: B3E / IN1E / altres..."
                  />
                </div>

                <button
                  onClick={() => saveExtra({ ...extra })}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold hover:bg-slate-800"
                >
                  <Save size={16} /> Guardar documents
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-extrabold text-slate-900 mb-2">
                Nota important
              </h3>
              <p className="text-sm text-gray-700">
                Ara mateix aquests documents es guarden al navegador (localStorage).  
                Més endavant, quan passem a Firebase/Supabase, els podrem pujar com fitxers.
              </p>
            </div>
          </div>
        )}

        {/* 3) TITULACIONS */}
        {activeTab === "certs" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Levels */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap size={18} /> Nivell (FECDAS/CMAS)
              </h3>

              <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                Selecciona el teu nivell
              </label>
              <select
                value={extra.level || "B1E"}
                onChange={(e) => saveExtra({ ...extra, level: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-400 mt-2">
                Si algú no té FECDAS/CMAS, pot deixar això al nivell més proper i posar els detalls a “Altres titulacions”.
              </p>

              <button
                onClick={() => saveExtra({ ...extra })}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-black font-extrabold hover:bg-yellow-300"
              >
                <Save size={16} /> Guardar nivell
              </button>
            </div>

            {/* Specialties + other */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4">
                Especialitzacions + Altres titulacions
              </h3>

              <div className="mb-4">
                <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                  Especialitzacions FECDAS/CMAS (afegeix una a una)
                </label>

                <div className="flex gap-2">
                  <input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                    placeholder="Ex: Nitrox, Profunditat, Rescat..."
                  />
                  <button
                    onClick={() => {
                      const s = newSpecialty.trim();
                      if (!s) return;
                      const next = Array.from(new Set([...(extra.specialties || []), s]));
                      saveExtra({ ...extra, specialties: next });
                      setNewSpecialty("");
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold hover:bg-slate-800 inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Afegir
                  </button>
                </div>

                <div className="mt-3">
                  {(extra.specialties || []).length === 0 ? (
                    <p className="text-sm text-gray-500">Encara no hi ha especialitzacions.</p>
                  ) : (
                    <ul className="space-y-2">
                      {(extra.specialties || []).map((s) => (
                        <li
                          key={s}
                          className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-gray-800 font-semibold">{s}</span>
                          <button
                            onClick={() => {
                              const next = (extra.specialties || []).filter((x) => x !== s);
                              saveExtra({ ...extra, specialties: next });
                            }}
                            className="text-red-600 hover:text-red-700 inline-flex items-center gap-2 font-bold"
                            title="Eliminar"
                          >
                            <Trash2 size={16} /> Treure
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                  Altres titulacions (si no tens FECDAS/CMAS, escriu aquí)
                </label>
                <textarea
                  value={extra.otherCertifications || ""}
                  onChange={(e) =>
                    saveExtra({ ...extra, otherCertifications: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 min-h-[110px]"
                  placeholder="Ex: PADI AOW + Nitrox, SSI ..., certificacions internacionals..."
                />
              </div>

              <button
                onClick={() => saveExtra({ ...extra })}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-black font-extrabold hover:bg-yellow-300"
              >
                <Save size={16} /> Guardar titulacions
              </button>
            </div>
          </div>
        )}

        {/* 4) PASSWORD */}
        {activeTab === "password" && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <KeyRound size={18} /> Contrasenya (mode local)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Per ara és una contrasenya guardada al navegador. Més endavant ho convertirem a login real (Firebase/Supabase).
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Nova contrasenya
                  </label>
                  <input
                    type="password"
                    value={pwd1}
                    onChange={(e) => setPwd1(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                    Repeteix la contrasenya
                  </label>
                  <input
                    type="password"
                    value={pwd2}
                    onChange={(e) => setPwd2(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="••••••••"
                  />
                </div>

                {pwdMsg && (
                  <div className="text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    {pwdMsg}
                  </div>
                )}

                <button
                  onClick={() => {
                    setPwdMsg(null);
                    if (!pwd1.trim() || pwd1.trim().length < 6) {
                      setPwdMsg("La contrasenya ha de tenir com a mínim 6 caràcters.");
                      return;
                    }
                    if (pwd1 !== pwd2) {
                      setPwdMsg("Les contrasenyes no coincideixen.");
                      return;
                    }
                    saveExtra({ ...extra, password: pwd1 });
                    setPwd1("");
                    setPwd2("");
                    setPwdMsg("Contrasenya desada correctament (mode local).");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-yellow-400 font-extrabold hover:bg-slate-800"
                >
                  <Save size={16} /> Guardar contrasenya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
