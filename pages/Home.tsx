import React from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const { clubSettings } = useApp();

  // ✅ valors per defecte (MAI peta)
  const heroTitle =
    clubSettings?.heroTitle || "El teu club de busseig per excel·lència.";
  const heroSubtitle =
    clubSettings?.heroSubtitle ||
    "Els socis i sòcies tenen accés exclusiu a la nostra aplicació privada.";

  const heroBg =
    clubSettings?.appBackgroundUrl ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  const homeImage =
    clubSettings?.homeHeroImageUrl ||
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

  return (
    <div className="w-full">
      {/* HERO */}
      <section
        className="min-h-[70vh] flex items-center justify-center text-center text-white px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            {heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-extrabold hover:bg-yellow-500"
            >
              Accés Socis/es
            </Link>
            <a
              href="#contacte"
              className="px-6 py-3 rounded-xl border border-white font-extrabold hover:bg-white hover:text-black"
            >
              Contacta’ns
            </a>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <img
          src={homeImage}
          alt="Busseig"
          className="rounded-2xl shadow-lg w-full"
        />

        <div>
          <h2 className="text-3xl font-extrabold mb-4">
            Tot el teu busseig, en una sola App
          </h2>

          <ul className="space-y-3 text-gray-700">
            <li>📅 Inscripció a sortides amb un sol clic</li>
            <li>📘 Registre digital de titulacions i assegurança</li>
            <li>👥 Comunitat i xerrades exclusives</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
