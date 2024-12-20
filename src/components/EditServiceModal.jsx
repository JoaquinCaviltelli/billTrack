import React, { useState } from "react";
import ConfirmacionModal from "./ConfirmacionModal";  // Importa el modal de confirmación

const EditServiceModal = ({
  service,
  serviceName,
  onClose,
  onSave,
  setServiceName,
  onDelete,
  handleDeleteService,
}) => {
  const [isConfirmacionOpen, setIsConfirmacionOpen] = useState(false); // Estado para el modal de confirmación

  // Función para abrir el modal de confirmación
  const handleDeleteClick = () => {
    setIsConfirmacionOpen(true); // Abre el modal de confirmación
  };

  // Función para confirmar la eliminación del servicio
  const handleConfirmarEliminar = () => {
    handleDeleteService(service.id); // Llama a la función de eliminación
    setIsConfirmacionOpen(false); // Cierra el modal de confirmación
  };

  // Función para cancelar la eliminación (solo cierra el modal)
  const handleCancelarEliminar = () => {
    setIsConfirmacionOpen(false); // Solo cierra el modal sin realizar la acción
  };

  return (
    <div className="fixed inset-0 bg-white">
      <div className="bg-white w-full max-w-lg px-6 flex justify-between flex-col h-full pb-10 mx-auto">
        <div>

        <h2 className="text-lg text-[#463DA6] font-bold mt-28">Editar Nombre del Servicio</h2>

        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="border-b-4 pt-6 pl-2 pb-2 text-5xl w-full mb-8 outline-none text-[#302A73] font-bold placeholder:text-2xl"
          placeholder="Nuevo nombre del servicio"
          />
        <div className="flex flex-col justify-end gap-4 mt-10">
          <button
            onClick={onSave}
            className="bg-[#463DA6] text-white rounded flex justify-center font-semibold items-center w-full p-4 gap-2 shadow-lg"
          >
            Guardar
          </button>
          
          <button
            onClick={onClose}
            className="bg-white border border-[#302A73] p-2 rounded text-[#302A73] font-semibold"
          >
            Cancelar
          </button>

        </div>
          </div>
        
          <button
            onClick={handleDeleteClick} // Muestra el modal de confirmación cuando se hace clic en "Eliminar Servicio"
            className="bg-gray-600 text-white p-3 mt-20  rounded"
          >
            Eliminar Servicio
          </button>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmacionModal
        isOpen={isConfirmacionOpen}
        mensaje="¿Estás seguro de que quieres eliminar este servicio?"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={handleCancelarEliminar}
      />
    </div>
  );
};

export default EditServiceModal;
