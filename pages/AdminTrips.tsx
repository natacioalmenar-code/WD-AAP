import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trip } from '../types';
import { Trash2, Plus, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminTrips: React.FC = () => {
  const { trips, addTrip, deleteTrip } = useApp();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Trip>>({
    title: '',
    date: '',
    time: '09:00',
    location: '',
    depth: '',
    levelRequired: 'B1E',
    description: '',
    maxSpots: 10,
    imageUrl: 'https://picsum.photos/seed/new/800/400',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) return;

    const newTrip: Trip = {
      id: `t${Date.now()}`,
      title: formData.title!,
      date: formData.date!,
      time: formData.time!,
      location: formData.location!,
      depth: formData.depth || 'N/A',
      levelRequired: formData.levelRequired!,
      description: formData.description || '',
      maxSpots: Number(formData.maxSpots),
      imageUrl: formData.imageUrl || 'https://picsum.photos/seed/default/800/400',
      participants: []
    };

    addTrip(newTrip);
    setShowForm(false);
    // Reset minimal form data
    setFormData({
       title: '', date: '', time: '09:00', location: '', depth: '', levelRequired: 'B1E', description: '', maxSpots: 10, imageUrl: 'https://picsum.photos/seed/new/800/400'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Gestió de Sortides</h1>
           <p className="text-gray-500">Afegeix o elimina activitats del club.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Nova Sortida
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-8 animate-fade-in-down">
          <h2 className="text-xl font-bold mb-4">Crear Nova Sortida</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Títol</label>
              <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full border rounded p-2" placeholder="Ex: Immersió a la Foradada" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <input type="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lloc</label>
              <input name="location" value={formData.location} onChange={handleInputChange} required className="w-full border rounded p-2" placeholder="Ex: Palamós" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profunditat</label>
              <input name="depth" value={formData.depth} onChange={handleInputChange} className="w-full border rounded p-2" placeholder="Ex: 20m" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Places Màximes</label>
                <input type="number" name="maxSpots" value={formData.maxSpots} onChange={handleInputChange} className="w-full border rounded p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nivell Mínim</label>
                <input name="levelRequired" value={formData.levelRequired} onChange={handleInputChange} className="w-full border rounded p-2" placeholder="Ex: B1E / B2E" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripció</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded p-2 h-24" placeholder="Detalls de la sortida..." />
            </div>

            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel·lar</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Publicar Sortida</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sortida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrits</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Accions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trips.map(trip => (
              <tr key={trip.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={trip.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{trip.title}</div>
                      <div className="text-sm text-gray-500">{trip.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1"><Calendar size={14}/> {trip.date}</div>
                  <div className="text-sm text-gray-500">{trip.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {trip.participants.length} / {trip.maxSpots}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => deleteTrip(trip.id)} className="text-red-600 hover:text-red-900 flex items-center ml-auto gap-1">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};