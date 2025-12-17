import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { useApp } from "../context/AppContext";

const CERT_OPTIONS = [
  "FECDAS/CMAS",
  "PADI",
  "SSI",
  "NAUI",
  "SDI/TDI",
  "IANTD",
  "BSAC",
  "Altres",
];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [certOrg, setCertOrg] = useState("FECDAS/CMAS");
  const [certLevel, setCertLevel] = useState(""); // ex: Open Water, B1E, AOWD...
  const [certOther, setCertOther] = useState(""); // quan "Altres"

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const certification = useMemo(() => {
    const org = certOrg === "Altres" ? certOther.trim() : certOrg.trim();
    const lvl = certLevel.trim();
    if (!org && !lvl) return "";
    if (!org) return lvl;
    if (!lvl) return org;
    return `${org} · ${lvl}`;
  }, [certOrg, certLevel, certOther]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    const n = name.trim();
    const em = email.trim().toLowerCase();
    const pw = password;

    if (!n || !em || !pw) {
      setErr("Falten dades: nom, email i contrasenya són obligatoris.");
      return;
    }
    if (pw.length < 6) {
      setErr("La contrasenya ha de tindre mínim 6 caràcters.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        name: n,
        email: em,
        password: pw,
        certification: certification,
      });

      // registerUser ja fa alert + signOut, però per UX tornem a login
      navigate("/login");
    } catch (e: any) {
      setErr("No s’ha pogut completar la inscripció. Torna-ho a provar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHero
        compact
        title="Inscripció"
        subtitle="Crea el teu compte. L’administració aprovarà l’accés abans d’entrar a l’àrea privada."
        badge={<span>Accés controlat · Pendents d’aprovació</span>}
      />

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna esquerra: text premium */}
        <div className="bg-white border rounded-3xl shadow-sm p-8">
          <div className="inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-900 text-yellow-300 px-3 py-1">
            WEST DIVERS · CLUB
          </div>

          <h2 className="mt-4 text-3xl font-black text-slate-900">
            Benvingut/da 👋
          </h2>

          <p className="mt-3 text-slate-600 font-semibold leading-relaxed">
            Amb aquest registre crearàs un compte. Després, l’administració
            validarà que eres soci/a del club i activarà l’accés.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">1</div>
              <div className="mt-1 font-extrabold text-slate-900">Crea el compte</div>
              <div className="mt-1 text-sm text-slate-600">
                Nom, email i contrasenya.
              </div>
            </div>

            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">2</div>
              <div className="mt-1 font-extrabold text-slate-900">Aprovació</div>
              <div className="mt-1 text-sm text-slate-600">
                L’admin valida l’accés.
              </div>
            </div>

            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">3</div>
              <div className="mt-1 font-extrabold text-slate-900">Àrea privada</div>
              <div className="mt-1 text-sm text-slate-600">
                Sortides, cursos i recursos.
              </div>
            </div>

            <div className="border rounded-2xl p-5 bg-slate-50">
              <div className="text-xs font-black text-slate-600">✔</div>
              <div className="mt-1 font-extrabold text-slate-900">Certificació</div>
              <div className="mt-1 text-sm text-slate-600">
                FECDAS/CMAS, PADI, SSI...
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-slate-600">
            Ja tens compte?{" "}
            <Link to="/login" className="font-black text-slate-900 underline">
              Inicia sessió
            </Link>
          </div>
        </div>

        {/* Columna dreta: formulari */}
        <div className="bg-white border rounded-3xl shadow-sm p-8">
          <h3 className="text-2xl font-black text-slate-900">Dades d’inscripció</h3>
          <p className="mt-2 text-sm text-slate-600">
            Ompli el formulari i envia la sol·licitud.
          </p>

          {err ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 font-semibold">
              {err}
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-black text-slate-900">Nom i cognoms</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none"
                placeholder="Ex: Natàlia Almenar"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="text-sm font-black text-slate-900">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none"
                placeholder="Ex: nom@gmail.com"
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-sm font-black text-slate-900">Contrasenya</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none"
                placeholder="Mínim 6 caràcters"
                type="password"
                autoComplete="new-password"
              />
            </div>

            {/* ✅ CERTIFICACIÓ “TRANSPARENT” */}
            <div className="mt-2 rounded-3xl border bg-slate-900 text-white p-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/30" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-xs font-black text-yellow-300">CERTIFICACIÓ</div>
                    <div className="mt-1 text-lg font-black">
                      FECDAS/CMAS · PADI · SSI…
                    </div>
                    <div className="mt-1 text-sm text-white/80">
                      (Opcional) Ajuda a identificar el teu nivell al club.
                    </div>
                  </div>

                  {certification ? (
                    <div className="text-xs font-black rounded-full px-3 py-2 bg-white/10 border border-white/10">
                      {certification}
                    </div>
                  ) : (
                    <div className="text-xs font-black rounded-full px-3 py-2 bg-white/10 border border-white/10">
                      Sense informació
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-white/90">
                      Organització
                    </label>
                    <select
                      value={certOrg}
                      onChange={(e) => setCertOrg(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white focus:outline-none"
                    >
                      {CERT_OPTIONS.map((o) => (
                        <option key={o} value={o} className="text-slate-900">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-white/90">
                      Nivell (opcional)
                    </label>
                    <input
                      value={certLevel}
                      onChange={(e) => setCertLevel(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="Ex: Open Water, AOWD, B1E..."
                    />
                  </div>
                </div>

                {certOrg === "Altres" ? (
                  <div className="mt-3">
                    <label className="text-xs font-black text-white/90">
                      Escriu l’organització
                    </label>
                    <input
                      value={certOther}
                      onChange={(e) => setCertOther(e.target.value)}
                      className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none"
                      placeholder="Ex: RAID, ACUC..."
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full mt-2 px-6 py-3 rounded-2xl font-black shadow ${
                loading
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
              type="submit"
            >
              {loading ? "Creant compte..." : "Enviar inscripció"}
            </button>

            <div className="text-xs text-slate-500 leading-relaxed">
              En enviar, acceptes que el club gestione aquest accés i dades per al
              funcionament intern (inscripcions, comunicacions i organització).
            </div>

            <div className="text-sm text-slate-600">
              Ja tens compte?{" "}
              <Link to="/login" className="font-black text-slate-900 underline">
                Inicia sessió
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
