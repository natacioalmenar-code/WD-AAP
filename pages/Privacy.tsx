import React from "react";

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">Política de privacitat</h1>
      <p className="text-gray-600 mt-2">
        Text base (pots adaptar-lo amb dades del club).
      </p>

      <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm space-y-4 text-gray-700 leading-relaxed">
        <p>
          Aquesta aplicació gestiona informació necessària per a l’activitat del club
          (registre de socis/es, participació en activitats i comunicació interna).
        </p>
        <p>
          Les dades s’utilitzen només amb finalitats organitzatives del club i no es venen ni es cedeixen a tercers.
        </p>
        <p>
          Pots sol·licitar la rectificació o eliminació de les teues dades contactant amb l’administració.
        </p>
      </div>
    </div>
  );
};
