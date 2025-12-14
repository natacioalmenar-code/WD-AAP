import React from "react";

export const Cookies: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">Política de cookies</h1>
      <p className="text-gray-600 mt-2">
        Informació bàsica.
      </p>

      <div className="mt-6 bg-white border rounded-2xl p-6 shadow-sm space-y-4 text-gray-700 leading-relaxed">
        <p>
          L’aplicació pot usar cookies o emmagatzematge local per mantenir la sessió iniciada i millorar l’experiència.
        </p>
        <p>
          No s’utilitzen cookies publicitàries. Les cookies són principalment tècniques.
        </p>
      </div>
    </div>
  );
};
