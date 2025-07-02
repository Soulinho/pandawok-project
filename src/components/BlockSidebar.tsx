import React, { useState } from 'react';

interface Salon {
  id: string;
  name: string;
  tables: any[];
}

interface BlockSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  salones?: Salon[];
}

const BlockSidebar: React.FC<BlockSidebarProps> = ({ isOpen, onClose, salones = [] }) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateForInput(new Date()));
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [selectedArea, setSelectedArea] = useState('');
  const [applyToType, setApplyToType] = useState('todas');
  const [personasMinimas, setPersonasMinimas] = useState(4);
  const [personasMaximas, setPersonasMaximas] = useState(8);

  const isFormValid = () => {
    if (!selectedDate) return false;

    if (!isAllDay && (!startTime || !endTime)) return false;

    if (!selectedArea) return false;

    if (applyToType === 'masPersonas' && (!personasMinimas || personasMinimas < 1)) return false;
    if (applyToType === 'menosPersonas' && (!personasMaximas || personasMaximas < 1)) return false;

    return true;
  };

  function formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      date: selectedDate,
      isAllDay,
      startTime: isAllDay ? null : startTime,
      endTime: isAllDay ? null : endTime,
      area: selectedArea,
      applyToType,
      personasMinimas: applyToType === 'masPersonas' ? personasMinimas : null,
      personasMaximas: applyToType === 'menosPersonas' ? personasMaximas : null,
    });
    onClose();
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={handleOverlayClick}
      style={{ background: 'transparent' }}
    >
      <div className="inset-y-0 right-0 w-full sm:w-[380px] md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" onClick={e => e.stopPropagation()}>
        <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Crear nuevo bloqueo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-auto h-full flex flex-col">
          <div className="space-y-4 sm:space-y-6 flex-1">
            <div>
              <label htmlFor="block-date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="block-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800"
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="all-day" className="block text-sm font-medium text-gray-700">
                Todo el día
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="all-day"
                  className="sr-only"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                />
                <div className="w-11 h-6 rounded-full transition-colors duration-200 ease-in-out flex items-center p-1 bg-gray-300 data-[checked=true]:bg-orange-500" data-checked={isAllDay}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${isAllDay ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </div>
              </label>
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                    Desde
                  </label>
                  <input
                    type="time"
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                    Hasta
                  </label>
                  <input
                    type="time"
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Área
              </label>
              <select
                id="area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800"
              >
                <option value="" disabled>
                  Seleccionar área
                </option>
                {salones.length > 0 ? (
                  salones.map((salon) => (
                    <option key={salon.id} value={salon.id}>
                      {salon.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No hay salones disponibles</option>
                )}
              </select>
            </div>

            <div>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">
                Aplicar bloqueo a:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div onClick={() => setApplyToType('todas')} className="cursor-pointer flex items-center justify-center">
                    <div className={`w-5 h-5 rounded-full border ${applyToType === 'todas' ? 'border-orange-500' : 'border-gray-400'} flex items-center justify-center`}>
                      {applyToType === 'todas' && <div className="w-3 h-3 rounded-full bg-orange-500"></div>}
                    </div>
                  </div>
                  <label htmlFor="todas" className="text-sm text-gray-700 cursor-pointer" onClick={() => setApplyToType('todas')}>
                    Todas las reservas
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <div onClick={() => setApplyToType('masPersonas')} className="cursor-pointer flex items-center justify-center">
                    <div className={`w-5 h-5 rounded-full border ${applyToType === 'masPersonas' ? 'border-orange-500' : 'border-gray-400'} flex items-center justify-center`}>
                      {applyToType === 'masPersonas' && <div className="w-3 h-3 rounded-full bg-orange-500"></div>}
                    </div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center">
                    <label htmlFor="masPersonas" className="text-sm text-gray-700" onClick={() => setApplyToType('masPersonas')}>
                      Reservas de
                    </label>
                    <input 
                      type="number" 
                      className="mx-2 w-16 border border-gray-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800" 
                      value={personasMinimas}
                      onChange={(e) => setPersonasMinimas(Number(e.target.value))}
                      min="1"
                      disabled={applyToType !== 'masPersonas'}
                    />
                    <span className="text-sm text-gray-700 w-full sm:w-auto mt-1 sm:mt-0 pl-7 sm:pl-0">o más personas</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div onClick={() => setApplyToType('menosPersonas')} className="cursor-pointer flex items-center justify-center">
                    <div className={`w-5 h-5 rounded-full border ${applyToType === 'menosPersonas' ? 'border-orange-500' : 'border-gray-400'} flex items-center justify-center`}>
                      {applyToType === 'menosPersonas' && <div className="w-3 h-3 rounded-full bg-orange-500"></div>}
                    </div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center">
                    <label htmlFor="menosPersonas" className="text-sm text-gray-700" onClick={() => setApplyToType('menosPersonas')}>
                      Reservas de
                    </label>
                    <input 
                      type="number" 
                      className="mx-2 w-16 border border-gray-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800" 
                      value={personasMaximas}
                      onChange={(e) => setPersonasMaximas(Number(e.target.value))}
                      min="1"
                      disabled={applyToType !== 'menosPersonas'}
                    />
                    <span className="text-sm text-gray-700 w-full sm:w-auto mt-1 sm:mt-0 pl-7 sm:pl-0">o menos personas</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`mt-4 w-full ${isFormValid() ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors`}
                >
                  Crear Bloqueo
                </button>
              </div>
            </div>
          </div>


          <div className="mt-6 border-t border-gray-200 pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 ${isFormValid() ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors`}
            >
              Crear Bloqueo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockSidebar;
