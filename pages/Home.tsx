
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Users, Calendar, Anchor, BookOpen, Shield } from 'lucide-react';

export const Home: React.FC = () => {
  const { clubSettings } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center transition-all duration-1000"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("${clubSettings.homeHeroImageUrl}")` }}
      >
        <div className="text-center text-white px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-lg uppercase">
            {clubSettings.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto drop-shadow-md">
            El teu club de busseig per excel·lència. <br/>
            <span className="font-semibold">{clubSettings.heroSubtitle}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl border-2 border-yellow-400">
              Accés Socis/es
            </Link>
            <a href="#contact" className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold py-3 px-8 rounded-full transition-all">
              Contacta'ns
            </a>
          </div>
        </div>
      </div>

      {/* Specialties Section (Marketing) */}
      <div className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-yellow-400">ESPECIALITATS FECDAS / CMAS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-4 group">
               <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                  <span className="text-2xl font-bold">O2</span>
               </div>
               <h3 className="font-bold text-xl">Nitrox</h3>
               <p className="text-gray-400 text-sm mt-2">Busseja més temps amb més seguretat.</p>
            </div>
            <div className="p-4 group">
               <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                  <Anchor size={32} />
               </div>
               <h3 className="font-bold text-xl">Profunda</h3>
               <p className="text-gray-400 text-sm mt-2">Descobreix què s'amaga a més profunditat.</p>
            </div>
            <div className="p-4 group">
               <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                  <Shield size={32} />
               </div>
               <h3 className="font-bold text-xl">Vestit Sec</h3>
               <p className="text-gray-400 text-sm mt-2">Submergeix-te tot l'any sense passar fred.</p>
            </div>
            <div className="p-4 group">
               <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                  <Users size={32} />
               </div>
               <h3 className="font-bold text-xl">Salvament</h3>
               <p className="text-gray-400 text-sm mt-2">Aprèn a gestionar situacions d'emergència.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features App Preview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <img 
                    src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop" 
                    alt="Diver Logbook" 
                    className="rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                />
            </div>
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-4xl font-bold text-gray-900">Tot el teu busseig, en una sola App</h2>
                <p className="text-lg text-gray-600">
                    Els socis i socies de {clubSettings.heroTitle} tenen accés exclusiu a la nostra aplicació privada.
                </p>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400 rounded-full text-black"><Calendar size={20}/></div>
                        <span className="font-medium">Inscripció a sortides amb un sol clic</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400 rounded-full text-black"><BookOpen size={20}/></div>
                        <span className="font-medium">Registre digital de titulacions i assegurança</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400 rounded-full text-black"><Users size={20}/></div>
                        <span className="font-medium">Comunitat i xarrades exclusives</span>
                    </li>
                </ul>
                <div className="pt-4">
                     <Link to="/login" className="text-blue-600 font-bold hover:underline text-lg">
                        Sol·licita el teu accés &rarr;
                     </Link>
                </div>
            </div>
        </div>
      </div>

      {/* Contact Footer */}
      <footer id="contact" className="bg-black text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-2xl font-bold mb-6 text-yellow-400 uppercase">{clubSettings.heroTitle}</h4>
            <p className="text-gray-400 leading-relaxed">
              El club de referència a les terres de Lleida per als amants del món subaquàtic. Formació, sortides i bon ambient.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6">Contacte</h4>
            <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                    <MapPin className="mt-1 text-yellow-400 shrink-0" size={20}/> 
                    <span>Carrer Trullets, 26 baixos<br/>25126 Almenar, Lleida</span>
                </li>
                <li className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-1 rounded-full text-black"><Users size={14}/></div>
                    <div>
                        <p>625 57 22 00</p>
                        <p>644 79 40 11</p>
                    </div>
                </li>
                <li className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-1 rounded-full text-black"><div className="w-3.5 h-3.5 bg-black rounded-sm"></div></div>
                    <div>
                        <a href="mailto:natacioalmenar@gmail.com" className="hover:text-yellow-400 block">natacioalmenar@gmail.com</a>
                        <a href="mailto:thewestdivers@gmail.com" className="hover:text-yellow-400 block">thewestdivers@gmail.com</a>
                    </div>
                </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6">Enllaços</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/login" className="hover:text-yellow-400">Àrea Privada</Link></li>
                <li><a href="#" className="hover:text-yellow-400">FECDAS</a></li>
                <li><a href="#" className="hover:text-yellow-400">CMAS</a></li>
                <li className="pt-4 text-xs opacity-50">© {new Date().getFullYear()} West Divers. Tots els drets reservats.</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
