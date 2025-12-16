import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Home: React.FC = () => {
  const { clubSettings } = useApp();

  // ✅ valors segurs (mai undefined)
  const s = useMemo(() => {
    return {
      logoUrl: clubSettings?.logoUrl || "/westdivers-logo.png",
      navbarPreTitle: clubSettings?.navbarPreTitle || "CLUB DE BUSSEIG",
      heroTitle: clubSettings?.heroTitle || "WEST DIVERS",
      appBackgroundUrl: clubSettings?.appBackgroundUrl || "",
      homeHeroImageUrl: (clubSettings as any)?.homeHeroImageUrl || "", // per si encara no existeix al tipus
      homeTitle: (clubSettings as any)?.homeTitle || "El teu club de busseig per excel·lència.",
      homeCtaPrimary: (clubSettings as any)?.homeCtaPrimary || "Accés Socis/es",
      homeCtaSecondary: (clubSettings as any)?.homeCtaSecondary || "Contacta'ns",
      homeImageUrl: (clubSettings as any)?.homeImageUrl || "",
      homeFeature1: (clubSettings as any)?.homeFeature1 || "Inscripció a sortides amb un sol clic",
      homeFeature2: (clubSettings as any)?.homeFeature2 || "Registre digital de titulacions i assegurança",
      homeFeature3: (clubSettings as any)?.homeFeature3 || "Comunitat i xarrades exclusives",
    };
  }, [clubSettings]);

  const heroBg = s.homeHeroImageUrl || s.appBackgroundUrl;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section
        className="relative min-h-[520px] flex items-center justify-center"
        style={{
          backgroundImage: heroBg ? `url(${heroBg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay perquè el text es lligui bé */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src={s.logoUrl}
              alt="West Divers"
              className="w-14 h-14 rounded-full bg-white/10 border border-white/20 object-contain"
            />
            <div className="text-left">
              <div className="text-xs font-extrabold tracking-widest text-white/90">
                {s.navbarPreTitle}
              </div>
              <div className="text-xl font-extrabold text-white">{s.heroTitle}</div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {s.homeTitle}
          </h1>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-extrabold bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {s.homeCtaPrimary}
            </Link>

            <a
              href="mailto:thewestdivers@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-extrabold border-2 border-white text-white hover:bg-white/10"
            >
              {s.homeCtaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* CONTINGUT */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div className="bg-white border rounded-3xl p-7 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Tot el teu busseig, en una sola App
          </h2>

          <p className="text-slate-600 mt-3">
            Els socis i sòcies tenen accés exclusiu a la nostra aplicació privada.
          </p>

          <ul className="mt-6 space-y-3">
            <li className="flex gap-3">
              <span className="w-9 h-9 rounded-full bg-yellow-400/30 flex items-center justify-center font-extrabold">✓</span>
              <span className="font-bold text-slate-900">{s.homeFeature1}</span>
            </li>
            <li className="flex gap-3">
              <span className="w-9 h-9 rounded-full bg-yellow-400/30 flex items-center justify-center font-extrabold">✓</span>
              <span className="font-bold text-slate-900">{s.homeFeature2}</span>
            </li>
            <li className="flex gap-3">
              <span className="w-9 h-9 rounded-full bg-yellow-400/30 flex items-center justify-center font-extrabold">✓</span>
              <span className="font-bold text-slate-900">{s.homeFeature3}</span>
            </li>
          </ul>

          <div className="mt-6">
            <Link to="/register" className="text-blue-600 font-extrabold hover:underline">
              Sol·licita el teu accés →
            </Link>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border shadow-sm bg-gray-100">
          {s.homeImageUrl ? (
            <img
              src={s.homeImageUrl}
              alt="Imatge"
              className="w-full h-[340px] object-cover"
            />
          ) : (
            <div className="w-full h-[340px] flex items-center justify-center text-slate-500 font-bold">
              (Encara no hi ha imatge configurada)
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
