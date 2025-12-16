import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { clubSettings, currentUser, canManageSystem } = useApp();

  const heroBg = useMemo(() => {
    // Prioritat: appBackgroundUrl (panell admin) -> homeHeroImageUrl (si existeix) -> fallback
    const anySettings = clubSettings as any;
    return (
      (clubSettings?.appBackgroundUrl || "").trim() ||
      (anySettings?.homeHeroImageUrl || "").trim() ||
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=70"
    );
  }, [clubSettings]);

  const heroTitle = (clubSettings?.heroTitle || "WEST DIVERS").trim();
  const heroSub = (clubSettings as any)?.heroSubtitle?.trim?.() || "El teu club de busseig per excel·lència.";

  const navbarPreTitle = (clubSettings?.navbarPreTitle || "CLUB DE BUSSEIG").trim();
  const logoUrl = (clubSettings?.logoUrl || "/westdivers-logo.png").trim();

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
    "Els socis i sòcies tenen accés exclusiu a la nostra aplicació privada.";

  const bullets: string[] = useMemo(() => {
    const anySettings = clubSettings as any;
    const fromDb = anySettings?.homeBullets;
    if (Array.isArray(fromDb) && fromDb.length) return fromDb.filter(Boolean);
    return [
      "Inscripció a sortides amb un sol clic",
      "Registre digital de titulacions i assegurança",
      "Comunitat i xarrades exclusives",
    ];
  }, [clubSettings]);

  const goPanel = () => {
    if (currentUser) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img src={logoUrl} alt="logo" className="h-9 w-9 rounded-md bg-white object-contain" />
            <div className="leading-tight min-w-0">
              <div className="text-[10px] opacity-80 font-bold tracking-wider">{navbarPreTitle}</div>
              <div className="text-sm font-extrabold tracking-wide truncate">{heroTitle}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <button onClick={() => navigate("/")} className="opacity-90 hover:opacity-100">
              Inici
            </button>
            <button onClick={() => navigate("/trips")} className="opacity-90 hover:opacity-100">
              Sortides
            </button>
            <button onClick={() => navigate("/courses")} className="opacity-90 hover:opacity-100">
              Cursos
            </button>
            <button onClick={() => navigate("/social-events")} className="opacity-90 hover:opacity-100">
              Esdeveniments
            </button>
            <button onClick={() => navigate("/help")} className="opacity-90 hover:opacity-100">
              Ajuda
            </button>

            {canManageSystem?.() ? (
              <button
                onClick={() => navigate("/admin")}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15"
              >
                Gestió
              </button>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={goPanel}
              className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-extrabold hover:bg-yellow-500"
            >
              {currentUser ? "Panell" : "Accés Socis/es"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div
          className="h-[560px] w-full"
          style={{
            backgroundImage: `url("${heroBg}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight">
                {heroTitle}
              </h1>
              <p className="mt-4 text-white/90 text-lg">{heroSub}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={goPanel}
                  className="px-6 py-3 rounded-2xl bg-yellow-400 text-black font-extrabold hover:bg-yellow-500"
                >
                  {currentUser ? "Entrar al panell" : "Accés Socis/es"}
                </button>

                <a
                  href="mailto:thewestdivers@gmail.com"
                  className="px-6 py-3 rounded-2xl bg-white/10 text-white font-extrabold hover:bg-white/15 text-center"
                >
                  Contacta’ns
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIALITATS (secció decorativa) */}
      <section className="bg-[#0b1730] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 text-center">
            ESPECIALITATS FECDAS / CMAS
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Nitrox", desc: "Busseja més temps amb més seguretat.", icon: "O2" },
              { title: "Profunda", desc: "Descobreix què s’amaga a més profunditat.", icon: "⚓" },
              { title: "Vestit Sec", desc: "Submergeix-te tot l’any sense passar fred.", icon: "🛡️" },
              { title: "Salvament", desc: "Aprèn a gestionar situacions d’emergència.", icon: "👥" },
            ].map((c) => (
              <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/40 flex items-center justify-center text-xl font-extrabold">
                  {c.icon}
                </div>
                <div className="mt-4 font-extrabold text-lg">{c.title}</div>
                <div className="mt-2 text-sm text-white/80">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src={appImage}
              alt="app"
              className="w-full max-h-[420px] object-cover rounded-3xl border"
            />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{appTitle}</h2>
            <p className="mt-3 text-gray-700">{appText}</p>

            <div className="mt-6 space-y-3">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 h-7 w-7 rounded-full bg-yellow-400 flex items-center justify-center font-extrabold">
                    ✓
                  </div>
                  <div className="text-slate-800 font-bold">{b}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/register" className="text-blue-600 font-extrabold hover:underline">
                Sol·licita el teu accés →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-extrabold text-lg">WEST DIVERS</div>
            <div className="text-white/70 mt-2 text-sm">
              El club de referència a les terres de Lleida per als amants del món subaquàtic.
              Formació, sortides i bon ambient.
            </div>
          </div>

          <div>
            <div className="font-extrabold text-lg">Contacte</div>
            <div className="text-white/70 mt-2 text-sm space-y-1">
              <div>📍 Carrer Trullets, 26 baixos · 25126 Almenar, Lleida</div>
              <div>📞 625 57 22 00 · 644 79 40 11</div>
              <div>✉️ natacioalmenar@gmail.com</div>
              <div>✉️ thewestdivers@gmail.com</div>
            </div>
          </div>

          <div>
            <div className="font-extrabold text-lg">Enllaços</div>
            <div className="text-white/70 mt-2 text-sm space-y-2">
              <Link to="/login" className="block hover:underline">
                Àrea Privada
              </Link>
              <a className="block hover:underline" href="#/">
                FECDAS
              </a>
              <a className="block hover:underline" href="#/">
                CMAS
              </a>
              <div className="text-white/40 text-xs pt-2">© {new Date().getFullYear()} West Divers</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
