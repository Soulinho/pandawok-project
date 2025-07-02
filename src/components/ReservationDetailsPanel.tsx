import React, { useState } from 'react';

// Asegúrate de que estas interfaces sean consistentes con tu Timeline.tsx
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
    if (!isOpen || !table || (!table.reserved && !table.occupied) || !table.reservationInfo) return null;

    const { reservationInfo } = table;

    const handleEliminarClick = () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la reserva de ${reservationInfo.guestName} en la Mesa ${table.id}?`)) {
            onDeleteReservation(table.id);
            onClose(); // Cerrar el panel después de eliminar
        }
    };

    const handleSentarClick = () => {
        // Lógica para "Sentar" - Si es una reserva, la convierte en walk-in/ocupada.
        // Si ya está sentada (walk-in), esta función no debería aparecer o hacer algo diferente.
        if (table.reserved) {
            onUpdateReservation(table.id, { origin: 'Walk-in' });
            // Esto es solo un ejemplo, puedes añadir más lógica si es necesario
            // Por ejemplo, cambiar el estado 'reserved' a 'occupied' en el Timeline
        }
        // Puedes agregar más lógica aquí si "Sentar" tiene otros significados
    };

    const handleCambiarMesaClick = () => {
        if (table.occupied || table.reserved) {
            onChangeTable(table.id);
            onClose(); // Cerrar el panel para permitir la selección de nueva mesa
        } else {
            alert('Esta mesa no tiene una reserva activa o walk-in para mover.');
        }
    };

    const isWalkIn = table.occupied && reservationInfo.origin === 'Walk-in';

    const getFormattedDate = (isoDate: string) => {
        try {
            const date = new Date(isoDate);
            if (isNaN(date.getTime())) {
                // Fallback si el formato ISO no es válido (ej: "Vie, 04 de Julio")
                // Intentar parsear el formato "dd/mm/yyyy" si es posible, o usarlo directamente.
                const parts = isoDate.split('/');
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (!isNaN(parsedDate.getTime())) {
                        return parsedDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' });
                    }
                }
                return isoDate; // Retorna el string original si no se puede parsear
            }
            return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' });
        } catch (error) {
            console.error("Error al formatear la fecha:", isoDate, error);
            return isoDate; // En caso de error, retorna el string original
        }
    };

    const getCreatedDateFormatted = (dateString: string) => {
        // Asumiendo que dateString es "DD/MM/YYYY a las HH:MM PM/AM"
        // Necesitamos parsear esto para crear un objeto Date válido o simplemente mostrarlo.
        // Para simplificar, si ya está formateado así, lo mostramos.
        // Si viene de new Date().toLocaleDateString(...), ya debería estar bien.
        return dateString;
    };

    // Esto simula el ID de contacto y número de teléfono de la imagen
    const contactId = reservationInfo.guestName.split(' ')[0].toLowerCase();
    const phoneNumber = '+56 09 8101 3400'; // Ejemplo fijo

    return (
        <div className="bg-[#2C2B3C] text-white flex flex-col h-full overflow-hidden">
            {/* Header del modal/panel */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <span className="text-xl font-semibold text-gray-100">
                    {table.id}
                </span>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Contenido principal del panel de detalles */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {/* Info de Walk-in/Reserva Actual */}
                {isWalkIn ? (
                    <div className="py-2 mb-4">
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Sentado Actualmente</p>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-white">{reservationInfo.guestName}</h3>
                                <div className="flex items-center text-gray-300 text-sm mt-1">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{reservationInfo.time}</span>
                                    <svg className="w-4 h-4 ml-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <span>{reservationInfo.partySize}</span>
                                </div>
                            </div>
                            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h6l-1-1-1.25-3M15 10V5a3 3 0 00-3-3m0 0a5 5 0 00-5 5v5l-.75 3M12 14v4h3M5 14h6l-1 1m-4-7h5.25" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={handleCambiarMesaClick}
                                className="flex-1 border border-blue-500 text-blue-400 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                            >
                                Cambiar de Mesa
                            </button>
                            <button
                                onClick={() => onFinalizeWalkIn(table.id)}
                                className="flex-1 border border-gray-600 text-gray-300 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Finalizar
                            </button>
                        </div>
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

                        {/* Pestañas de Navegación */}
                        <div className="flex mt-4 border-b border-gray-700">
                            <button
                                onClick={() => setActiveTab('reserva')}
                                className={`px-4 py-2 text-sm font-medium ${activeTab === 'reserva' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Reserva
                            </button>
                            <button
                                onClick={() => setActiveTab('perfil')}
                                className={`px-4 py-2 text-sm font-medium ${activeTab === 'perfil' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Perfil
                            </button>
                            <button
                                onClick={() => setActiveTab('historial')}
                                className={`px-4 py-2 text-sm font-medium ${activeTab === 'historial' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Historial
                            </button>
                            <button
                                onClick={() => setActiveTab('actividad')}
                                className={`px-4 py-2 text-sm font-medium ${activeTab === 'actividad' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Actividad
                            </button>
                            {/* Este botón "LISTO" se ve estático en la imagen, lo coloco al final */}
                            <button className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold self-center">
                                LISTO
                            </button>
                        </div>

                        {/* Contenido de la Pestaña "Reserva" */}
                        {activeTab === 'reserva' && (
                            <div className="py-4 space-y-4">
                                <p className="text-gray-400 text-xs">Origen: <span className="text-purple-400">{reservationInfo.origin || 'N/A'}</span></p>
                                <p className="text-gray-400 text-xs">Creada el: <span className="text-white">{getCreatedDateFormatted(reservationInfo.createdAt || 'N/A')}</span></p>

                                {/* Grid de Detalles */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-[#4c4037] rounded-lg flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <div>
                                            <p className="text-xs text-gray-400">Fecha</p>
                                            <p className="font-medium text-white">{getFormattedDate(reservationInfo.date || 'N/A')}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#4c4037] rounded-lg flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <div>
                                            <p className="text-xs text-gray-400">Hora</p>
                                            <p className="font-medium text-white">{reservationInfo.time}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#4c4037] rounded-lg flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        <div>
                                            <p className="text-xs text-gray-400">Personas</p>
                                            <p className="font-medium text-white">{reservationInfo.partySize}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#4c4037] rounded-lg flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <div>
                                            <p className="text-xs text-gray-400">Duración</p>
                                            <p className="font-medium text-white">{reservationInfo.duration || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-[#4c4037] rounded-lg flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10v11h18V10M3 10h18M3 10V7a2 2 0 012-2h14a2 2 0 012 2v3M3 10V7a2 2 0 012-2h14a2 2 0 012 2v3" /></svg>
                                    <div>
                                        <p className="text-xs text-gray-400">Mesa</p>
                                        <p className="font-medium text-white">[{reservationInfo.salon}] Mesa {table.id}</p>
                                    </div>
                                </div>

                                {/* Tags de la reserva */}
                                <div className="p-3 bg-[#4c4037] rounded-lg">
                                    <p className="text-xs text-gray-400 mb-2">Tags de la reserva</p>
                                    <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Toca para agregar tags
                                    </button>
                                </div>

                                {/* Tipo de Reserva y Estado */}
                                <div className="p-3 bg-[#4c4037] rounded-lg">
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-xs text-gray-400">Tipo de reserva:</p>
                                            <p className="font-medium text-white">
                                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                                Reserva Estándar
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Estado:</p>
                                            <p className="font-medium text-white">
                                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                                Reservado
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Aquí irían los contenidos de las otras pestañas (Perfil, Historial, Actividad) */}
                    </>
                )}
            </div>

            {/* Botones de acción al final */}
            {!isWalkIn && ( // No mostrar estos botones si es un Walk-in (ya tiene Cambiar/Finalizar)
                <div className="p-4 border-t border-gray-700 flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={handleSentarClick}
                        className="flex-1 min-w-[120px] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sentar
                    </button>
                    <button className="flex-1 min-w-[120px] bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                        Enviar
                    </button>
                    <button className="flex-1 min-w-[120px] bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                        Redimir código
                    </button>
                    <button
                        onClick={handleEliminarClick}
                        className="flex-1 min-w-[120px] bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReservationDetailsPanel;