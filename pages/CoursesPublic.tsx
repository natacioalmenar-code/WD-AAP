import React from "react";
import { Link } from "react-router-dom";

export const CoursesPublic: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Cursos</h1>
        <p className="text-gray-600 mt-2">
          Aquesta és la pàgina pública de cursos. (La llista la connectarem a Firestore quan el deploy
          torne a estar estable.)
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-black text-white font-extrabold hover:bg-gray-900"
          >
            Tornar a l’inici
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-extrabold hover:bg-yellow-500"
          >
            Accés socis/es
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesPublic;
