import React, { useState, useRef, useEffect } from 'react';
import EditNoteModal from './EditNoteModal';

interface ReservationInfo {
  guestName: string;
  time: string;
  partySize: number;
  salon: string;
  notes?: string;
  origin?: 'Restaurant' | 'Web';
  createdAt?: string;
}

interface ClientProfile {
  firstName: string;
  lastName: string;
  birthday?: string;
  company?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  notes?: string;
}

interface Table {
    id: number;
    shape: 'round' | 'square' | 'rectangular';
    size: 'small' | 'medium' | 'large';
    occupied?: boolean;
    reserved?: boolean;
    reservationInfo?: {
        guestName: string;
        time: string; // Ej: "4:30 PM"
        partySize: number; // Ej: 10
        salon: string; // Ej: "Salón 1 (A)"
        date: string; // Agregado: Ej: "Vie, 04 de Julio" o "2025-07-04"
        notes?: string;
        origin?: 'Restaurant' | 'Web' | 'Walk-in';
        createdAt?: string; // Ej: "02/07/2025, 10:48"
        duration?: string; // Agregado: Ej: "3h"
        // Si necesitas un ID de reserva único, podrías añadirlo aquí
        // reservationId?: string;
    };
}

interface ReservationDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    table: Table | null;
    activeTab: 'reserva' | 'perfil' | 'historial' | 'actividad';
    setActiveTab: (tab: 'reserva' | 'perfil' | 'historial' | 'actividad') => void;
    onUpdateReservation: (tableId: number, updates: Partial<Table['reservationInfo']>) => void;
    onFinalizeWalkIn: (tableId: number) => void;
    onChangeTable: (tableId: number) => void;
    onDeleteReservation: (tableId: number) => void; // NUEVA PROP
}

const ReservationDetailsPanel: React.FC<ReservationDetailsPanelProps> = ({
    isOpen,
    onClose,
    table,
    activeTab,
    setActiveTab,
    onUpdateReservation,
    onFinalizeWalkIn,
    onChangeTable,
    onDeleteReservation // Recibimos la nueva prop
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string | number>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newTag, setNewTag] = useState('');

  const [clientProfile, setClientProfile] = useState<ClientProfile>({
    firstName: table?.reservationInfo?.guestName.split(' ')[0] || '',
    lastName: table?.reservationInfo?.guestName.split(' ').slice(1).join(' ') || '',
    birthday: '',
    company: '',
    phone: '+(56) 09 9101 3400',
    email: '',
    tags: [],
    notes: ''
  });

  const inputRefs = useRef<{[key: string]: HTMLInputElement | HTMLTextAreaElement | null}>({});
  useEffect(() => {
    if (table?.reservationInfo) {
      const nameParts = table.reservationInfo.guestName.split(' ');
      setClientProfile(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || ''
      }));
    }
  }, [table]);

  const detailTabs = [
    { id: 'reserva', label: 'Reserva' },
    { id: 'perfil', label: 'Perfil' },
    { id: 'historial', label: 'Historial' },
    { id: 'actividad', label: 'Actividad' }
  ];

  const handleFieldEdit = (field: string, value: string | number) => {
    if (onUpdateReservation && table?.id) {
      onUpdateReservation(table.id, { [field]: value });
    }
    setEditingField(null);
  };

  const handleNoteEdit = (newNote: string) => {
    if (onUpdateReservation && table?.id) {
      onUpdateReservation(table.id, { notes: newNote });
    }
  };

  const startEditing = (field: string, currentValue: string | number) => {
    setEditingField(field);
    setTempValues({ ...tempValues, [field]: currentValue });
  };

  const handleProfileUpdate = (field: keyof ClientProfile, value: string | string[] | undefined) => {
    setClientProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setClientProfile(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setClientProfile(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleProfileFieldClick = (field: string) => {
    setEditingField(field);
    setTimeout(() => {
      if (inputRefs.current[field]) {
        inputRefs.current[field]?.focus();
      }
    }, 0);
  };

  const handleProfileFieldBlur = (field: keyof ClientProfile, value: string | undefined) => {
    handleProfileUpdate(field, value);
    setEditingField(null);
  };

  const handleProfileFieldKeyDown = (e: React.KeyboardEvent, field: keyof ClientProfile, value: string | undefined) => {
    if (e.key === 'Enter') {
      handleProfileFieldBlur(field, value);
    }
  };

  const generateTimeOptions = () => {
    const times: string[] = [];
    const start: number = 12 * 60;
    const end: number = 18 * 60 + 30;

    for (let time = start; time <= end; time += 30) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const displayHours = hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      times.push(timeString);
    }

    return times;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const formatDateSpanish = (day: number, month: number, year: number) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(year, month, day);
    return `${days[date.getDay()]}, ${months[month]} ${day}`;
  };

  const handleDateSelect = (day: number) => {
    const selectedDateFormatted = formatDateSpanish(day, currentMonth.getMonth(), currentMonth.getFullYear());
    setTempValues({ ...tempValues, date: selectedDateFormatted });
    handleFieldEdit('date', selectedDateFormatted);
    setShowDatePicker(false);
  };

  const getAvailableDates = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 1);

    return { today, maxDate };
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long' });

    const days = [];
    const { today, maxDate } = getAvailableDates();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8 sm:w-9 sm:h-9"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isTodayDate = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < today;
      const isFuture = currentDate > maxDate;
      const isAvailable = !isPast && !isFuture;

      days.push(
        <button
          key={day}
          onClick={() => isAvailable ? handleDateSelect(day) : null}
          disabled={!isAvailable}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            isAvailable
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 sm:p-4 z-50 w-full sm:w-72 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(currentMonth.getMonth() - 1);
              setCurrentMonth(newMonth);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm sm:text-base font-semibold text-gray-800 capitalize">
            {monthName} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(currentMonth.getMonth() + 1);
              setCurrentMonth(newMonth);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {days}
        </div>
      </div>
    );
  };

  const statusOptions = [
    'No show',
    'Cancelado',
    'Sentado',
    'Contactado',
    'Confirmada',
    'Lista de espera',
    'En el restaurante',
    'Reservado',
    'Pidió cuenta',
    'Pagado'
  ];

  const handleTableSelectionClick = () => {
    onClose();
    if (onTableSelectionRequest) {
      onTableSelectionRequest();
    }
  };

  if (!isOpen || !table?.reservationInfo) return null;

  return (
    <div
      className="flex-1 flex flex-col"
      style={{ backgroundColor: '#F7F7ED' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-6 border-b border-orange-400" style={{ backgroundColor: '#F7F7ED' }}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {table.reservationInfo.guestName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{table.reservationInfo.guestName}</h2>
            <p className="text-sm text-gray-600 font-medium">+(56) 09 9101 3400</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-300">
            LISTO
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200" style={{ backgroundColor: '#F7F7ED' }}>
        {detailTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#F7F7ED' }}>
        {activeTab === 'reserva' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <span className="font-medium">
                Origen:
                <span className={`font-semibold ${table.reservationInfo.origin === 'Restaurant' ? 'text-purple-600' : 'text-blue-600'}`}>
                  {table.reservationInfo.origin || 'Restaurant'}
                </span>
              </span>
              <span className="font-medium">
                Creada el <span className="text-gray-800 font-semibold">
                  {table.reservationInfo.createdAt || '26/06/2025 a las 03:22 pm'}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-semibold">Fecha</label>
                {editingField === 'date' ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center space-x-3 p-3 rounded-lg border-2 border-orange-500 bg-white shadow-sm w-full text-left hover:bg-orange-50 focus:outline-none text-gray-800 font-medium"
                    >
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{tempValues.date || 'Vie, 04 de Julio'}</span>
                    </button>
                    {showDatePicker && renderCalendar()}
                  </div>
                ) : (
                    <>
                        {/* Sección de Cliente */}
                        <div className="flex items-center space-x-3 py-2 border-b border-gray-700">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {contactId[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-lg">{reservationInfo.guestName}</p>
                                <p className="text-sm text-gray-400">{phoneNumber}</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block font-semibold">Hora</label>
                {editingField === 'time' ? (
                  <select
                    value={tempValues.time || table.reservationInfo?.time}
                    onChange={(e) => setTempValues({ ...tempValues, time: e.target.value })}
                    onBlur={() => handleFieldEdit('time', tempValues.time)}
                    className="p-3 rounded-lg border-2 border-orange-500 bg-white shadow-sm w-full focus:outline-none text-gray-800 font-medium"
                    autoFocus
                  >
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => startEditing('time', table.reservationInfo?.time)}
                    className="flex items-center space-x-3 p-3 rounded-lg border-2 border-orange-300 bg-white shadow-sm hover:shadow-md transition-shadow w-full text-left hover:bg-orange-50"
                  >
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-800 font-medium">{table.reservationInfo?.time}</span>
                  </button>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block font-semibold">Personas</label>
                {editingField === 'partySize' ? (
                  <select
                    value={tempValues.partySize || table.reservationInfo?.partySize}
                    onChange={(e) => setTempValues({ ...tempValues, partySize: parseInt(e.target.value) })}
                    onBlur={() => handleFieldEdit('partySize', tempValues.partySize)}
                    className="p-3 rounded-lg border-2 border-orange-500 bg-white shadow-sm w-full focus:outline-none text-gray-800 font-medium"
                    autoFocus
                  >
                    {Array.from({ length: 99 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => startEditing('partySize', table.reservationInfo?.partySize)}
                    className="flex items-center space-x-3 p-3 rounded-lg border-2 border-orange-300 bg-white shadow-sm hover:shadow-md transition-shadow w-full text-left hover:bg-orange-50"
                  >
                    <span className="material-icons text-orange-500 text-xl">group</span>
                    <span className="text-gray-800 font-medium">{table.reservationInfo?.partySize} personas</span>
                  </button>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block font-semibold">Duración</label>
                {editingField === 'duration' ? (
                  <select
                    value={tempValues.duration || '3h'}
                    onChange={(e) => setTempValues({ ...tempValues, duration: e.target.value })}
                    onBlur={() => handleFieldEdit('duration', tempValues.duration)}
                    className="p-3 rounded-lg border-2 border-orange-500 bg-white shadow-sm w-full focus:outline-none text-gray-800 font-medium"
                    autoFocus
                  >
                    <option value="1h">1h</option>
                    <option value="1.5h">1.5h</option>
                    <option value="2h">2h</option>
                    <option value="2.5h">2.5h</option>
                    <option value="3h">3h</option>
                    <option value="4h">4h</option>
                  </select>
                ) : (
                  <button
                    onClick={() => startEditing('duration', '3h')}
                    className="flex items-center space-x-3 p-3 rounded-lg border-2 border-orange-300 bg-white shadow-sm hover:shadow-md transition-shadow w-full text-left hover:bg-orange-50"
                  >
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-800 font-medium">3h</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-semibold">Mesa</label>
                <button
                  onClick={handleTableSelectionClick}
                  className="flex items-center space-x-3 p-3 rounded-lg border-2 border-orange-300 bg-white shadow-sm hover:shadow-md transition-shadow w-full text-left hover:bg-orange-50"
                >
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-gray-800 font-medium">[{table.reservationInfo?.salon}] Mesa {table.id}</span>
                </button>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block font-semibold">Tags de la reserva</label>
                <button className="flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed border-orange-300 w-full hover:border-orange-400 hover:bg-orange-50 transition-all">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-gray-700 font-medium">Toca para agregar tags</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block font-semibold">Nota de la reserva</label>
              {table.reservationInfo.notes ? (
                <div className="p-4 rounded-lg text-gray-800 border-2 border-orange-300 bg-white shadow-sm font-medium cursor-pointer hover:bg-orange-50 transition-colors"
                     onClick={() => setIsEditingNote(true)}>
                  {table.reservationInfo.notes}
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-orange-300 w-full hover:border-orange-400 hover:bg-orange-50 transition-all"
                >
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-gray-700 font-medium">Agregar nota</span>
                </button>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block font-semibold">Adjuntar archivo</label>
              <div className="flex items-center space-x-4">
                <button className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all shadow-sm">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <span className="text-gray-700 font-medium">Cargar archivo</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl">Historial de reservas</p>
          </div>
        )}

        {activeTab === 'actividad' && (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl">Registro de actividad</p>
          </div>
        )}

        {activeTab === 'perfil' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="text-sm text-gray-700 font-semibold block mb-1">Nombre</label>
                {editingField === 'firstName' ? (
                  <input
                    type="text"
                    value={clientProfile.firstName}
                    onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                    onBlur={(e) => handleProfileFieldBlur('firstName', e.target.value)}
                    onKeyDown={(e) => handleProfileFieldKeyDown(e, 'firstName', clientProfile.firstName)}
                    ref={(el: HTMLInputElement | null) => (inputRefs.current['firstName'] = el)}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-gray-800 font-medium py-2 px-3 rounded-md hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleProfileFieldClick('firstName')}
                  >
                    {clientProfile.firstName || '-'}
                  </p>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="text-sm text-gray-700 font-semibold block mb-1">Apellido</label>
                {editingField === 'lastName' ? (
                  <input
                    type="text"
                    value={clientProfile.lastName}
                    onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                    onBlur={(e) => handleProfileFieldBlur('lastName', e.target.value)}
                    onKeyDown={(e) => handleProfileFieldKeyDown(e, 'lastName', clientProfile.lastName)}
                    ref={(el: HTMLInputElement | null) => (inputRefs.current['lastName'] = el)}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <p
                    className="text-gray-800 font-medium py-2 px-3 rounded-md hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleProfileFieldClick('lastName')}
                  >
                    {clientProfile.lastName || '-'}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="text-sm text-gray-700 font-semibold block mb-1">Cumpleaños</label>
                {editingField === 'birthday' ? (
                  <input
                    type="date"
                    value={clientProfile.birthday || ''}
                    onChange={(e) => handleProfileUpdate('birthday', e.target.value)}
                    onBlur={(e) => handleProfileFieldBlur('birthday', e.target.value)}
                    ref={(el: HTMLInputElement | null) => (inputRefs.current['birthday'] = el)}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <p
                    className="text-gray-800 font-medium py-2 px-3 rounded-md hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleProfileFieldClick('birthday')}
                  >
                    {clientProfile.birthday || '-'}
                  </p>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="text-sm text-gray-700 font-semibold block mb-1">Empresa</label>
                {editingField === 'company' ? (
                  <input
                    type="text"
                    value={clientProfile.company || ''}
                    onChange={(e) => handleProfileUpdate('company', e.target.value)}
                    onBlur={(e) => handleProfileFieldBlur('company', e.target.value)}
                    onKeyDown={(e) => handleProfileFieldKeyDown(e, 'company', clientProfile.company)}
                    ref={(el: HTMLInputElement | null) => (inputRefs.current['company'] = el)}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <p
                    className="text-gray-800 font-medium py-2 px-3 rounded-md hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleProfileFieldClick('company')}
                  >
                    {clientProfile.company || '-'}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="text-sm text-gray-700 font-semibold block mb-1">Teléfono</label>
                {editingField === 'phone' ? (
                  <input
                    type="tel"
                    value={clientProfile.phone || ''}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    onBlur={(e) => handleProfileFieldBlur('phone', e.target.value)}
                    onKeyDown={(e) => handleProfileFieldKeyDown(e, 'phone', clientProfile.phone)}
                    ref={(el: HTMLInputElement | null) => (inputRefs.current['phone'] = el)}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <p
                    className="text-gray-800 font-medium py-2 px-3 rounded-md hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleProfileFieldClick('phone')}
                  >
                    {clientProfile.phone || '-'}
                  </p>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="text-sm text-gray-700 font-semibold block mb-1">Email</label>
                {editingField === 'email' ? (
                  <input
                    type="email"
                    value={clientProfile.email || ''}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    onBlur={(e) => handleProfileFieldBlur('email', e.target.value)}
                    onKeyDown={(e) => handleProfileFieldKeyDown(e, 'email', clientProfile.email)}
                    ref={(el: HTMLInputElement | null) => (inputRefs.current['email'] = el)}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  />
                ) : (
                  <p
                    className="text-gray-800 font-medium py-2 px-3 rounded-md hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleProfileFieldClick('email')}
                  >
                    {clientProfile.email || '-'}
                  </p>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-md text-gray-800 font-semibold mb-3">Tags del cliente</h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {(clientProfile.tags || []).map((tag, index) => (
                  <div key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-orange-800 hover:text-orange-900"
                    >
                        Sentar
                    </button>
                    <button className="flex-1 min-w-[120px] bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                        Enviar
                    </button>
                  </div>
                ))}
                {(clientProfile.tags || []).length === 0 && (
                  <p className="text-gray-500 text-sm">No hay tags</p>
                )}
              </div>

              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Nuevo tag..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600"
                >
                  Añadir
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-md text-gray-800 font-semibold mb-3">Notas del perfil</h3>

              {editingField === 'notes' ? (
                <textarea
                  value={clientProfile.notes || ''}
                  onChange={(e) => handleProfileUpdate('notes', e.target.value)}
                  onBlur={(e) => handleProfileFieldBlur('notes', e.target.value)}
                  ref={(el: HTMLTextAreaElement | null) => (inputRefs.current['notes'] = el)}
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px] text-gray-900"
                  placeholder="Escribe notas sobre este cliente..."
                />
              ) : (
                <div
                  className="text-gray-800 whitespace-pre-wrap p-3 rounded-md hover:bg-orange-50 cursor-pointer min-h-[60px]"
                  onClick={() => handleProfileFieldClick('notes')}
                >
                  {clientProfile.notes || 'Haz clic para añadir notas...'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === 'reserva' && (
        <div className="border-t-2 border-orange-300 p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-200">
                  <span className="text-gray-700 font-medium">Tipo de reserva:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <button 
                      onClick={() => startEditing('reservationType', 'Reserva Estándar')}
                      className="text-blue-700 font-bold hover:text-blue-800 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-green-200">
                  <span className="text-gray-700 font-medium">Estado:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    {editingField === 'status' ? (
                      <select
                        value={tempValues.status || 'Reservado'}
                        onChange={(e) => setTempValues({ ...tempValues, status: e.target.value })}
                        onBlur={() => handleFieldEdit('status', tempValues.status)}
                        className="text-green-700 font-bold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <button 
                        onClick={() => startEditing('status', 'Reservado')}
                        className="text-green-700 font-bold hover:text-green-800 transition-colors"
                      >
                        Reservado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Sentar
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Enviar
              </button>
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Redimir código
              </button>
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <EditNoteModal
        isOpen={isEditingNote}
        onClose={() => setIsEditingNote(false)}
        onSave={handleNoteEdit}
        currentNote={table?.reservationInfo?.notes || ''}
      />
    </div>
  );
};

export default ReservationDetailsPanel;