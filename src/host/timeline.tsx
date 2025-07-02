import React, { useState } from 'react';
import Header from '../components/Header';
import NewReservationModal from '../components/NewReservationModal';
import ReservationDetailsPanel from '../components/ReservationDetailsPanel'; // Importamos el actualizado
import NuevaMesaModal from './NuevaMesaModal';
import WalkInModal from '../components/WalkInModal';


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
    date: string; // Agregado: Formato YYYY-MM-DD
    notes?: string;
    origin?: 'Restaurant' | 'Web' | 'Walk-in';
    createdAt?: string; // Ej: "02/07/2025, 10:48"
    duration?: string; // Agregado: Ej: "3h"
  };
}

interface Salon {
  id: string;
  name: string;
  tables: Table[];
}

interface NuevaMesaData {
  salonId: string;
  shape: 'round' | 'square' | 'rectangular';
  size: 'small' | 'medium' | 'large';
}

interface ReservationData {
    tableNumber?: number;
    guests: number | null;
    time: string | null;
    date: string; // Formato YYYY-MM-DD
    name: string;
    notes?: string;
    // No necesitamos origin aquí, lo asignamos al crear la reserva.
}
// ************************************************************
// FIN INTERFACES
// ************************************************************

const Timeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState('salon1A');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isReservationDetailsOpen, setIsReservationDetailsOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'reserva' | 'perfil' | 'historial' | 'actividad'>('reserva'); // Tipado para las pestañas
  const [isNuevaMesaModalOpen, setIsNuevaMesaModalOpen] = useState(false);

  const [salonsData, setSalonsData] = useState<Salon[]>([
    {
      id: 'salon1A',
      name: 'Salón 1 (A)',
      tables: [
        { id: 1, shape: 'round', size: 'small' },
        { id: 2, shape: 'round', size: 'small' },
        { id: 3, shape: 'round', size: 'small' },
        { id: 4, shape: 'round', size: 'small' },
        { id: 5, shape: 'round', size: 'small' },
        {
          id: 6,
          shape: 'square',
          size: 'medium',
          occupied: true, // ESTA DEBERÍA SER 'occupied' para Walk-in
          reservationInfo: {
            guestName: 'Carlos Rodriguez',
            time: '10:07 am',
            partySize: 3,
            salon: 'Salón 1 (A)',
            notes: 'Asiento al lado de una ventana, por favor.',
            origin: 'Walk-in',
            date: '2025-07-02', // Fecha del walk-in (hoy)
            createdAt: '02/07/2025, 10:07 am', // Formato de la imagen
            duration: 'N/A' // Duración para walk-in
          }
        },
        { id: 7, shape: 'square', size: 'medium' },
        { id: 8, shape: 'square', size: 'medium' },
        { id: 9, shape: 'square', size: 'medium' },
        { id: 10, shape: 'square', size: 'large' },
        { id: 11, shape: 'rectangular', size: 'large',
            reserved: true, // Esta mesa 11 de la imagen es 'reserved'
            reservationInfo: {
                guestName: 'asd',
                time: '4:30 PM',
                partySize: 10,
                salon: 'Salón 1 (A)',
                date: '2025-07-04', // Fecha de la imagen
                notes: '',
                origin: 'Restaurant', // Origen de la imagen
                createdAt: '02/07/2025, 10:48', // Fecha y hora de creación de la imagen
                duration: '3h' // Duración de la imagen
            }
        },
        { id: 12, shape: 'round', size: 'small' },
        { id: 13, shape: 'round', size: 'small' },
        { id: 14, shape: 'round', size: 'small' },
        { id: 15, shape: 'round', size: 'small' },
        { id: 16, shape: 'round', size: 'small' },
        { id: 17, shape: 'round', size: 'small' },
        { id: 18, shape: 'round', size: 'small' },
        { id: 19, shape: 'round', size: 'small' },
        { id: 20, shape: 'round', size: 'small' },
        { id: 160, shape: 'round', size: 'large' },
        { id: 161, shape: 'round', size: 'large' },
      ]
    },
    {
      id: 'salon1B',
      name: 'Salón 1 (B)',
      tables: []
    },
    {
      id: 'salon1C',
      name: 'Salón 1 (C)',
      tables: []
    },
    {
      id: 'salon2A',
      name: 'Salón 2 (A)',
      tables: []
    },
    {
      id: 'salon2B',
      name: 'Salón 2 (B)',
      tables: []
    },
    {
      id: 'salon2C',
      name: 'Salón 2 (C)',
      tables: []
    },
    {
      id: 'salonMesas',
      name: 'Salón Mesas Condición Especial',
      tables: []
    }
  ]);

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleNewReservation = () => {
    setIsReservationModalOpen(true);
  };

  const handleWalkIn = () => {
    setIsWalkInModalOpen(true);
  };

  const handleCloseReservationModal = () => {
    setIsReservationModalOpen(false);
  };

  const handleCreateReservation = (reservationData: ReservationData) => { // Usamos la interfaz actualizada
    const now = new Date();
    const createdAtFormatted = now.toLocaleDateString('es-ES', { // Formato DD/MM/YYYY
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('es-ES', { // Formato HH:MM AM/PM
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Asegura AM/PM
    }).replace('a. m.', 'am').replace('p. m.', 'pm'); // Ajusta para 'am'/'pm' si es necesario

    setSalonsData(prevSalons =>
      prevSalons.map(salon =>
        salon.id === activeTab
          ? {
              ...salon,
              tables: salon.tables.map(table =>
                table.id === reservationData.tableNumber
                  ? {
                      ...table,
                      reserved: true,
                      occupied: false,
                      reservationInfo: {
                        guestName: reservationData.name,
                        time: reservationData.time!, // Aseguramos que no sea null
                        partySize: reservationData.guests!, // Aseguramos que no sea null
                        salon: salon.name,
                        date: reservationData.date, // Añadimos la fecha
                        notes: reservationData.notes,
                        origin: 'Restaurant', // Origen por defecto para nuevas reservas
                        createdAt: createdAtFormatted, // Fecha y hora de creación
                        duration: '3h' // Puedes hacer esto configurable si es necesario
                      }
                    }
                  : table
              )
            }
          : salon
      )
    );

    // Actualizar selectedTable si la reserva se creó en la mesa actualmente seleccionada
    const updatedTableAfterCreation = salonsData
        .find(salon => salon.id === activeTab)
        ?.tables.find(table => table.id === reservationData.tableNumber);

    if (updatedTableAfterCreation) {
        setSelectedTable({
            ...updatedTableAfterCreation,
            reserved: true,
            occupied: false,
            reservationInfo: {
                guestName: reservationData.name,
                time: reservationData.time!,
                partySize: reservationData.guests!,
                salon: salonsData.find(salon => salon.id === activeTab)?.name || '',
                date: reservationData.date,
                notes: reservationData.notes,
                origin: 'Restaurant',
                createdAt: createdAtFormatted,
                duration: '3h'
            }
        });
        setIsReservationDetailsOpen(true); // Abrir el panel de detalles después de crear
    }
    setIsReservationModalOpen(false);
  };

  const handleConfirmWalkIn = (tableNumber: number, guestName: string, partySize: number, notes: string) => {
    const now = new Date();
    const createdAtFormatted = now.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace('a. m.', 'am').replace('p. m.', 'pm');

    setSalonsData(prevSalons =>
      prevSalons.map(salon =>
        salon.id === activeTab
          ? {
              ...salon,
              tables: salon.tables.map(table =>
                table.id === tableNumber
                  ? {
                      ...table,
                      occupied: true,
                      reserved: false,
                      reservationInfo: {
                        guestName: guestName,
                        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }).replace('a. m.', 'am').replace('p. m.', 'pm'),
                        partySize: partySize,
                        salon: salon.name,
                        date: now.toISOString().split('T')[0], // Fecha actual para walk-in
                        notes: notes,
                        origin: 'Walk-in',
                        createdAt: createdAtFormatted,
                        duration: 'N/A' // Duración no aplicable para walk-in en curso
                      }
                    }
                  : table
              )
            }
          : salon
      )
    );

    // Actualizar selectedTable y abrir detalles
    const updatedTableAfterWalkIn = salonsData
        .find(salon => salon.id === activeTab)
        ?.tables.find(t => t.id === tableNumber);

    if (updatedTableAfterWalkIn) {
        setSelectedTable({
            ...updatedTableAfterWalkIn,
            occupied: true,
            reserved: false,
            reservationInfo: {
                guestName: guestName,
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }).replace('a. m.', 'am').replace('p. m.', 'pm'),
                partySize: partySize,
                salon: salonsData.find(salon => salon.id === activeTab)?.name || '',
                date: now.toISOString().split('T')[0],
                notes: notes,
                origin: 'Walk-in',
                createdAt: createdAtFormatted,
                duration: 'N/A'
            }
        });
        setIsReservationDetailsOpen(true);
    }
    setIsWalkInModalOpen(false);
  };

  const handleUpdateReservation = (tableId: number, updates: Partial<Table['reservationInfo']>) => {
    setSalonsData(prevSalons =>
      prevSalons.map(salon => ({
        ...salon,
        tables: salon.tables.map(table =>
          table.id === tableId && table.reservationInfo
            ? {
                ...table,
                reservationInfo: {
                  ...table.reservationInfo,
                  ...updates
                }
              }
            : table
        )
      }))
    );

    if (selectedTable?.id === tableId) {
      setSelectedTable(prev => prev ? {
        ...prev,
        reservationInfo: prev.reservationInfo ? {
          ...prev.reservationInfo,
          ...updates
        } : undefined
      } : null);
    }
  };

  const handleChangeTableInit = (currentTableId: number) => {
    const tableToMoveData = salonsData.flatMap(s => s.tables).find(t => t.id === currentTableId);
    if (tableToMoveData) {
      setIsChangingTable(true);
      setTableToMove(tableToMoveData);
      setIsReservationDetailsOpen(false);
      setSelectedTable(null);
      alert(`Selecciona la nueva mesa para mover la reserva de la Mesa ${currentTableId}.`);
    } else {
      alert('Error: No se encontró la mesa actual para mover.');
    }
  };

  const handleChangeTableConfirm = (currentTableId: number, newTableId: number) => {
    setSalonsData(prevSalons => {
      let movedReservationInfo: Table['reservationInfo'] | undefined = undefined;
      let currentTableOrigin: 'Restaurant' | 'Web' | 'Walk-in' | undefined = undefined;
      let isTableOccupied: boolean | undefined = undefined; // Para saber si era occupied o reserved

      const updatedSalonsAfterFreeing = prevSalons.map(salon => ({
        ...salon,
        tables: salon.tables.map(table => {
          if (table.id === currentTableId) {
            movedReservationInfo = table.reservationInfo;
            currentTableOrigin = table.reservationInfo?.origin;
            isTableOccupied = table.occupied; // Guardar si estaba ocupada o reservada
            return { ...table, occupied: false, reserved: false, reservationInfo: undefined };
          }
          return table;
        })
      }));

      const updatedSalonsAfterOccupying = updatedSalonsAfterFreeing.map(salon => ({
        ...salon,
        tables: salon.tables.map(table => {
          if (table.id === newTableId && movedReservationInfo) {
            const newSalon = updatedSalonsAfterFreeing.find(s => s.tables.some(t => t.id === newTableId));
            const updatedReservationInfo = {
              ...movedReservationInfo!, // Aseguramos que no es undefined
              salon: newSalon ? newSalon.name : movedReservationInfo!.salon // Actualiza el salón en la info
            };

            return {
              ...table,
              // Mantiene el estado original (occupied/reserved) al mover
              occupied: isTableOccupied,
              reserved: !isTableOccupied,
              reservationInfo: updatedReservationInfo
            };
          }
          return table;
        })
      }));
      return updatedSalonsAfterOccupying;
    });

    alert(`Comensal movido de Mesa ${currentTableId} a Mesa ${newTableId}.`);
  };

  const handleFinalizeWalkIn = (tableId: number) => {
    setSalonsData(prevSalons =>
      prevSalons.map(salon => ({
        ...salon,
        tables: salon.tables.map(table =>
          table.id === tableId
            ? { ...table, occupied: false, reserved: false, reservationInfo: undefined }
            : table
        )
      }))
    );
    setSelectedTable(null);
    setIsReservationDetailsOpen(false);
    alert(`Walk-in de Mesa ${tableId} finalizado.`);
  };

  // NUEVA FUNCIÓN: Eliminar Reserva
  const handleDeleteReservation = (tableId: number) => {
    setSalonsData(prevSalons =>
      prevSalons.map(salon => ({
        ...salon,
        tables: salon.tables.map(table =>
          table.id === tableId
            ? { ...table, occupied: false, reserved: false, reservationInfo: undefined }
            : table
        )
      }))
    );
    setSelectedTable(null); // Deseleccionar la mesa
    setIsReservationDetailsOpen(false); // Cerrar el panel de detalles
    alert(`Reserva de Mesa ${tableId} eliminada.`);
  };

  const getTableStyle = (table: Table) => {
    const baseClasses = "flex items-center justify-center text-white font-medium cursor-pointer transition-all duration-200 hover:scale-105";

    let shapeClasses = "";
    let sizeClasses = "";
    let bgColor = "bg-[#3C2022]"; // Default: Available

    if (table.reserved) {
      bgColor = "bg-[#8B4513]"; // Reserved
    } else if (table.occupied) {
      bgColor = "bg-red-600"; // Occupied (e.g., by walk-in)
    }

    const isSelected = selectedTable?.id === table.id;
    const isTargetTable = isChangingTable && !table.occupied && !table.reserved;
    const selectionClass = isSelected ? "ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-800" : "";
    const targetClass = isTargetTable ? "ring-2 ring-green-400 ring-offset-2 ring-offset-slate-800 animate-pulse" : "";

    switch (table.shape) {
      case 'round':
        shapeClasses = "rounded-full border-2 border-dashed border-orange-400";
        break;
      case 'square':
        shapeClasses = "border-2 border-orange-400";
        break;
      case 'rectangular':
        shapeClasses = "border-2 border-dashed border-orange-400";
        break;
    }

    switch (table.size) {
      case 'small':
        sizeClasses = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs sm:text-sm";
        break;
      case 'medium':
        sizeClasses = "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-xs sm:text-base";
        break;
      case 'large':
        sizeClasses = table.shape === 'rectangular' 
          ? "w-14 h-10 sm:w-20 sm:h-12 md:w-24 md:h-16 text-xs sm:text-base" 
          : "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-xs sm:text-base md:text-lg";
        break;
    }

    return `${baseClasses} ${shapeClasses} ${sizeClasses} ${selectionClass} ${targetClass} ${bgColor}`;
  };

  const getTableGridPosition = (tableId: number) => {
    const positions: { [key: number]: string } = {
      1: "col-start-2 row-start-1",
      2: "col-start-4 row-start-1",
      3: "col-start-2 row-start-2",
      4: "col-start-4 row-start-2",
      5: "col-start-4 row-start-3",
      6: "col-start-2 row-start-3",
      7: "col-start-3 row-start-3",
      8: "col-start-2 row-start-4",
      9: "col-start-3 row-start-4",
      10: "col-start-2 row-start-5 col-span-2",
      11: "col-start-2 row-start-6 col-span-2",
      12: "col-start-6 row-start-6",
      13: "col-start-6 row-start-5",
      14: "col-start-6 row-start-4",
      15: "col-start-6 row-start-3",
      16: "col-start-6 row-start-2",
      17: "col-start-6 row-start-1",
      18: "col-start-5 row-start-1",
      19: "col-start-5 row-start-2",
      20: "col-start-5 row-start-3",
      160: "col-start-4 row-start-7",
      161: "col-start-3 row-start-7",
    };
    return positions[tableId] || "";
  };

  const currentSalon = salonsData.find(salon => salon.id === activeTab);

  const handleOpenNuevaMesaModal = () => {
    setIsNuevaMesaModalOpen(true);
  };

  const handleAddNewTable = (tableData: NuevaMesaData) => {
    const allTableIds = salonsData.flatMap(s => s.tables.map(t => t.id));
    const maxId = allTableIds.length > 0 ? Math.max(...allTableIds) : 0;
    const newTableId = maxId + 1;

    setSalonsData(prevSalons =>
      prevSalons.map(salon =>
        salon.id === tableData.salonId
          ? {
              ...salon,
              tables: [
                ...salon.tables,
                {
                  id: newTableId,
                  shape: tableData.shape,
                  size: tableData.size
                }
              ]
            }
          : salon
      )
    );

    if (tableData.salonId !== activeTab) {
      setActiveTab(tableData.salonId);
    }
    setIsNuevaMesaModalOpen(false);
  };

  return (
    <div className="h-screen bg-slate-800 text-white flex flex-col">
      <Header salones={salonsData} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col border-r border-slate-700" style={{ backgroundColor: '#211B17', width: '477px' }}>
          <div className="p-4 pb-2">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar"
                className="w-full text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-600"
                style={{ backgroundColor: '#4c4037' }}
              />
            </div>
          </div>

                <div className="flex-1 overflow-y-auto p-4 pt-2 flex flex-col">
                    <div className="flex-1">
                        {isChangingTable && tableToMove && (
                            <div className="bg-yellow-800 text-white p-3 rounded-lg mb-4 text-center animate-pulse">
                                <p className="font-bold">Modo: Mover Mesa {tableToMove.id}</p>
                                <p className="text-sm">Haz clic en una mesa libre para mover la reserva.</p>
                                <button
                                    onClick={() => { setIsChangingTable(false); setTableToMove(null); }}
                                    className="mt-2 text-xs underline hover:text-yellow-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                        {selectedTable ? (
                            // La lógica para mostrar el resumen de la reserva aquí solo se activa si
                            // el panel de detalles NO está abierto y la mesa está reservada/ocupada.
                            // Si el panel de detalles está abierto, se encarga el componente ReservationDetailsPanel.
                            !isReservationDetailsOpen && (selectedTable.reserved || selectedTable.occupied) ? (
                                <div
                                    className="rounded-lg p-4 space-y-4 cursor-pointer hover:bg-opacity-90 transition-all duration-200"
                                    style={{ backgroundColor: '#F7F7ED' }}
                                    onClick={() => setIsReservationDetailsOpen(true)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg
                                          ${selectedTable.reserved ? 'bg-orange-500' : 'bg-red-600'}`
                                        }>
                                            {selectedTable.reservationInfo?.guestName.split(' ').map(n => n[0]).join('') || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-900">{selectedTable.reservationInfo?.guestName || 'N/A'}</h3>
                                            <p className="text-sm text-gray-500">
                                                 {selectedTable.reserved ? 'Reservado' : 'Ocupado (Walk-in)'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0114 0z" /></svg>
                                            <span>{selectedTable.reservationInfo?.time}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            <span>{selectedTable.reservationInfo?.partySize}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h3 className="text-lg font-medium mb-2">Mesa {selectedTable.id}</h3>
                                    <p className="text-gray-300 text-sm mb-4">Mesa disponible</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center text-gray-400 mt-8">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p>Selecciona una mesa o agrega una nueva</p>
                            </div>
                        )}
                    </div>

                    {selectedTable && !selectedTable.reserved && !selectedTable.occupied && !isChangingTable && (
                        <div className="space-y-3 mt-4">
                            <button
                                onClick={handleNewReservation}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Nueva reserva</span>
                            </button>

                            <div className="flex space-x-2">
                                <button
                                    onClick={handleWalkIn}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Sentar Walk-in</span>
                                </button>

                                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-3 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>

        {!isReservationDetailsOpen ? (
          <div className="flex-1 bg-slate-100 flex flex-col">
            <div className="bg-white border-b border-gray-200">
              <div className="flex space-x-0 items-center">
                {salonsData.map((salon) => (
                  <button
                    key={salon.id}
                    onClick={() => setActiveTab(salon.id)}
                    className={`px-6 py-3 text-sm font-medium border-r border-gray-200 transition-colors ${
                      activeTab === salon.id
                        ? 'bg-gray-50 text-gray-900 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {salon.name}
                  </button>
                ))}
                <button
                  onClick={handleOpenNuevaMesaModal}
                  className="ml-2 px-4 py-2 bg-[#FF6900] text-white font-medium rounded-md hover:bg-orange-600 transition-colors flex items-center shadow-md"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Nueva mesa</span>
                </button>
              </div>
            </div>

            <div className="p-8 h-full">
              {currentSalon && currentSalon.tables.length > 0 ? (
                <div className="grid grid-cols-8 grid-rows-8 gap-4 h-full max-w-4xl mx-auto">
                  {currentSalon.tables.map((table) => (
                    <div
                      key={table.id}
                      className={`${getTableStyle(table)} ${getTableGridPosition(table.id)}`}
                      onClick={() => handleTableClick(table)}
                    >
                      {table.id}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No hay mesas configuradas para este salón</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ReservationDetailsPanel
            isOpen={isReservationDetailsOpen}
            onClose={() => setIsReservationDetailsOpen(false)}
            table={selectedTable}
            activeTab={activeDetailsTab}
            setActiveTab={setActiveDetailsTab}
            onUpdateReservation={handleUpdateReservation}
          />
        )}
      </div>

      {/* Modales */}
      <NewReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleCloseReservationModal}
        tableNumber={selectedTable?.id}
        onReservationCreate={handleCreateReservation}
      />

      <NuevaMesaModal
        isOpen={isNuevaMesaModalOpen}
        onClose={() => setIsNuevaMesaModalOpen(false)}
        onAddTable={handleAddNewTable}
        salons={salonsData}
      />

      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        tableNumber={selectedTable?.id}
        onConfirmWalkIn={handleConfirmWalkIn}
      />
    </div>
  );
};

export default Timeline;