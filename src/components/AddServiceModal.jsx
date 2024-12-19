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
        <h2 className="text-lg text-[#463DA6] font-bold mt-28">Nuevo Servicio</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b-4  pt-6 pl-2 pb-2 text-5xl w-full mb-8 outline-none text-[#463DA6] font-bold placeholder:text-2xl "
        />
        <div className="flex flex-col justify-end gap-4 mt-10">
          <button
            onClick={handleAdd}
            className="bg-[#463DA6] text-white rounded flex justify-center font-semibold items-center w-full p-4 gap-2 shadow-lg"
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="bg-white border border-[#463DA6] p-2  rounded text-[#463DA6] font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
