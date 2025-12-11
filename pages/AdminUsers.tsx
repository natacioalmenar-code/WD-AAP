
import React from 'react';
import { useApp } from '../context/AppContext';
import { UserStatus, UserRole } from '../types';
import { Check, X, Shield, User as UserIcon } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, approveUser, rejectUser, updateUserRole, canManageSystem } = useApp();

  if (!canManageSystem()) {
      return <div className="p-8 text-center text-red-600">Accés denegat. Només per a Administradors.</div>;
  }

  const pendingUsers = users.filter(u => u.status === UserStatus.PENDING);
  const activeUsers = users.filter(u => u.status === UserStatus.ACTIVE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Gestió de Socis</h1>

      {/* Pending Approvals */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">{pendingUsers.length}</span>
            Sol·licituds Pendents
        </h2>
        {pendingUsers.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 border border-gray-200">
                No hi ha sol·licituds pendents.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingUsers.map(user => (
                    <div key={user.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-400">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-bold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs font-semibold text-blue-600 mt-1">{user.level}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => approveUser(user.id)}
                                className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg font-bold hover:bg-green-200 flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> Aprovar
                            </button>
                            <button 
                                onClick={() => rejectUser(user.id)}
                                className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-bold hover:bg-red-200 flex items-center justify-center gap-2"
                            >
                                <X size={18} /> Rebutjar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Active Users List */}
      <div>
         <h2 className="text-xl font-bold text-gray-800 mb-4">Socis Actius ({activeUsers.length})</h2>
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Soci</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nivell</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol (Permisos)</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Estat</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {activeUsers.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-800">
                                    {user.level}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select 
                                    value={user.role}
                                    onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                                    className={`text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${
                                        user.role === UserRole.ADMIN ? 'text-red-600 font-bold' : 
                                        user.role === UserRole.INSTRUCTOR ? 'text-green-600 font-bold' : 'text-gray-600'
                                    }`}
                                >
                                    {Object.values(UserRole).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <span className="text-green-600 text-xs font-bold uppercase bg-green-50 px-2 py-1 rounded border border-green-100">
                                    Actiu
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
