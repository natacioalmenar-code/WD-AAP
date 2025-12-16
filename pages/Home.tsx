import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Home: React.FC = () => {
  const { clubSettings } = useApp();

  // ✅ HERO
  const heroBg =
    clubSettings.homeHeroImageUrl ||
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=80"; // mar suau

  const heroTitle = clubSettings.heroTitle || "WEST DIVERS";
  const heroSubtitle =
    clubSettings.heroSubtitle || "El teu club de busseig per excel·lència.";

  const primaryText = clubSettings.heroPrimaryButtonText || "Accés Socis/es";
  const primaryHref = clubSettings.heroPrimaryButtonHref || "/login";

  const secondaryText = clubSettings.heroSecondaryButtonText || "Contacta'ns";
  const secondaryHref = clubSettings.heroSecondaryButtonHref || "#contacte";

  // ✅ SECTION
  const sectionTitle =
    clubSettings.homeSectionTitle || "Tot el teu busseig, en una sola App";
  const sectionText =
    clubSettings.homeSectionText ||
    "Els socis i sòcies tenen accés exclusiu a la nostra aplicació privada.";

  const sectionImg =
    clubSettings.homeSectionImageUrl ||
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80";

  const b1t = clubSettings.homeBullet1Title || "Inscripció a sortides amb un sol clic";
  const b1x = clubSettings.homeBullet1Text || "Apunta’t fàcilment i controla participants.";
  const b2t = clubSettings.homeBullet2Title || "Registre digital de titulacions i assegurança";
  const b2x = clubSettings.homeBullet2Text || "Tot el teu perfil i certificacions sempre a mà.";
  const b3t = clubSettings.homeBullet3Title || "Comunitat i xarrades exclusives";
  const b3x = clubSettings.homeBullet3Text || "Mur social i comunicacions del club.";

  const ctaText = clubSettings.homeCtaText || "Sol·licita el teu accés →";
  const ctaHref = clubSettings.homeCtaHref || "/register";

  const isInternalLink = (href: string) => href.startsWith("/");

  const HeroButton = ({ href, children, primary }: any) => {
    if (isInternalLink(href)) {
      return (
        <Link
          to={href}
          className={
            primary
              ? "px-6 py-3 rounded-full font-extrabold bg-yellow-400 text-black hover:bg-yellow-300 transition"
              : "px-6 py-3 rounded-full font-extrabold border border-white/60 text-white hover:bg-white/10 transition"
          }
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={
          primary
            ? "px-6 py-3 rounded-full font-extrabold bg-yellow-400 text-black hover:bg-yellow-300 transition"
            : "px-6 py-3 rounded-full font-extrabold border border-white/60 text-white hover:bg-white/10 transition"
        }
      >
        {children}
      </a>
    );
  };

  return (
    <div className="w-full">
      {/* HERO */}
      <section
        className="relative"
        style={{
          backgroundImage: `url("${heroBg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay perquè el text sempre es llegeixi bé */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight">
              {heroTitle}
            </h1>
            <p className="mt-4 text-white/90 text-lg">{heroSubtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <HeroButton href={primaryHref} primary>
                {primaryText}
              </HeroButton>
              <HeroButton href={secondaryHref}>{secondaryText}</HeroButton>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{sectionTitle}</h2>
            <p className="mt-3 text-gray-700">{sectionText}</p>

            <div className="mt-6 space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0" />
                <div>
                  <div className="font-extrabold">{b1t}</div>
                  <div className="text-sm text-gray-600">{b1x}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0" />
                <div>
                  <div className="font-extrabold">{b2t}</div>
                  <div className="text-sm text-gray-600">{b2x}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0" />
                <div>
                  <div className="font-extrabold">{b3t}</div>
                  <div className="text-sm text-gray-600">{b3x}</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {isInternalLink(ctaHref) ? (
                <Link to={ctaHref} className="text-blue-700 font-extrabold hover:underline">
                  {ctaText}
                </Link>
              ) : (
                <a href={ctaHref} className="text-blue-700 font-extrabold hover:underline">
                  {ctaText}
                </a>
              )}
            </div>
          </div>

          <div className="w-full">
            <img
              src={sectionImg}
              alt="imatge secció"
              className="w-full rounded-3xl border shadow-sm object-cover"
            />
          </div>
        </div>
      </section>

      {/* ANCLA CONTACTE (si el fas servir al footer o més avall) */}
      <div id="contacte" />
    </div>
  );
};

