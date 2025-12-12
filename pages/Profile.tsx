import React, { useEffect, useMemo, useState } from "react";
import { useApp, FECDAS_LEVELS, FecdAsLevel } from "../context/AppContext";
import {
  Camera,
  Save,
  ShieldCheck,
  Activity,
  CreditCard,
  Award,
  User as UserIcon,
  FileText,
} from "lucide-react";

type TabKey = "personal" | "docs" | "certs";

const SPECIALTIES_FECDAS: string[] = [
  "Nitrox",
  "Flotabilitat / Control de flotabilitat",
  "Navegació submarina",
  "Rescat",
  "Primeres cures / Oxigenoteràpia",
  "Busseig nocturn",
  "Busseig profund",
  "Barques",
  "Fotografia submarina",
  "Biologia marina",
  "Apnea",
  "Sidemount",
  "Cavernes / Cova (si aplica)",
];

export const Profile: React.FC = () => {
  const { currentUser, updateMyProfile, updateMyDocuments } = useApp();

  const [tab, setTab] = useState<TabKey>("personal");

  // ---- Local forms ----
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [level, setLevel] = useState<FecdAsLevel>("B1E");

  const [docsForm, setDocsForm] = useState({
    licenseNumber: "",
    insuranceCompany: "",
    insurancePolicy: "",
    insuranceExpiry: "",
    medicalCertExpiry: "",
    highestCertification: "",
  });

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [otherSpecialtiesText, setOtherSpecialtiesText] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    setName(currentUser.name ?? "");
    setAvatarUrl(currentUser.avatarUrl ?? "");
    setLevel((currentUser.level ?? "B1E") as FecdAsLevel);

    setDocsForm({
      licenseNumber: currentUser.documents?.licenseNumber ?? "",
      insuranceCompany: currentUser.documents?.insuranceCompany ?? "",
      insurancePolicy: currentUser.documents?.insurancePolicy ?? "",
      insuranceExpiry: currentUser.documents?.insuranceExpiry ?? "",
      medicalCertExpiry: currentUser.documents?.medicalCertExpiry ?? "",
      highestCertification: currentUser.documents?.highestCertification ?? "",
    });

    setSpecialties(Array.isArray(currentUser.specialties) ? currentUser.specialties : []);
    setOtherSpecialtiesText(currentUser.otherSpecialtiesText ?? "");
  }, [currentUser]);

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const avatarVisible = useMemo(() => {
    const url = (avatarUrl || "").trim();
    return url.length > 0;
  }, [avatarUrl]);

  if (!currentUser) return null;

  const savePersonal = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Introdueix el nom i cognoms.");
      return;
    }
    updateMyProfile({
      name: trimmedName,
      avatarUrl: (avatarUrl || "").trim(),
      level,
    });
    alert("Dades personals actualitzades.");
  };

  const saveDocs = () => {
    updateMyDocuments({
      licenseNumber: docsForm.licenseNumber.trim(),
      insuranceCompany: docsForm.insuranceCompany.trim(),
      insurancePolicy: docsForm.insurancePolicy.trim(),
      insuranceExpiry: docsForm.insuranceExpiry,
      medicalCertExpiry: docsForm.medicalCertExpiry,
      highestCertification: docsForm.highestCertification.trim(),
    });
    alert("Documentació actualitzada.");
  };

  const toggleSpecialty = (spec: string) => {
    setSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const saveCerts = () => {
    updateMyProfile({
      specialties,
      otherSpecialtiesText: otherSpecialtiesText.trim(),
      // IMPORTANT: el level es guarda al tab personal
    });
    alert("Titulacions i especialitats actualitzades.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {avatarVisible ? (
            <img
              src={avatarUrl}
              alt="Foto de perfil"
              className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-md bg-slate-100 flex items-center justify-center">
              <UserIcon className="text-slate-400" size={40} />
            </div>
          )}
          <div
            className="absolute -bottom-2 -right-2 bg-slate-900 text-yellow-400 p-2 rounded-full"
            title="Foto opcional (URL)"
          >
            <Camera size={16} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">{currentUser.name}</h1>
          <p className="text-gray-600 mt-1">{currentUser.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
              {currentUser.role === "admin"
                ? "Administració"
                : currentUser.role === "instructor"
                ? "Instructor/a"
                : "Soci/a"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-black">
              Nivell: {currentUser.level}
            </span>
            {currentUser.status !== "active" && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                Pendent d’aprovació
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-8">
        <button
          onClick={() => setTab("personal")}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
            tab === "personal"
              ? "border-yellow-400 text-slate-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Dades personals
        </button>
        <button
          onClick={() => setTab("docs")}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
            tab === "docs"
              ? "border-yellow-400 text-slate-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setTab("certs")}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
            tab === "certs"
              ? "border-yellow-400 text-slate-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Titulacions
        </button>
      </div>

      {/* PERSONAL */}
      {tab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserIcon size={18} /> Perfil
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nom i cognoms
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Nom i cognoms"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Correu electrònic
                </label>
                <input
                  value={currentUser.email}
                  readOnly
                  className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Foto de perfil (opcional, URL)
                </label>
                <input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si ho deixes buit, no es mostrarà cap foto.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nivell FECDAS / CMAS
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as FecdAsLevel)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  {FECDAS_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                  <option value="ALTRES">ALTRES</option>
                </select>
                {level === "ALTRES" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Si el teu nivell no és FECDAS/CMAS, descriu-lo a “Altres titulacions” (pestanya Titulacions).
                  </p>
                )}
              </div>

              <button
                onClick={savePersonal}
                className="w-full mt-2 bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-300 flex items-center justify-center gap-2"
              >
                <Save size={18} /> Guardar dades personals
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={18} /> Resum
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold uppercase text-gray-500">Titulació indicada a l’alta</p>
                <p className="text-slate-900 font-semibold mt-1">
                  {currentUser.certification ? currentUser.certification : "No indicada"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold uppercase text-gray-500">Especialitats FECDAS/CMAS</p>
                {specialties.length === 0 ? (
                  <p className="text-gray-600 mt-1">Cap especialitat registrada.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold uppercase text-gray-500">Altres titulacions (text lliure)</p>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                  {otherSpecialtiesText ? otherSpecialtiesText : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCS */}
      {tab === "docs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status cards */}
          <div className="space-y-4">
            <div
              className={`p-6 rounded-xl border-l-4 shadow-sm ${
                isExpired(docsForm.insuranceExpiry)
                  ? "bg-red-50 border-red-500"
                  : "bg-green-50 border-green-500"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck size={20} /> Assegurança
                </h3>
                {docsForm.insuranceExpiry ? (
                  isExpired(docsForm.insuranceExpiry) ? (
                    <span className="text-red-600 text-xs font-bold uppercase border border-red-200 px-2 py-1 rounded bg-white">
                      Caducada
                    </span>
                  ) : (
                    <span className="text-green-600 text-xs font-bold uppercase border border-green-200 px-2 py-1 rounded bg-white">
                      Vigent
                    </span>
                  )
                ) : (
                  <span className="text-gray-500 text-xs font-bold uppercase border border-gray-200 px-2 py-1 rounded bg-white">
                    No informada
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">
                Companyia: <span className="font-semibold">{docsForm.insuranceCompany || "—"}</span>
              </p>
              <p className="text-sm text-gray-700">
                Nº pòlissa: <span className="font-mono">{docsForm.insurancePolicy || "—"}</span>
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Caduca: <span className="font-mono font-bold">{docsForm.insuranceExpiry || "—"}</span>
              </p>
            </div>

            <div
              className={`p-6 rounded-xl border-l-4 shadow-sm ${
                isExpired(docsForm.medicalCertExpiry)
                  ? "bg-red-50 border-red-500"
                  : "bg-green-50 border-green-500"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity size={20} /> Certificat mèdic
                </h3>
                {docsForm.medicalCertExpiry ? (
                  isExpired(docsForm.medicalCertExpiry) ? (
                    <span className="text-red-600 text-xs font-bold uppercase border border-red-200 px-2 py-1 rounded bg-white">
                      Caducat
                    </span>
                  ) : (
                    <span className="text-green-600 text-xs font-bold uppercase border border-green-200 px-2 py-1 rounded bg-white">
                      Vigent
                    </span>
                  )
                ) : (
                  <span className="text-gray-500 text-xs font-bold uppercase border border-gray-200 px-2 py-1 rounded bg-white">
                    No informat
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">
                Caduca: <span className="font-mono font-bold">{docsForm.medicalCertExpiry || "—"}</span>
              </p>
            </div>

            <div className="p-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard size={20} /> Llicència federativa
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Nº llicència:{" "}
                <span className="font-mono font-bold">{docsForm.licenseNumber || "—"}</span>
              </p>
            </div>

            <div className="p-6 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText size={20} /> Titulació més elevada
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{docsForm.highestCertification || "—"}</span>
              </p>
            </div>
          </div>

          {/* Editing form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Save size={20} /> Actualitzar documentació
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nº llicència federativa
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={docsForm.licenseNumber}
                  onChange={(e) => setDocsForm({ ...docsForm, licenseNumber: e.target.value })}
                  placeholder="Ex: CAT-12345"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Companyia assegurança
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={docsForm.insuranceCompany}
                    onChange={(e) => setDocsForm({ ...docsForm, insuranceCompany: e.target.value })}
                    placeholder="Ex: DAN"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Nº pòlissa
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={docsForm.insurancePolicy}
                    onChange={(e) => setDocsForm({ ...docsForm, insurancePolicy: e.target.value })}
                    placeholder="Ex: 00112233"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Caducitat assegurança
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={docsForm.insuranceExpiry}
                    onChange={(e) => setDocsForm({ ...docsForm, insuranceExpiry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Caducitat certificat mèdic
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={docsForm.medicalCertExpiry}
                    onChange={(e) => setDocsForm({ ...docsForm, medicalCertExpiry: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Titulació més elevada (text)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={docsForm.highestCertification}
                  onChange={(e) =>
                    setDocsForm({ ...docsForm, highestCertification: e.target.value })
                  }
                  placeholder="Ex: B2E / AOWD / Rescue..."
                />
              </div>

              <button
                onClick={saveDocs}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar documentació
              </button>
              <p className="text-xs text-gray-500">
                * Aquí només guardem dades. La pujada de fitxers (PDF/foto) la farem al PAS 5.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CERTS */}
      {tab === "certs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={18} /> Especialitats FECDAS / CMAS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPECIALTIES_FECDAS.map((spec) => {
                const checked = specialties.includes(spec);
                return (
                  <label
                    key={spec}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      checked ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSpecialty(spec)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-slate-800 font-medium">{spec}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={18} /> Altres titulacions (text lliure)
            </h2>

            <textarea
              value={otherSpecialtiesText}
              onChange={(e) => setOtherSpecialtiesText(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 min-h-[180px]"
              placeholder="Escriu aquí qualsevol titulació o especialitat que no sigui FECDAS/CMAS (ex: PADI AOWD, SSI, etc.)"
            />

            <button
              onClick={saveCerts}
              className="w-full mt-4 bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-300 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Guardar titulacions
            </button>

            <p className="text-xs text-gray-500 mt-3">
              * Si el teu nivell és “ALTRES”, explica’l aquí també (per exemple “PADI Rescue + Nitrox”).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
