import React from "react";

export const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">Ajuda</h1>
      <p className="text-gray-600 mt-2">
        Guia ràpida per a usar l’app del club.
      </p>

      <div className="mt-8 space-y-6">
        <section className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Socis/es</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Registra’t amb el teu correu (accés socis/es).</li>
            <li>L’administració aprovarà el teu compte i et posarà el rol.</li>
            <li>Quan estigues actiu/va, podràs apuntar-te a sortides/cursos/esdeveniments.</li>
            <li>Pots usar el <b>Mur social</b> per compartir informació.</li>
          </ul>
        </section>

        <section className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Instructors/es</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Pots crear i gestionar sortides/cursos/esdeveniments.</li>
            <li>Pots afegir material al repositori del club.</li>
            <li>No pots canviar rols d’usuaris ni la configuració web (això és admin).</li>
          </ul>
        </section>

        <section className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Administració</h2>
          <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
            <li>Aprovar socis/es i assignar rols (admin / instructor / member).</li>
            <li>Modificar configuració de la web (logo, títols, fons).</li>
            <li>Eliminar contingut quan siga necessari.</li>
          </ul>
        </section>

        <section className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Contacte</h2>
          <p className="mt-2 text-gray-700">
            Si tens dubtes, contacta amb l’administració del club.
          </p>
        </section>
      </div>
    </div>
  );
};
