
import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Users, MessageCircle, GlassWater } from 'lucide-react';

export const SocialEvents: React.FC = () => {
  const { events, currentUser, joinEvent, leaveEvent } = useApp();

  if (!currentUser) return null;

  const getTypeStyle = (type: string) => {
      switch(type) {
          case 'talk': return 'bg-green-100 text-green-700';
          case 'workshop': return 'bg-blue-100 text-blue-700';
          case 'gathering': return 'bg-purple-100 text-purple-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const getTypeLabel = (type: string) => {
      switch(type) {
          case 'talk': return 'Xarrada';
          case 'workshop': return 'Taller';
          case 'gathering': return 'Social / Festa';
          default: return 'Esdeveniment';
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Xarrades i Trobades</h1>
        <p className="text-gray-600 mt-2">La vida social del club: tallers, conferències i sopars de germanor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const isSignedUp = event.participants.includes(currentUser.id);

          return (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getTypeStyle(event.type)}`}>
                    {getTypeLabel(event.type)}
                  </span>
                  {isSignedUp && <span className="text-green-600 text-xs font-bold">Inscrit/a</span>}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> {event.date} - {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} /> {event.participants.length} assistents
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                 {isSignedUp ? (
                    <button 
                    onClick={() => leaveEvent(event.id)}
                    className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 font-medium text-sm"
                    >
                    No hi aniré
                    </button>
                ) : (
                    <button 
                    onClick={() => joinEvent(event.id)}
                    className="w-full py-2 bg-slate-900 text-yellow-400 rounded-lg hover:bg-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                     {event.type === 'gathering' ? <GlassWater size={16}/> : <MessageCircle size={16}/>} 
                     {event.type === 'gathering' ? "M'apunto a la festa" : "Inscriure'm"}
                    </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
