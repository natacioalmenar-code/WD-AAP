import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  CalendarDays,
  GraduationCap,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
  Users,
  Waves,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

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
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w1800&q=70"
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
        {/* Foto */}
        <div
          className="h-[560px] w-full"
          style={{
            backgroundImage: `url("${heroBg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Overlay premium (marí) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1730]/85 via-[#0b1730]/65 to-black/85" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Contingut */}
        <div className="absolute inset-0">
          <div className="max-w-6xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-white/90 text-sm font-bold">
                <ShieldCheck size={16} />
                Àrea privada per socis/es
              </div>

              <h1 className="mt-4 text-white text-4xl sm:text-5xl font-black leading-tight">
                {heroTitle}
              </h1>
              <p className="mt-4 text-white/90 text-lg">{heroSub}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {/* CTA principal */}
                <button
                  onClick={goPanel}
                  className="px-7 py-3 rounded-2xl bg-yellow-400 text-black font-black text-lg
                             hover:bg-yellow-500 hover:scale-[1.02] transition shadow-xl"
                >
                  {currentUser ? "Entrar al panell" : "Accés Socis/es"}
                </button>

                {/* CTA secundari */}
                {!currentUser ? (
                  <Link
                    to="/register"
                    className="px-7 py-3 rounded-2xl border-2 border-yellow-400 text-yellow-300 font-black text-lg
                               hover:bg-yellow-400 hover:text-black transition text-center"
                  >
                    Sol·licitar accés <ArrowRight className="inline-block ml-2" size={18} />
                  </Link>
                ) : (
                  <button
                    onClick={() => navigate("/trips")}
                    className="px-7 py-3 rounded-2xl bg-white/10 text-white font-black text-lg
                               hover:bg-white/20 transition text-center"
                  >
                    Veure sortides
                  </button>
                )}

                {(canManageSystem?.() ?? false) && (
                  <button
                    onClick={() => navigate("/admin-users")}
                    className="px-7 py-3 rounded-2xl bg-white/10 text-white font-black text-lg
                               hover:bg-white/20 transition"
                    title="Zona administració"
                  >
                    Admin
                  </button>
                )}
              </div>

              {/* 3 mini cards */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Sortides", desc: "Inscripció ràpida i places.", icon: <Waves size={18} /> },
                  { title: "Cursos", desc: "FECDAS/CMAS + especialitats.", icon: <GraduationCap size={18} /> },
                  { title: "Comunitat", desc: "Mur social i esdeveniments.", icon: <Users size={18} /> },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl p-5 bg-white/10 border border-white/15 backdrop-blur
                               hover:bg-white/20 transition hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 text-white">
                      <div className="h-10 w-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center">
                        {c.icon}
                      </div>
                      <div>
                        <div className="font-black">{c.title}</div>
                        <div className="text-white/80 text-sm mt-1">{c.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Text petit */}
              {!currentUser && (
                <div className="mt-6 text-white/70 text-sm">
                  * Si ja tens compte, fes{" "}
                  <Link to="/login" className="text-yellow-300 font-black hover:underline">
                    login
                  </Link>{" "}
                  directament.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS (requadres del mig) */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "Ajuda",
                desc: "Preguntes i suport.",
                icon: <LifeBuoy size={20} />,
                onClick: () => navigate("/help"),
              },
              {
                title: "Calendari",
                desc: "Activitats i planificació.",
                icon: <CalendarDays size={20} />,
                onClick: () => (currentUser ? navigate("/calendar") : navigate("/login")),
              },
              {
                title: "Cursos",
                desc: "Formació i especialitats.",
                icon: <GraduationCap size={20} />,
                onClick: () => navigate("/courses-public"),
              },
              {
                title: "Contacte",
                desc: "Escriu-nos per correu.",
                icon: <Mail size={20} />,
                onClick: () => (window.location.href = "mailto:thewestdivers@gmail.com"),
              },
            ].map((it) => (
              <button
                key={it.title}
                onClick={it.onClick}
                className="group bg-white border border-slate-200 rounded-2xl p-6 text-left
                           hover:shadow-md transition"
              >
                {/* barra groga */}
                <div className="h-1 w-14 bg-yellow-400 rounded-full mb-4 group-hover:w-20 transition-all" />
                <div className="flex items-center gap-3">
                  {/* icona moderna (no rodona) */}
                  <div className="h-11 w-11 rounded-xl bg-black text-yellow-300 flex items-center justify-center">
                    {it.icon}
                  </div>
                  <div>
                    <div className="font-black text-slate-900">{it.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{it.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIALITATS */}
      <section className="py-16 bg-[#0b1730]">
        <div className="max-w-6xl mx-auto px-4">
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
              <div
                key={c.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white
                           hover:bg-white/10 transition hover:-translate-y-1"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-400 text-black flex items-center justify-center text-xl font-black">
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
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <img src={appImage} alt="app" className="w-full max-h-[420px] object-cover" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-200 font-black text-sm">
              Exclusiu socis/es
            </div>

            <h2 className="mt-4 text-3xl font-black text-slate-900">{appTitle}</h2>
            <p className="mt-3 text-slate-700">{appText}</p>

            <div className="mt-6 space-y-3">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 h-7 w-7 rounded-full bg-yellow-400 flex items-center justify-center font-black">
                    ✓
                  </div>
                  <div className="text-slate-900 font-bold">{b}</div>
                </div>
              ))}
            </div>

            {!currentUser && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="px-7 py-3 rounded-2xl bg-black text-yellow-300 font-black hover:bg-black/90 transition">
                  Sol·licitar accés
                </Link>
                <Link to="/login" className="px-7 py-3 rounded-2xl border border-slate-300 bg-white font-black hover:bg-slate-50 transition text-center">
                  Ja tinc compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACTE (requadres de baix) */}
      <section className="py-14 bg-[#0b1730]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-yellow-400 text-black flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="font-black text-lg">On som</div>
                  <div className="text-white/80 text-sm mt-2">
                    Carrer Trullets, 26 baixos · 25126 Almenar, Lleida
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-yellow-400 text-black flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="font-black text-lg">Telèfons</div>
                  <div className="text-white/80 text-sm mt-2">
                    625 57 22 00 · 644 79 40 11
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-yellow-400 text-black flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="font-black text-lg">Correus</div>
                  <div className="text-white/80 text-sm mt-2">
                    natacioalmenar@gmail.com
                  </div>
                  <div className="text-white/80 text-sm">thewestdivers@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-white/60 text-xs">
            © {new Date().getFullYear()} West Divers · App del club
          </div>
        </div>
      </section>
    </div>
  );
};
