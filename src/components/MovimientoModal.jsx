// src/components/MovimientoModal.js
import React, { useState } from "react";
import ConfirmacionModal from "./ConfirmacionModal";

const MovimientoModal = ({
  movimientoEditando,
  descripcion,
  monto,
  tipoMovimiento,
  fecha,
  setDescripcion,
  setMonto,
  setTipoMovimiento,
  setFecha,
  handleAddMovimiento,
  handleGuardarEdicion,
  handleCancelarEdicion,
  handleEliminarMovimiento,
}) => {
  const [isConfirmacionOpen, setIsConfirmacionOpen] = useState(false);

  const handleEliminarClick = (id) => {
    setIsConfirmacionOpen(true); // Abre el modal de confirmación
  };

  const handleConfirmarEliminar = (id) => {
    handleEliminarMovimiento(id); // Llama a la función de eliminar
    setIsConfirmacionOpen(false); // Cierra el modal de confirmación
  };

  const handleCancelarEliminar = () => {
    setIsConfirmacionOpen(false); // Solo cierra el modal si el usuario cancela
  };

  return (
    <div className="fixed inset-0 bg-white flex justify-center">
      <div className="bg-white px-6 pb-10 w-full max-w-lg flex flex-col justify-between">
        <div>

        
        <h2 className="text-xl text-[#A63D3D] font-semibold mt-28 mb-10">
          {movimientoEditando ? "Editar Movimiento" : "Agregar Movimiento"}
        </h2>

        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="border-b-2 pt-6 pl-2 pb-2 w-full outline-none text-gray-700 font-semibold"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border-b-2 pt-6 pl-2 pb-2 w-full outline-none text-gray-700 font-semibold bg-white"
        />

        <select
          value={tipoMovimiento}
          onChange={(e) => setTipoMovimiento(e.target.value)}
          className="border-b-2 pt-6 pl-1 pb-2 w-full outline-none text-gray-700 font-semibold bg-white"
        >
          <option value="Deposito">Deposito (Ingreso)</option>
          <option value="Retiro">Retiro (Ingreso)</option>
          <option value="Intereses">Intereses (Ingreso)</option>
          <option value="Facturas">Facturas (Egreso)</option>
          <option value="Remesa">Remesa (Egreso)</option>
          <option value="Pagos">Pagos (Egreso)</option>
        </select>

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border-b-2 pt-6 pl-2 pb-2 w-full outline-none text-gray-700 font-semibold"
        />

        <div className="flex flex-col justify-end gap-4 mt-20">
          <button
            onClick={movimientoEditando ? handleGuardarEdicion : handleAddMovimiento}
            className="bg-[#A63D3D] text-white rounded flex justify-center font-semibold items-center w-full p-4 gap-2 shadow-lg"
          >
            {movimientoEditando ? "Guardar Edición" : "Agregar Movimiento"}
          </button>
          <button
            onClick={handleCancelarEdicion}
            className="bg-white border border-[#A63D3D] p-2 rounded text-[#A63D3D] font-semibold"
          >
            Cancelar
          </button>

        </div>
        </div>
          {/* Botón Eliminar solo si estamos editando un movimiento */}
          {movimientoEditando && (
            <button
              onClick={() => handleEliminarClick(movimientoEditando.id)}
              className="bg-gray-600 text-white px-4 py-3 font-semibold rounded"
            >
              Eliminar Movimiento
            </button>
          )}
      </div>

      {/* Modal de Confirmación */}
      <ConfirmacionModal
        isOpen={isConfirmacionOpen}
        mensaje="¿Estás seguro de que quieres eliminar este movimiento?"
        onConfirmar={() => handleConfirmarEliminar(movimientoEditando.id)}
        onCancelar={handleCancelarEliminar}
      />
    </div>
  );
};

export default MovimientoModal;
