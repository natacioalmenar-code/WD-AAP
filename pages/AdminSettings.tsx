
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Image, Type } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { clubSettings, updateClubSettings, canManageSystem } = useApp();
  
  // Local state to handle form inputs
  const [formData, setFormData] = useState(clubSettings);

  if (!canManageSystem()) {
    return <div className="p-8 text-center text-red-600">Accés denegat.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubSettings(formData);
    alert('Configuració guardada correctament!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Configuració del Club</h1>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Branding Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Image className="text-blue-600" /> Imatges i Logo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">URL del Logo</label>
                        <input 
                            type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange}
                            className="w-full border rounded p-2 text-sm" placeholder="https://..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Es recomana una imatge PNG transparent.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Fons de l'App (Textura)</label>
                        <input 
                            type="text" name="appBackgroundUrl" value={formData.appBackgroundUrl} onChange={handleChange}
                            className="w-full border rounded p-2 text-sm" placeholder="https://..."
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Imatge Portada (Inici)</label>
                        <input 
                            type="text" name="homeHeroImageUrl" value={formData.homeHeroImageUrl} onChange={handleChange}
                            className="w-full border rounded p-2 text-sm" placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Text Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Type className="text-yellow-500" /> Textos i Frases
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pre-Títol Menú</label>
                        <input 
                            type="text" name="navbarPreTitle" value={formData.navbarPreTitle} onChange={handleChange}
                            className="w-full border rounded p-2 text-sm" placeholder="CLUB DE BUSSEIG"
                        />
                        <p className="text-xs text-gray-500 mt-1">Text petit a sobre del nom del club.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Títol Principal</label>
                        <input 
                            type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange}
                            className="w-full border rounded p-2 text-sm" placeholder="WEST DIVERS"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-1">Subtítol / Frase Motivadora</label>
                        <input 
                            type="text" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange}
                            className="w-full border rounded p-2 text-sm" placeholder="Passió pel blau..."
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                    <Save size={20} /> Guardar Configuració
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};