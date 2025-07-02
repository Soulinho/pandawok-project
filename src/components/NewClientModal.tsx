import React, { useState } from 'react';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreate: (clientData: {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    empresa: string;
    cumpleanos: string;
    membresia: string;
    tags: string[];
  }) => void; // Define la forma de los datos del cliente
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onClientCreate }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cumpleanos, setCumpleanos] = useState('');
  const [membresia, setMembresia] = useState('');
  const [tags, setTags] = useState(''); // Asumiendo un string simple para entrada, luego se convierte a array

  if (!isOpen) return null;

  const handleCreateClient = () => {
    // Aquí puedes agregar validaciones si es necesario
    const clientData = {
      nombre,
      apellido,
      telefono,
      email,
      empresa,
      cumpleanos,
      membresia,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Convertir string de tags a array
    };
    onClientCreate(clientData); // Llama a la función proporcionada por el padre
    onClose(); // Cierra este modal
    // Limpiar los campos del formulario
    setNombre('');
    setApellido('');
    setTelefono('');
    setEmail('');
    setEmpresa('');
    setCumpleanos('');
    setMembresia('');
    setTags('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Nuevo Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800"
            />
          </div>
          {/* Apellido */}
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input
              type="text"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Apellido"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800"
            />
          </div>
          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                <img
                  src="https://flagcdn.com/w20/cl.png" // Bandera de Chile
                  alt="Chile Flag"
                  className="w-5 h-auto rounded absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <select
                  className="pl-9 pr-2 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.8em', paddingRight: '2rem' }}
                >
                  <option>+56</option>
                  {/* Puedes añadir más códigos de país si lo deseas */}
                </select>
              </div>
              <input
                type="text"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Teléfono"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800"
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800"
            />
          </div>
          {/* Empresa */}
          <div>
            <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <input
              type="text"
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Empresa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800"
            />
          </div>
          {/* Cumpleaños */}
          <div>
            <label htmlFor="cumpleanos" className="block text-sm font-medium text-gray-700 mb-1">Cumpleaños</label>
            <input
              type="date"
              id="cumpleanos"
              value={cumpleanos}
              onChange={(e) => setCumpleanos(e.target.value)}
              placeholder="Cumpleaños"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800"
            />
          </div>
          {/* # Membresía */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="membresia" className="block text-sm font-medium text-gray-700 mb-1"># Membresía</label>
            <input
              type="text"
              id="membresia"
              value={membresia}
              onChange={(e) => setMembresia(e.target.value)}
              placeholder="# Membresía"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800"
            />
          </div>
          {/* Tags del cliente */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags del cliente</label>
            <div className="relative">
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Toca para agregar tags (ej: VIP, Frecuente)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-800 pl-10"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5.5c.583 0 1.15.176 1.636.516l5.247 3.51a3 3 0 01.011 4.974l-5.247 3.51A3 3 0 0012.5 21H7a2 2 0 01-2-2v-9a2 2 0 012-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateClient}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Crear Cliente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewClientModal;