// src/components/ConfirmacionModal.js
import React from "react";

const ConfirmacionModal = ({ isOpen, mensaje, onConfirmar, onCancelar }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg">
        <h3 className="text-lg text-gray-800 font-semibold">{mensaje}</h3>
        <div className="flex justify-between mt-6">
          <button
            onClick={onConfirmar}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            Eliminar
          </button>
          <button
            onClick={onCancelar}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionModal;
