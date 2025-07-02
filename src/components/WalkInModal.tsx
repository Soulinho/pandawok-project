import React, { useState } from 'react';
import NewClientModal from './NewClientModal'; // Importar el nuevo modal de cliente

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: number | undefined;
  // Asegúrate de que esta firma coincida con lo que Timeline.tsx pasa
  onConfirmWalkIn: (tableNumber: number, guestName: string, partySize: number, notes: string) => void;
}

const WalkInModal: React.FC<WalkInModalProps> = ({ isOpen, onClose, tableNumber, onConfirmWalkIn }) => {
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [notes, setNotes] = useState('');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false); // Estado para el modal de Nuevo Cliente

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (tableNumber) {
      onConfirmWalkIn(tableNumber, guestName, partySize, notes);
      onClose(); // Cierra el modal de Walk-in después de confirmar
      // Restablecer campos del formulario para el siguiente uso
      setGuestName('');
      setPartySize(1);
      setNotes('');
    }
  };

  const handleOpenNewClientModal = () => {
    setIsNewClientModalOpen(true);
  };

  const handleCloseNewClientModal = () => {
    setIsNewClientModalOpen(false);
  };

  const handleClientCreated = (clientData: any) => {
    // Al crear un cliente, podemos precargar el nombre en el campo de "Comensal"
    setGuestName(`${clientData.nombre} ${clientData.apellido}`);
    console.log('Nuevo cliente creado desde Walk-in:', clientData);
    // Aquí podrías guardar el cliente en una base de datos o estado global si lo necesitas.
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#211B17] p-6 rounded-lg shadow-xl w-96 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sentar Walk-in</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p className="text-gray-300 mb-4">Mesa: {tableNumber}</p>

        <div className="mb-4">
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-300 mb-1">Comensal</label>
          <div className="relative">
            <input
              type="text"
              id="guestName"
              placeholder="Comensal"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-600 bg-[#4c4037] text-white"
            />
            {/* Icono de búsqueda */}
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {/* Ícono de persona (para abrir el modal de Nuevo Cliente) */}
            <button
              onClick={handleOpenNewClientModal}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-500"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad de comensales</label>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setPartySize(num)}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  partySize === num ? 'bg-orange-500 text-white' : 'bg-[#4c4037] text-gray-200 hover:bg-gray-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notas</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-600 bg-[#4c4037] text-white"
          ></textarea>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Sentar Walk-in
        </button>
      </div>

      {/* Renderizar el NewClientModal */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={handleCloseNewClientModal}
        onClientCreate={handleClientCreated}
      />
    </div>
  );
};

export default WalkInModal;