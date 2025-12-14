import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <span className="font-extrabold text-slate-900">WEST DIVERS</span>{" "}
          <span className="text-gray-500">· App del club</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link className="hover:underline font-bold" to="/help">
            Ajuda
          </Link>
          <Link className="hover:underline font-bold" to="/privacy">
            Privacitat
          </Link>
          <Link className="hover:underline font-bold" to="/terms">
            Termes
          </Link>
          <Link className="hover:underline font-bold" to="/cookies">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
};
