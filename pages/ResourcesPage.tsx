
import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Film, Link as LinkIcon, Download, Map } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { resources, currentUser } = useApp();

  // Categories
  const categories = {
    manual: 'Manuals i Guies',
    table: 'Taules i Planificació',
    map: 'Mapes i Topografies',
    form: 'Documentació Administrativa'
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" />;
      case 'video': return <Film className="text-blue-500" />;
      case 'image': return <Map className="text-green-500" />;
      default: return <LinkIcon className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Biblioteca del Club</h1>
        <p className="text-gray-600 mt-2">Material didàctic, guies i documentació tècnica per als socis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(categories).map(([catKey, catTitle]) => {
          const catResources = resources.filter(r => r.category === catKey);
          
          if (catResources.length === 0) return null;

          return (
            <div key={catKey} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h2 className="font-bold text-blue-900 text-lg">{catTitle}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {catResources.map(res => (
                  <div key={res.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                    <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                      {getIcon(res.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{res.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{res.description}</p>
                      {res.levelRequired && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded mr-2">
                          Req: {res.levelRequired}
                        </span>
                      )}
                    </div>
                    <a 
                      href={res.url} 
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                      title="Descarregar / Veure"
                    >
                      <Download size={20} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
