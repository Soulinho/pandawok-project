import React, { useState } from 'react';
import Header from '../components/Header';

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#F7F7ED]">
      <Header />
      <div className="p-2 sm:p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#211B17]">Clientes</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Buscar"
              className="px-3 sm:px-4 py-2 rounded-md bg-white border border-[#F2994A] text-[#211B17] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm">
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="hidden sm:inline">Tags</span>
                </span>
              </button>
              <button className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm">
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="hidden sm:inline">Filtrar</span>
                </span>
              </button>
              <button className="px-2 sm:px-3 py-2 rounded-md border border-[#F2994A] text-[#F2994A] bg-white hover:bg-[#F2994A] hover:text-white transition-colors text-sm">
                <span className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Descargar</span>
                </span>
              </button>
              <button className="px-3 sm:px-4 py-2 bg-[#F2994A] text-white rounded-md hover:bg-[#d97d23] transition-colors font-semibold shadow text-sm">
                + Nuevo Cliente
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-[#211B17] rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F7F7ED]/20">
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Teléfono</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Correo Electrónico</th>
                <th className="py-3 px-4 text-center text-[#F7F7ED] font-semibold">Visitas</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Última Visita</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Tags del cliente</th>
                <th className="py-3 px-4 text-right text-[#F7F7ED] font-semibold">Gasto total</th>
                <th className="py-3 px-4 text-right text-[#F7F7ED] font-semibold">Gasto/Visita</th>
                <th className="py-3 px-4 text-left text-[#F7F7ED] font-semibold">Nota del perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F7ED]/20">
              <tr className="transition-colors hover:bg-[#655644] group">
                <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">Alejandro Garay</td>
                <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">+{56} 09 4507 8880</td>
                <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">aleleon_237@hotmail.com</td>
                <td className="py-3 px-4 text-center text-[#F7F7ED] group-hover:text-white">0</td>
                <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">-</td>
                <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">-</td>
                <td className="py-3 px-4 text-right text-[#F7F7ED] group-hover:text-white">0.00</td>
                <td className="py-3 px-4 text-right text-[#F7F7ED] group-hover:text-white">0.00</td>
                <td className="py-3 px-4 text-[#F7F7ED] group-hover:text-white">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;