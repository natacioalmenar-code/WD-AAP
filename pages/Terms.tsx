import React from "react";

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">Termes d’ús</h1>
      <p className="text-gray-600 mt-2">
        Condicions bàsiques d’ús intern per al club.
      </p>

      <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm space-y-4 text-gray-700 leading-relaxed">
        <p>
          Aquesta aplicació és d’ús intern del club i està destinada a socis/es i personal autoritzat.
        </p>
        <p>
          L’usuari es compromet a usar el Mur Social amb respecte i a no publicar contingut ofensiu, il·legal o
          que vulneri drets de tercers.
        </p>
        <p>
          L’administració pot moderar contingut i gestionar accessos per garantir el bon funcionament.
        </p>
      </div>
    </div>
  );
};
