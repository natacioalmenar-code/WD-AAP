import React, { useMemo, useState } from "react";
import { PageHero } from "../components/PageHero";
import { useApp } from "../context/AppContext";

const Badge: React.FC<{ tone?: "good" | "warn" | "neutral"; children: React.ReactNode }> = ({
  tone = "neutral",
  children,
}) => {
  const cls =
    tone === "good"
      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
      : tone === "warn"
      ? "bg-yellow-50 border-yellow-200 text-yellow-900"
      : "bg-slate-50 border-slate-200 text-slate-700";
  return (
    <span className={`inline-flex items-center text-xs font-black px-3 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
};

const isHttpUrl = (v: string) => {
  const t = (v || "").trim();
  return !t || /^https?:\/\//i.test(t);
};

export const Profile: React.FC = () => {
  const { currentUser, updateMyProfile } = useApp();

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState(currentUser?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || "");
  const [certification, setCertification] = useState(currentUser?.certification || "");

  const [licenseInsurance, setLicenseInsurance] = useState(currentUser?.licenseInsurance || "");
  const [licenseInsuranceUrl, setLicenseInsuranceUrl] = useState(currentUser?.licenseInsuranceUrl || "");
  const [insuranceExpiry, setInsuranceExpiry] = useState(currentUser?.insuranceExpiry || "");

  const [medicalCertificate, setMedicalCertificate] = useState(currentUser?.medicalCertificate || "");
  const [medicalCertificateUrl, setMedicalCertificateUrl] = useState(currentUser?.medicalCertificateUrl || "");
  const [medicalExpiry, setMedicalExpiry] = useState(currentUser?.medicalExpiry || "");

  const statusTone = useMemo(() => {
    if (!currentUser) return "neutral";
    return currentUser.status === "active" ? "good" : "warn";
  }, [currentUser]);

  const insuranceTone = useMemo(() => {
    if (!insuranceExpiry) return "warn";
    const t = Date.parse(insuranceExpiry);
    if (Number.isNaN(t)) return "warn";
    return t >= Date.now() ? "good" : "warn";
  }, [insuranceExpiry]);

  const medicalTone = useMemo(() => {
    if (!medicalExpiry) return "warn";
    const t = Date.parse(medicalExpiry);
    if (Number.isNaN(t)) return "warn";
    return t >= Date.now() ? "good" : "warn";
  }, [medicalExpiry]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const aUrl = avatarUrl.trim();
    const liUrl = licenseInsuranceUrl.trim();
    const mcUrl = medicalCertificateUrl.trim();

    // validació suau (premium: millor feedback)
    if (!isHttpUrl(aUrl)) {
      setMsg("La foto ha de ser una URL que comence per http:// o https://");
      return;
    }
    if (!isHttpUrl(liUrl)) {
      setMsg("L’enllaç de l’assegurança ha de ser http:// o https://");
      return;
    }
    if (!isHttpUrl(mcUrl)) {
      setMsg("L’enllaç del certificat mèdic ha de ser http:// o https://");
      return;
    }

    setMsg("");
    setSaving(true);
    try {
      await updateMyProfile({
        name,
        avatarUrl: aUrl,
        certification,

        licenseInsurance,
        licenseInsuranceUrl: liUrl,
        insuranceExpiry,

        medicalCertificate,
        medicalCertificateUrl: mcUrl,
        medicalExpiry,
      });

      setMsg("Perfil actualitzat ✅");
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("No s’ha pogut guardar ❌");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Has d’iniciar sessió</h1>
          <p className="text-slate-600 mt-2">Per veure el perfil, primer fes login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
      <PageHero
        compact
        title="Perfil"
        subtitle="El teu carnet digital i documents del club."
        badge={
          <span>
            Rol: <b>{currentUser.role}</b> · Estat: <b>{currentUser.status}</b>
          </span>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Carnet */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-6 overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-yellow-300 font-black text-xl">
                      {(currentUser.name || "S").slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-500">CARNET SOCI/A</div>
                  <div className="text-xl font-black text-slate-900 truncate">
                    {currentUser.name || "Soci/a"}
                  </div>
                  <div className="text-sm text-slate-600 truncate">{currentUser.email}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone={statusTone as any}>{currentUser.status === "active" ? "ACTIU" : "PENDENT"}</Badge>
                <Badge>{String(currentUser.level || "").toUpperCase() || "NIVELL"}</Badge>
                <Badge>{String(currentUser.role || "").toUpperCase()}</Badge>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border bg-white/60 p-4">
                  <div className="text-xs font-black text-slate-500">CERTIFICACIÓ</div>
                  <div className="mt-1 font-extrabold text-slate-900">
                    {certification ? certification : "No indicada"}
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-500">ASSEGURANÇA / LLICÈNCIA</div>
                      <div className="mt-1 font-extrabold text-slate-900 truncate">
                        {licenseInsurance ? licenseInsurance : "No indicada"}
                      </div>
                      {licenseInsuranceUrl ? (
                        <a
                          href={licenseInsuranceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 text-sm font-black text-slate-900 underline decoration-yellow-400 underline-offset-4"
                        >
                          Obrir document →
                        </a>
                      ) : null}
                    </div>
                    <Badge tone={insuranceTone as any}>
                      {insuranceExpiry ? `Fins ${insuranceExpiry}` : "Falta data"}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-500">CERTIFICAT MÈDIC</div>
                      <div className="mt-1 font-extrabold text-slate-900 truncate">
                        {medicalCertificate ? medicalCertificate : "No indicat"}
                      </div>
                      {medicalCertificateUrl ? (
                        <a
                          href={medicalCertificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 text-sm font-black text-slate-900 underline decoration-yellow-400 underline-offset-4"
                        >
                          Obrir document →
                        </a>
                      ) : null}
                    </div>
                    <Badge tone={medicalTone as any}>
                      {medicalExpiry ? `Fins ${medicalExpiry}` : "Falta data"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-500">
                Consell: puja els documents a Google Drive/Dropbox i pega ací l’enllaç (compartició pública o amb link).
              </div>
            </div>
          </div>
        </div>

        {/* Formulari */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm p-8">
            <h2 className="text-2xl font-black text-slate-900">Editar perfil</h2>
            <p className="mt-2 text-sm text-slate-600">
              Mantén al dia la teua certificació i documents.
            </p>

            {msg ? (
              <div className="mt-5 rounded-2xl border bg-slate-900 text-yellow-300 px-4 py-3 text-sm font-black">
                {msg}
              </div>
            ) : null}

            <form onSubmit={save} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-black text-slate-900">Nom</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                    placeholder="Nom i cognoms"
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-900">Foto (URL)</label>
                  <input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-900">Certificació</label>
                <input
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
                  placeholder="Ex: FECDAS/CMAS · B1E  |  PADI · AOWD  |  SSI · OWD..."
                />
              </div>

              <div className="rounded-3xl border bg-slate-900 text-white p-6">
                <div className="text-xs font-black text-yellow-300">DOCUMENTACIÓ</div>
                <div className="mt-1 text-lg font-black">Llicència / Assegurança i Certificat Mèdic</div>
                <div className="mt-1 text-sm text-white/75">
                  Guarda el número o informació i, si vols, un enllaç al PDF/foto.
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-white/90">Llicència / Assegurança (text)</label>
                    <input
                      value={licenseInsurance}
                      onChange={(e) => setLicenseInsurance(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="Ex: Assegurança DAN · nº 12345"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-white/90">Caducitat assegurança</label>
                    <input
                      value={insuranceExpiry}
                      onChange={(e) => setInsuranceExpiry(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-black text-white/90">Enllaç document (PDF/foto)</label>
                    <input
                      value={licenseInsuranceUrl}
                      onChange={(e) => setLicenseInsuranceUrl(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-white/90">Certificat mèdic (text)</label>
                    <input
                      value={medicalCertificate}
                      onChange={(e) => setMedicalCertificate(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="Ex: Centre mèdic / observacions"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-white/90">Caducitat certificat mèdic</label>
                    <input
                      value={medicalExpiry}
                      onChange={(e) => setMedicalExpiry(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-black text-white/90">Enllaç certificat (PDF/foto)</label>
                    <input
                      value={medicalCertificateUrl}
                      onChange={(e) => setMedicalCertificateUrl(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="https://dropbox.com/..."
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={saving}
                className={`w-full px-6 py-3 rounded-2xl font-black shadow ${
                  saving
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                }`}
                type="submit"
              >
                {saving ? "Guardant..." : "Guardar canvis"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
