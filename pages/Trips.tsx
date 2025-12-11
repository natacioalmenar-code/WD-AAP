
import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';

export const Trips: React.FC = () => {
  const { trips, currentUser, joinTrip, leaveTrip, getParticipantDetails } = useApp();

  const sortedTrips = [...trips].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">Sortides i Viatges</h1>
        <p className="text-gray-600 mt-2">Apunta't a les properes immersions amb un sol clic.</p>
      </div>

      <div className="space-y-8">
        {sortedTrips.map(trip => {
          const isSignedUp = trip.participants.includes(currentUser.id);
          const spotsLeft = trip.maxSpots - trip.participants.length;
          const participantsList = getParticipantDetails(trip.participants);
          const isFull = spotsLeft <= 0;

          return (
            <div key={trip.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-xl border border-gray-100">
              {/* Image Section */}
              <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                <img src={trip.imageUrl} alt={trip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-0 left-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-br-lg uppercase tracking-wider">
                  {trip.levelRequired}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">{trip.title}</h2>
                    {isSignedUp && (
                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase">
                        Inscrit
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-4 text-sm text-gray-600 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-yellow-500" />
                      <span className="font-medium text-slate-800">{trip.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-yellow-500" />
                      <span>{trip.time}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2 md:col-span-1 lg:col-span-1">
                      <MapPin size={18} className="text-yellow-500" />
                      {trip.locationUrl ? (
                          <a 
                            href={trip.locationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline truncate flex items-center gap-1"
                          >
                             {trip.location} <ExternalLink size={12}/>
                          </a>
                      ) : (
                          <span className="truncate">{trip.location}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight size={18} className="text-yellow-500" />
                      <span>{trip.depth}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{trip.description}</p>
                </div>

                {/* Footer Section: Participants & Action */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                  
                  {/* Participant Avatars */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex -space-x-2">
                      {participantsList.slice(0, 5).map(p => (
                        <img 
                          key={p.id} 
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
                          src={p.avatarUrl} 
                          alt={p.name}
                          title={p.name} 
                        />
                      ))}
                      {participantsList.length > 5 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 ring-2 ring-white">
                              +{participantsList.length - 5}
                          </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                       {trip.participants.length} <span className="font-normal text-gray-400">/ {trip.maxSpots} places</span>
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="w-full md:w-auto">
                    {isSignedUp ? (
                      <button 
                        onClick={() => leaveTrip(trip.id)}
                        className="w-full md:w-auto px-6 py-2 border-2 border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold uppercase text-sm tracking-wide"
                      >
                        Desapunta'm
                      </button>
                    ) : (
                      <button 
                        onClick={() => joinTrip(trip.id)}
                        disabled={isFull}
                        className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold shadow-md uppercase text-sm tracking-wider transition-all transform active:scale-95 ${
                          isFull 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg'
                        }`}
                      >
                        {isFull ? 'Complet' : 'Apunta-m’hi'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
