
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { UserLevel } from '../types';
import { Shield, Anchor, User } from 'lucide-react';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<UserLevel>(UserLevel.B1E);
  const [error, setError] = useState('');
  
  const { login, register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name || !email) {
        setError('Omple tots els camps');
        return;
      }
      register(name, email, level);
      navigate('/dashboard');
    } else {
      if (login(email)) {
        navigate('/dashboard');
      } else {
        setError('Usuari no trobat.');
      }
    }
  };

  const quickLogin = (email: string) => {
      if (login(email)) {
          navigate('/dashboard');
      }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-400">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            {isRegister ? 'Sol·licitud de Soci' : 'Accés al Club'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegister 
              ? 'Omple el formulari per unir-te a West Divers' 
              : 'Introdueix les teves dades o utilitza els accessos ràpids.'
            }
          </p>
        </div>

        {/* DEMO BUTTONS */}
        {!isRegister && (
            <div className="grid grid-cols-1 gap-3 mb-6">
                <button 
                    onClick={() => quickLogin('thewestdivers@gmail.com')}
                    className="flex items-center justify-center gap-2 w-full p-3 bg-slate-900 text-yellow-400 rounded-lg hover:bg-slate-800 transition-colors font-bold shadow-sm"
                >
                    <Shield size={18} /> Entrar com a ADMIN (Tot)
                </button>
                <div className="flex gap-3">
                    <button 
                        onClick={() => quickLogin('marc@westdivers.cat')}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-medium text-sm"
                    >
                        <Anchor size={16} /> Instructor
                    </button>
                    <button 
                        onClick={() => quickLogin('laura@example.com')}
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium text-sm"
                    >
                        <User size={16} /> Soci B2E
                    </button>
                </div>
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">O entra manualment</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
            </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <div className="mb-4">
                <label htmlFor="name" className="sr-only">Nom complet</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isRegister}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Correu electrònic</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isRegister ? '' : 'rounded-md'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Correu electrònic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {isRegister && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivell de Busseig (FECDAS/CMAS)</label>
                <select 
                  value={level} 
                  onChange={(e) => setLevel(e.target.value as UserLevel)}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Object.values(UserLevel).map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isRegister ? 'Enviar Sol·licitud' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            {isRegister ? 'Ja ets soci? Inicia sessió' : 'No tens compte? Registra\'t'}
          </button>
        </div>
      </div>
    </div>
  );
};
