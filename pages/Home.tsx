import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

type Bullet = { title: string; desc: string };

function safeStr(v: any, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function safeUrl(v: any, fallback = "") {
  const s = safeStr(v, fallback).trim();
  return s;
}

function safeBullets(v: any): Bullet[] {
  if (Array.isArray(v)) {
    return v
      .map((x) => ({
        title: safeStr(x?.title, "").trim(),
        desc: safeStr(x?.desc, "").trim(),
      }))
      .filter((b) => b.title || b.desc);
  }
  return [];
}

export const Home: React.FC = () => {
  const { clubSettings } = useApp();

  // ✅ tot amb fallback per NO petar mai
  const heroTitle = safeStr((clubSettings as any)?.heroTitle, "WEST DIVERS");
  const heroSubtitle = safeStr(
    (clubSettings as any)?.heroSubtitle,
    "El teu club de busseig per excel·lència."
  );

  // Fons hero (gris -> imatge)
  const heroBackgroundUrl = safeUrl((clubSettings as any)?.homeHeroImageUrl, "");
  // Imatge de la secció (la gran de baix)
  const homeImageUrl = safeUrl((clubSettings as any)?.homeImageUrl, "");

  const ctaPrimaryText = safeStr((clubSettings as any)?.homeCtaPrimaryText, "Accés Socis/es");
  const ctaPrimaryLink = safeStr((clubSettings as any)?.homeCtaPrimaryLink, "/login");
  const ctaSecondaryText = safeStr((clubSettings as any)?.homeCtaSecondaryText, "Contacta'ns");
  const ctaSecondaryLink = safeStr((clubSettings as any)?.homeCtaSecondaryLink, "#contacte");

  const bullets: Bullet[] = useMemo(() => {
    const fromSettings = safeBullets((clubSettings as any)?.homeBullets);
    if (fromSettings.length) return fromSettings;
    // fallback si encara no tens res a Firestore
    return [
      { title: "Inscripció a sortides amb un sol clic", desc: "" },
      { title: "Registre digital de titulacions i assegurança", desc: "" },
      { title: "Comunitat i xarrades exclusives", desc: "" },
    ];
  }, [clubSettings]);

  return (
    <div className="w-full">
      {/* HERO */}
      <section
        className="relative w-full"
        style={{
          minHeight: "70vh",
          backgroundImage: heroBackgroundUrl ? `url(${heroBackgroundUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay perquè el text es llegeixi */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 flex items-center" style={{ minHeight: "70vh" }}>
          <div className="max-w-2xl">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight">
              {heroTitle}
            </h1>
            <p className="text-white/90 mt-4 text-lg md:text-xl">
              {heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={ctaPrimaryLink}
                className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-extrabold bg-yellow-400 text-black hover:bg-yellow-500 transition"
              >
                {ctaPrimaryText}
              </Link>

              {/* si és un hash (#contacte) fem <a>, si és ruta fem Link */}
              {ctaSecondaryLink.startsWith("#") ? (
                <a
                  href={ctaSecondaryLink}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-extrabold bg-white/10 text-white border border-white/25 hover:bg-white/15 transition"
                >
                  {ctaSecondaryText}
                </a>
              ) : (
                <Link
                  to={ctaSecondaryLink}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-extrabold bg-white/10 text-white border border-white/25 hover:bg-white/15 transition"
                >
                  {ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓ INFO */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden border bg-white shadow-sm">
            {homeImageUrl ? (
              <img src={homeImageUrl} alt="Imatge home" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full aspect-[16/10] bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                (Pots posar una imatge des del panell d’admin)
              </div>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {safeStr((clubSettings as any)?.homeSectionTitle, "Tot el teu busseig, en una sola App")}
            </h2>
            <p className="text-gray-600 mt-3">
              {safeStr(
                (clubSettings as any)?.homeSectionSubtitle,
                "Els socis i sòcies tenen accés exclusiu a la nostra aplicació privada."
              )}
            </p>

            <div className="mt-6 space-y-3">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-9 h-9 rounded-xl bg-yellow-400/90 flex items-center justify-center font-extrabold">
                    ✓
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">{b.title}</div>
                    {b.desc ? <div className="text-sm text-gray-600 mt-1">{b.desc}</div> : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/register" className="text-blue-700 font-extrabold hover:underline">
                {safeStr((clubSettings as any)?.homeLinkText, "Sol·licita el teu accés →")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ANCLA CONTACTE (per el botó Contacta'ns) */}
      <div id="contacte" />
    </div>
  );
};
