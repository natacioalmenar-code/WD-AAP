import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, FileText, ExternalLink } from "lucide-react";

export const ResourcesPage: React.FC = () => {
  const { resources, canManageTrips } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = resources.map((r) => r.category);
    return ["all", ...Array.from(new Set(cats))];
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (selectedCategory === "all") return resources;
    return resources.filter((r) => r.category === selectedCategory);
  }, [resources, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <h1 className="text-3xl font-extrabold">Material del club</h1>

        {canManageTrips() && (
          <button
            onClick={() => alert("Formulari d’alta de material (seguent pas)")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 font-extrabold hover:bg-yellow-300"
          >
            <Plus size={18} /> Afegir material
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat === "all" ? "Totes" : cat}
          </button>
        ))}
      </div>

      {/* Llistat */}
      {filteredResources.length === 0 ? (
        <div className="text-gray-500">
          No hi ha material en aquesta categoria.
        </div>
      ) : (

