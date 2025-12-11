
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Award, ShieldCheck, Activity, Save, Settings, AlertTriangle, Trash2, Plus, CreditCard, Camera } from 'lucide-react';
import { GearItem } from '../types';

export const Profile: React.FC = () => {
  const { currentUser, addUserGearItem, removeUserGearItem, updateUserDocs, updateUserProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'gear' | 'docs'>('overview');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Local state for new gear item
  const [newGearType, setNewGearType] = useState('Màscara');
  const [newGearDesc, setNewGearDesc] = useState('');

  // Local state for docs editing
  const [docsForm, setDocsForm] = useState({
    licenseNumber: '',
    insuranceCompany: '',
    insurancePolicy: '',
    insuranceExpiry: '',
    medicalCertExpiry: ''
  });

  useEffect(() => {
    if (currentUser) {
        setDocsForm({
            licenseNumber: currentUser.licenseNumber || '',
            insuranceCompany: currentUser.insuranceCompany || '',
            insurancePolicy: currentUser.insurancePolicy || '',
            insuranceExpiry: currentUser.insuranceExpiry || '',
            medicalCertExpiry: currentUser.medicalCertExpiry || ''
        });
        setAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const isExpired = (dateString?: string) => {
    if (!dateString) return true;
    return new Date(dateString) < new Date();
  };

  const handleAddGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGearDesc) return;
    const newItem: GearItem = {
        id: `g${Date.now()}`,
        type: newGearType,
        description: newGearDesc
    };
    addUserGearItem(newItem);
    setNewGearDesc('');
  };

  const handleSaveDocs = (e: React.FormEvent) => {
      e.preventDefault();
      updateUserDocs(docsForm);
      alert("Documentació actualitzada correctament.");
  };

  const handleSaveAvatar = () => {
      updateUserProfile({ avatarUrl });
      setIsEditingAvatar(false);
  };

  const gearTypes = [
      "Màscara", "Aletes", "Vestit", "Regulador", "Jacket/Ala", 
      "Ordinador", "Llanterna/Foco", "Càmera", "Llast", "Ganivet", "Altres"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <img 
            src={currentUser.avatarUrl} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-md"
          />
          <button 
            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
            className="absolute bottom-0 right-0 bg-slate-900 text-yellow-400 p-2 rounded-full hover:scale-110 transition-transform cursor-pointer"
            title="Canviar Foto"
          >
            <Camera size={16} />
          </button>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{currentUser.name}</h1>
          <p className="text-gray-500 text-lg mb-2">{currentUser.email}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
             <span className="bg-slate-900 text-white px-3 py-1 rounded text-sm font-bold tracking-wide">
               {currentUser.level}
             </span>
             {currentUser.role !== 'Soci' && (
                <span className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold tracking-wide uppercase">
                    {currentUser.role}
                </span>
             )}
          </div>
          
          {isEditingAvatar && (
              <div className="mt-4 flex gap-2 animate-fade-in-down">
                  <input 
                    type="text" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="URL de la imatge..."
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-64"
                  />
                  <button onClick={handleSaveAvatar} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">Guardar</button>
              </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
            <div className="text-center">
                <p className="text-3xl font-extrabold text-blue-600">{currentUser.diveCount || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Immersions</p>
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-gray-800 mt-2">{currentUser.lastDiveDate || '-'}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Última</p>
            </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-8 hide-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${activeTab === 'overview' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Resum
        </button>
        <button 
          onClick={() => setActiveTab('docs')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${activeTab === 'docs' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Documentació
        </button>
        <button 
          onClick={() => setActiveTab('gear')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${activeTab === 'gear' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          El Meu Equip
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Digital Card */}
             <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden h-56 flex flex-col justify-between">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg tracking-widest">FECDAS / CMAS</h3>
                        <p className="text-blue-200 text-sm">International Diver Card</p>
                    </div>
                    <img src="https://cdn-icons-png.flaticon.com/512/3284/3284680.png" className="w-12 h-12 opacity-80 invert" alt="Logo" />
                </div>
                <div>
                    <p className="text-2xl font-bold uppercase tracking-wider mb-1">{currentUser.level}</p>
                    <p className="text-sm opacity-75">{currentUser.name}</p>
                    <p className="text-xs opacity-50 mt-4">ID: WD-{currentUser.id.toUpperCase()}</p>
                </div>
             </div>

             {/* Specialties */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="text-yellow-500" /> Especialitats
                </h3>
                {currentUser.specialties && currentUser.specialties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {currentUser.specialties.map(spec => (
                            <span key={spec} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                                {spec}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No tens especialitats registrades.</p>
                )}
             </div>
          </div>
        )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Status Cards */}
                <div className="space-y-4">
                    <div className={`p-6 rounded-xl border-l-4 shadow-sm ${isExpired(currentUser.insuranceExpiry) ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheck size={20}/> Assegurança
                            </h3>
                            {isExpired(currentUser.insuranceExpiry) ? (
                                <span className="text-red-600 text-xs font-bold uppercase border border-red-200 px-2 py-1 rounded bg-white">Caducada</span>
                            ) : (
                                <span className="text-green-600 text-xs font-bold uppercase border border-green-200 px-2 py-1 rounded bg-white">Vigent</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">Companyia: <span className="font-semibold">{currentUser.insuranceCompany || '-'}</span></p>
                        <p className="text-sm text-gray-600">Núm: <span className="font-mono">{currentUser.insurancePolicy || '-'}</span></p>
                        <p className="text-xl font-mono font-bold text-gray-800 mt-2">{currentUser.insuranceExpiry || 'No registrada'}</p>
                    </div>

                    <div className={`p-6 rounded-xl border-l-4 shadow-sm ${isExpired(currentUser.medicalCertExpiry) ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Activity size={20}/> Certificat Mèdic
                            </h3>
                            {isExpired(currentUser.medicalCertExpiry) ? (
                                <span className="text-red-600 text-xs font-bold uppercase border border-red-200 px-2 py-1 rounded bg-white">Caducat</span>
                            ) : (
                                <span className="text-green-600 text-xs font-bold uppercase border border-green-200 px-2 py-1 rounded bg-white">Vigent</span>
                            )}
                        </div>
                        <p className="text-xl font-mono font-bold text-gray-800">{currentUser.medicalCertExpiry || 'No registrat'}</p>
                    </div>

                     <div className="p-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard size={20}/> Llicència Federativa
                            </h3>
                        </div>
                        <p className="text-xl font-mono font-bold text-gray-800">{currentUser.licenseNumber || 'No registrada'}</p>
                    </div>
                </div>

                {/* Editing Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Settings size={20}/> Actualitzar Dades
                    </h3>
                    <form onSubmit={handleSaveDocs} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Núm. Llicència Federativa</label>
                            <input 
                                type="text" 
                                className="w-full border-gray-300 rounded p-2"
                                value={docsForm.licenseNumber}
                                onChange={(e) => setDocsForm({...docsForm, licenseNumber: e.target.value})}
                                placeholder="Ex: CAT-12345"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Companyia Assegurança</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded p-2"
                                    value={docsForm.insuranceCompany}
                                    onChange={(e) => setDocsForm({...docsForm, insuranceCompany: e.target.value})}
                                    placeholder="Ex: DAN, AXA..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Núm. Pòlissa</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded p-2"
                                    value={docsForm.insurancePolicy}
                                    onChange={(e) => setDocsForm({...docsForm, insurancePolicy: e.target.value})}
                                    placeholder="Ex: 00112233"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caducitat Assegurança</label>
                                <input 
                                    type="date" 
                                    className="w-full border-gray-300 rounded p-2"
                                    value={docsForm.insuranceExpiry}
                                    onChange={(e) => setDocsForm({...docsForm, insuranceExpiry: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caducitat Cert. Mèdic</label>
                                <input 
                                    type="date" 
                                    className="w-full border-gray-300 rounded p-2"
                                    value={docsForm.medicalCertExpiry}
                                    onChange={(e) => setDocsForm({...docsForm, medicalCertExpiry: e.target.value})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 mt-2">
                            Guardar Documentació
                        </button>
                    </form>
                </div>
             </div>
        )}

        {/* GEAR TAB */}
        {activeTab === 'gear' && (
            <div className="space-y-8">
                {/* Add New Item */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                     <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Plus size={20}/> Afegir Nou Equipament</h3>
                     <form onSubmit={handleAddGear} className="flex flex-col md:flex-row gap-4">
                        <select 
                            value={newGearType}
                            onChange={(e) => setNewGearType(e.target.value)}
                            className="p-2 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {gearTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input 
                            type="text" 
                            value={newGearDesc}
                            onChange={(e) => setNewGearDesc(e.target.value)}
                            placeholder="Marca, Model, Talla, etc."
                            className="flex-1 p-2 rounded border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Afegir</button>
                     </form>
                </div>

                {/* List Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipus</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descripció</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Accions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUser.gear.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">No has afegit cap equipament encara.</td>
                                </tr>
                            )}
                            {currentUser.gear.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => removeUserGearItem(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
