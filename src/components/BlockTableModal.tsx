import React, { useState, useEffect } from 'react';

interface BlockTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: number | undefined;
  onBlockTable: (tableId: number, reason: string, startTime: string, endTime: string, date: string) => void;
}

const BlockTableModal: React.FC<BlockTableModalProps> = ({ isOpen, onClose, tableNumber, onBlockTable }) => {
  const [reason, setReason] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [blockDate, setBlockDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Establecer la fecha actual por defecto en formato YYYY-MM-DD
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      setBlockDate(`${year}-${month}-${day}`);
      setReason(''); // Resetear razón al abrir
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber && reason && startTime && endTime && blockDate) {
      // Validación básica de horas
      const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

      if (endMinutes <= startMinutes) {
        alert('La hora de fin debe ser posterior a la hora de inicio.');
        return;
      }
      onBlockTable(tableNumber, reason, startTime, endTime, blockDate);
      onClose();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Bloquear Mesa {tableNumber}</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="blockReason" className="block text-gray-700 text-sm font-bold mb-2">
              Razón del bloqueo:
            </label>
            <input
              type="text"
              id="blockReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="blockDate" className="block text-gray-700 text-sm font-bold mb-2">
              Fecha:
            </label>
            <input
              type="date"
              id="blockDate"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-2">
                Hora de inicio:
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">
                Hora de fin:
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Bloquear Mesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockTableModal;