import React from "react";

const EditServiceModal = ({ service, serviceName, onClose, onSave, setServiceName, onDelete, handleDeleteService }) => {

  return (
    <div className="fixed inset-0 bg-white flex justify-center">
      <div className="bg-white w-full max-w-lg px-6">
        <h2 className="text-lg text-[#302A73] font-bold mt-28">Editar Nombre del Servicio</h2>
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
            className="bg-[#302A73] text-white rounded flex justify-center font-semibold items-center w-full p-4 gap-2 shadow-lg"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-white border border-[#302A73] p-2 rounded text-[#302A73] font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteService}
            className="bg-red-700 text-white p-3 mt-14 rounded"
          >
            Eliminar Servicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
