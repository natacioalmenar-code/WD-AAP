import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Waves,
  GraduationCap,
  Users,
  CalendarDays,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
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
    "Club de busseig. Formació oficial. Sortides i comunitat.";

  const goPanel = () => {
    if (currentUser) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="bg-slate-50">
      {/* ================= HERO PREMIUM ================= */}
      <section className="relative overflow-hidden">
        {/* Imatge */}
        <div
          className="h-[620px] w-full"
          style={{
            backgroundImage: `url("${heroBg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#081428]/90 via-[#0b1730]/70 to-black/90" />

        {/* Pattern subtil */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Contingut */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-white/90 text-sm font-bold">
                <ShieldCheck size={16} />
                Àrea privada per socis/es
              </div>

              <h1 className="mt-5 text-white text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                {heroTitle}
              </h1>

              <p className="mt-4 text-white/85 text-lg leading-relaxed">
                {heroSub}
              </p>

              {/* CTA */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={goPanel}
                  className="px-8 py-3 rounded-2xl bg-yellow-400 text-black font-black text-lg
                             hover:bg-yellow-500 hover:scale-[1.03] transition shadow-xl"
                >
                  {currentUser ? "Entrar al panell" : "Accés Socis/es"}
                </button>

                {!currentUser && (
                  <Link
                    to="/register"
                    className="px-8 py-3 rounded-2xl border-2 border-yellow-400 text-yellow-300 font-black text-lg
                               hover:bg-yellow-400 hover:text-black transition text-center"
                  >
                    Sol·licitar accés <ArrowRight className="inline-block ml-2" size={18} />
                  </Link>
                )}
              </div>

              {/* Feature cards */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    title: "Sortides",
                    desc: "Inscripció ràpida i gestió de places.",
                    icon: <Waves size={20} />,
                  },
                  {
                    title: "Formació",
                    desc: "Cursos FECDAS / CMAS i especialitats.",
                    icon: <GraduationCap size={20} />,
                  },
                  {
                    title: "Comunitat",
                    desc: "Esdeveniments, mur i activitats.",
                    icon: <Users size={20} />,
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl p-6 bg-white/10 border border-white/20 backdrop-blur
                               hover:bg-white/20 transition hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4 text-white">
                      <div className="h-12 w-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center">
                        {c.icon}
                      </div>
                      <div>
                        <div className="font-black text-lg">{c.title}</div>
                        <div className="text-white/80 text-sm mt-1">{c.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(canManageSystem?.() ?? false) && (
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/admin-users")}
                    className="text-white/70 text-sm hover:text-yellow-300 transition"
                  >
                    Accés administració
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= LINKS CENTRALS ================= */}
      <section className="py-14 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Ajuda", desc: "Preguntes i suport.", icon: <LifeBuoy size={22} />, action: () => navigate("/help") },
              { title: "Calendari", desc: "Activitats i planificació.", icon: <CalendarDays size={22} />, action: () => navigate("/calendar") },
              { title: "Cursos", desc: "Formació i especialitats.", icon: <GraduationCap size={22} />, action: () => navigate("/courses-public") },
              { title: "Contacte", desc: "Escriu-nos.", icon: <Mail size={22} />, action: () => (window.location.href = "mailto:thewestdivers@gmail.com") },
            ].map((it) => (
              <button
                key={it.title}
                onClick={it.action}
                className="relative bg-white rounded-2xl p-6 text-left border border-slate-200
                           hover:shadow-lg transition"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-yellow-400 rounded-t-2xl" />
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-black text-yellow-300 flex items-center justify-center">
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

      {/* ================= CONTACTE ================= */}
      <section className="py-16 bg-[#0b1730]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "On som",
                icon: <MapPin size={22} />,
                text: "Carrer Trullets, 26 baixos · 25126 Almenar, Lleida",
              },
              {
                title: "Telèfons",
                icon: <Phone size={22} />,
                text: "625 57 22 00 · 644 79 40 11",
              },
              {
                title: "Correus",
                icon: <Mail size={22} />,
                text: "thewestdivers@gmail.com",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-white"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center">
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-black text-lg">{c.title}</div>
                    <div className="text-white/80 text-sm mt-2">{c.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-white/50 text-xs">
            © {new Date().getFullYear()} West Divers · App del club
          </div>
        </div>
      </section>
    </div>
  );
};
