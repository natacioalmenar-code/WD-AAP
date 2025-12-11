import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Calendar, Award, BookOpen, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, trips } = useApp();

  if (!currentUser) return null;

  const myTrips = trips.filter(t => t.participants.includes(currentUser.id));
  const nextTrip = myTrips.length > 0 
    ? myTrips.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] 
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hola, {currentUser.name}! 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nivell</p>
              <p className="font-bold text-gray-800">{currentUser.level}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sortides</p>
              <p className="font-bold text-gray-800">{myTrips.length} reserves</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Next Trip Card */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">La teva propera sortida</h2>
            {nextTrip ? (
              <div>
                <h3 className="text-2xl font-bold mb-2">{nextTrip.title}</h3>
                <p className="opacity-90 mb-4 flex items-center gap-2">
                  <Calendar size={18} /> {nextTrip.date} a les {nextTrip.time}
                </p>
                <Link to="/trips" className="inline-block bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Veure detalls
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">No tens cap sortida programada.</p>
                <Link to="/trips" className="bg-white text-blue-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100">
                  Buscar Sortides
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Notícies del Club</h3>
            <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <p className="text-sm text-gray-500">10 Nov</p>
                    <p className="text-gray-800 font-medium">Ja tenim les noves dessuadores West Divers!</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <p className="text-sm text-gray-500">05 Nov</p>
                    <p className="text-gray-800 font-medium">Obertura d'inscripcions pel viatge al Mar Roig.</p>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600"/> Documentació
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">➔ La meva assegurança</li>
              <li className="hover:text-blue-600 cursor-pointer">➔ Certificat Mèdic</li>
              <li className="hover:text-blue-600 cursor-pointer">➔ Titulacions</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-blue-600"/> Grups Socials
            </h3>
            <div className="flex flex-col gap-2">
                <button className="w-full text-left px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">
                   WhatsApp Sortides
                </button>
                <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">
                   Compravenda Material
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
