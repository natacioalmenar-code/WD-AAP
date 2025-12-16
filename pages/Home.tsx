import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Calendar, GraduationCap, LifeBuoy, MapPin, ShieldCheck, Users } from "lucide-react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { clubSettings, currentUser, canManageSystem } = useApp();

  const heroBg = useMemo(() => {
    const anySettings = clubSettings as any;
    return (
      (clubSettings?.appBackgroundUrl || "").trim() ||
      (anySettings?.homeHeroImageUrl || "").trim() ||
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=70"
    );
  }, [clubSettings]);

  const heroTitle = (clubSettings?.heroTitle || "WEST DIVERS").trim();
  const heroSub =
    (clubSettings as any)?.heroSubtitle?.trim?.() ||
    "El teu club de busseig per excel·lència. Formació, sortides i comunitat.";

  const appImage = useMemo(() => {
    const anySettings = clubSettings as any;
    return (
      (anySettings?.homeAppImageUrl || "").trim() ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=70"
    );
  }, [clubSettings]);

  const appTitle = (clubSettings as any)?.homeAppTitle?.trim?.() || "Tot el teu busseig, en una sola App";
  const appText =
    (clubSettings as any)?.homeAppText?.trim?.() ||
    "Els socis i sòcies tenen accés exclusiu a la nostra aplicació privada: sortides, recursos, calendari i comunitat.";

  const bullets: string[] = useMemo(() => {
    const anySettings = clubSettings as any;
    const fromDb = anySettings?.homeBullets;
    if (Array.isArray(fromDb) && fromDb.length) return fromDb.filter(Boolean);
    return [
      "Inscripció a sortides amb un sol clic",
      "Registre digital de titulacions i assegurança",
      "Comunitat, xarrades i esdeveniments exclusius",
    ];
  }, [clubSettings]);

  const goPanel = () => {
    if (currentUser) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative">
        <div
          className="h-[520px] w-full"
          style={{
            backgroundImage: `url("${heroBg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0">
          <div className="container-app h-full flex items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-white/90 text-sm font-bold">
                <ShieldCheck size={16} />
                Àrea privada per socis/es
              </div>

              <h1 className="mt-4 text-white text-4xl sm:text-5xl font-black leading-tight">
                {heroTitle}
              </h1>
              <p className="mt-4 text-white/90 text-lg">{heroSub}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={goPanel} className="btn btn-primary">
                  {currentUser ? "Entrar al panell" : "Accés Socis/es"}
                </button>

                {!currentUser ? (
                  <Link to="/register" className="btn btn-ghost text-white border-white/20 bg-white/10 hover:bg-white/15">
                    Sol·licitar accés
                  </Link>
                ) : (
                  <button
                    onClick={() => navigate("/trips")}
                    className="btn btn-ghost text-white border-white/20 bg-white/10 hover:bg-white/15"
                  >
                    Veure sortides
                  </button>
                )}

                {(canManageSystem?.() ?? false) && (
                  <button
                    onClick={() => navigate("/admin-users")}
                    className="btn btn-ghost text-white border-white/20 bg-white/10 hover:bg-white/15"
                  >
                    Gestió (Admin)
                  </button>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-white">
                  <div className="font-black text-lg">Sortides</div>
                  <div className="text-white/80 text-sm mt-1">Inscripció ràpida i places.</div>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-white">
                  <div className="font-black text-lg">Cursos</div>
                  <div className="text-white/80 text-sm mt-1">FECDAS/CMAS + especialitats.</div>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-white">
                  <div className="font-black text-lg">Comunitat</div>
                  <div className="text-white/80 text-sm mt-1">Mur social i esdeveniments.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-10">
        <div className="container-app grid grid-cols-1 md:grid-cols-4 gap-4">
          <button onClick={() => navigate("/help")} className="card card-pad text-left hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <LifeBuoy />
              <div>
                <div className="font-black">Ajuda</div>
                <div className="muted text-sm">Preguntes i suport.</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => (currentUser ? navigate("/calendar") : navigate("/login"))}
            className="card card-pad text-left hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <Calendar />
              <div>
                <div className="font-black">Calendari</div>
                <div className="muted text-sm">Activitats i planificació.</div>
              </div>
            </div>
          </button>

          <Link to="/courses-public" className="card card-pad text-left hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <GraduationCap />
              <div>
                <div className="font-black">Cursos</div>
                <div className="muted text-sm">Formació i especialitats.</div>
              </div>
            </div>
          </Link>

          <a
            href="mailto:thewestdivers@gmail.com"
            className="card card-pad text-left hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <Users />
              <div>
                <div className="font-black">Contacte</div>
                <div className="muted text-sm">Escriu-nos per correu.</div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ESPECIALITATS */}
      <section className="py-14 bg-[#0b1730]">
        <div className="container-app">
          <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 text-center">
            ESPECIALITATS FECDAS / CMAS
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Nitrox", desc: "Busseja més temps amb més seguretat.", icon: "O2" },
              { title: "Profunda", desc: "Descobreix què s’amaga a més profunditat.", icon: "⚓" },
              { title: "Vestit Sec", desc: "Submergeix-te tot l’any sense passar fred.", icon: "🛡️" },
              { title: "Salvament", desc: "Aprèn a gestionar situacions d’emergència.", icon: "👥" },
            ].map((c) => (
              <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/40 flex items-center justify-center text-xl font-black">
                  {c.icon}
                </div>
                <div className="mt-4 font-black text-lg">{c.title}</div>
                <div className="mt-2 text-sm text-white/80">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="container-app grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="card overflow-hidden">
            <img src={appImage} alt="app" className="w-full max-h-[420px] object-cover" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900">{appTitle}</h2>
            <p className="mt-3 text-slate-700">{appText}</p>

            <div className="mt-6 space-y-3">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 h-7 w-7 rounded-full bg-yellow-400 flex items-center justify-center font-black">
                    ✓
                  </div>
                  <div className="text-slate-800 font-bold">{b}</div>
                </div>
              ))}
            </div>

            {!currentUser && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="btn btn-primary">
                  Sol·licitar accés
                </Link>
                <Link to="/login" className="btn btn-ghost">
                  Ja tinc compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="py-12 bg-white border-t">
        <div className="container-app grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card card-pad">
            <div className="flex items-start gap-3">
              <MapPin />
              <div>
                <div className="font-black">On som</div>
                <div className="muted text-sm mt-1">
                  Carrer Trullets, 26 baixos · 25126 Almenar, Lleida
                </div>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="font-black">Telèfons</div>
            <div className="muted text-sm mt-1">625 57 22 00 · 644 79 40 11</div>
          </div>

          <div className="card card-pad">
            <div className="font-black">Correus</div>
            <div className="muted text-sm mt-1">natacioalmenar@gmail.com</div>
            <div className="muted text-sm">thewestdivers@gmail.com</div>
          </div>
        </div>
      </section>
    </div>
  );
};
