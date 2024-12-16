import React, { useState } from "react";
import { useServices } from "../context/ServicesContext";

const AddServiceModal = ({ onClose }) => {
  const { addService } = useServices();
  const [name, setName] = useState("");

  const handleAdd = async () => {
      onClose();
    if (!name) return;
    await addService(name);
  };

  return (
    <div className="fixed inset-0 bg-white flex justify-center">
      <div className="bg-white w-full max-w-lg px-6">
        <h2 className="text-lg text-gray-700 font-semibold mt-28">Nuevo Servicio</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b-4 pt-6 pl-2 pb-2 text-5xl w-full mb-8 outline-none text-gray-700 font-bold placeholder:text-2xl"
        />
        <div className="flex flex-col justify-end gap-2">
          <button
            onClick={handleAdd}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
