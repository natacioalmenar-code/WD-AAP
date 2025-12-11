
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CalendarPage: React.FC = () => {
  const { trips, courses, events } = useApp();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
    "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  // Adjust for Monday start (0=Sun -> 0=Mon conversion needed usually, but JS getDay 0 is Sun)
  // Let's make Monday index 0 for UI: Mon=0, Tue=1 ... Sun=6
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper to format date string YYYY-MM-DD for comparison
  const formatDateKey = (day: number) => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getEventsForDay = (day: number) => {
    const dateKey = formatDateKey(day);
    const dayTrips = trips.filter(t => t.date === dateKey).map(t => ({ ...t, cat: 'trip' }));
    const dayCourses = courses.filter(c => c.date === dateKey).map(c => ({ ...c, cat: 'course' }));
    
    // Split events into 'events' (talks/workshops) and 'gatherings' (dinners/parties)
    const dayTalks = events.filter(e => e.date === dateKey && e.type !== 'gathering').map(e => ({ ...e, cat: 'talk' }));
    const daySocial = events.filter(e => e.date === dateKey && e.type === 'gathering').map(e => ({ ...e, cat: 'gathering' }));
    
    return [...dayTrips, ...dayCourses, ...dayTalks, ...daySocial];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Calendari d'Activitats</h1>
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
          <span className="text-xl font-semibold w-40 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-slate-900 border-b border-gray-200">
          {['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'].map(d => (
            <div key={d} className="py-3 text-center font-bold text-yellow-400">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
          {/* Empty cells for start offset */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50 min-h-[100px]" />
          ))}

          {/* Days */}
          {daysInMonth.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day} className="bg-white min-h-[120px] p-2 hover:bg-blue-50 transition-colors relative">
                <span className={`text-sm font-semibold ${dayEvents.length > 0 ? 'text-slate-900' : 'text-gray-400'}`}>
                  {day}
                </span>
                
                <div className="mt-1 space-y-1">
                  {dayEvents.map((item: any) => (
                    <div 
                      key={item.id + item.cat}
                      onClick={() => {
                          if(item.cat === 'trip') navigate('/trips');
                          if(item.cat === 'course') navigate('/courses-private');
                          if(item.cat === 'talk' || item.cat === 'gathering') navigate('/social-events');
                      }}
                      className={`
                        text-xs p-1 rounded cursor-pointer truncate font-medium
                        ${item.cat === 'trip' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-600' : ''}
                        ${item.cat === 'course' ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-600' : ''}
                        ${item.cat === 'talk' ? 'bg-green-100 text-green-800 border-l-4 border-green-600' : ''}
                        ${item.cat === 'gathering' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : ''}
                      `}
                      title={item.title}
                    >
                      {item.cat === 'trip' && '🤿 '}
                      {item.cat === 'course' && '🎓 '}
                      {item.cat === 'talk' && '🗣️ '}
                      {item.cat === 'gathering' && '🎉 '}
                      {item.time && <span className="opacity-75">{item.time} - </span>}
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-sm font-bold text-gray-700">Sortides</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded"></div>
            <span className="text-sm font-bold text-gray-700">Cursos</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-sm font-bold text-gray-700">Xarrades / Tallers</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span className="text-sm font-bold text-gray-700">Social (Sopars, Festes)</span>
        </div>
      </div>
    </div>
  );
};
