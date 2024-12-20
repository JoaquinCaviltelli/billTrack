import React, { useState, useEffect } from "react";
import ConfirmacionModal from "./ConfirmacionModal";

// Array de los meses en español
const monthsInSpanish = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const BillModal = ({ isOpen, onClose, onSave, billData, onDelete }) => {
  const [amount, setAmount] = useState("");
  const [consumption, setConsumption] = useState("");
  const [month, setMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  ); // Mes actual en formato "MM"
  const [year, setYear] = useState(new Date().getFullYear()); // Año actual
  const [isConfirmacionOpen, setIsConfirmacionOpen] = useState(false); // Controlar la visibilidad del modal de confirmación

  useEffect(() => {
    if (billData) {
      setAmount(billData.amount);
      setConsumption(billData.consumption);
      setMonth(billData.month);
      setYear(billData.year);
    } else {
      setAmount("");  // Restablecer al agregar factura
      setConsumption("");  // Restablecer al agregar factura
      setMonth((new Date().getMonth() + 1).toString().padStart(2, "0"));
      setYear(new Date().getFullYear());
    }
  }, [billData]);

  const handleSave = () => {
    if (!amount) {
      alert("El importe es obligatorio");
      return;
    }
    const bill = {
      amount: parseFloat(amount),
      consumption: consumption ? parseFloat(consumption) : 0,
      month,
      year,
      date: new Date().toISOString(),
    };
    onSave(bill);
  };

  // Función que abre el modal de confirmación
  const handleDelete = () => {
    setIsConfirmacionOpen(true); // Abre el modal de confirmación
  };

  // Confirmar eliminación
  const handleConfirmarEliminar = () => {
    onDelete(billData.index); // Llamar a la función de eliminación
    setIsConfirmacionOpen(false); // Cerrar el modal de confirmación
  };

  // Cancelar eliminación
  const handleCancelarEliminar = () => {
    setIsConfirmacionOpen(false); // Solo cierra el modal sin realizar ninguna acción
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex justify-center">
      <div className="bg-white w-full max-w-lg px-6 flex flex-col justify-between pb-10">
        <div>

        <h2 className="text-xl text-[#463DA6] font-semibold mt-28 mb-10">
          {billData ? "Editar Factura" : "Agregar Factura"}
        </h2>

        <div className="mb-4 grid grid-cols-6 gap-6">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border-b-2 pt-6 pl-2 pb-2 text-lg w-full outline-none bg-white text-gray-700 font-semibold col-span-4"
            >
            {monthsInSpanish.map((monthName, index) => (
              <option
              key={index}
              value={(index + 1).toString().padStart(2, "0")}
              >
                {monthName}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border-b-2 pt-6 pl-2 pb-2 text-lg w-full outline-none bg-white text-gray-700 font-semibold col-span-2"
            >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>

        <input
          type="number"
          placeholder="Importe ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border-b-2 pt-6 pl-2 pb-2 text-lg w-full outline-none text-gray-700 font-semibold"
          />
        <input
          type="number"
          placeholder="Consumo"
          value={consumption}
          onChange={(e) => setConsumption(e.target.value)}
          className="border-b-2 pt-6 pl-2 pb-2 text-lg w-full outline-none text-gray-700 font-semibold"
          />

        <div className="flex flex-col justify-end gap-4 mt-20">
          <button
            onClick={handleSave}
            className="bg-[#463DA6] text-white p-4 rounded"
            >
            {billData ? "Guardar Cambios" : "Agregar Factura"}
          </button>

          <button onClick={onClose} className="bg-white text-[#463DA6] border-[#463DA6] border p-2 rounded">
            Cancelar
          </button>

        </div>
            </div>
          {/* Si estamos editando una factura, mostrar el botón de eliminar */}
          {billData && (
            <button
              onClick={handleDelete}
              className="bg-gray-600 text-white p-3 rounded mt-10"
            >
              Eliminar Factura
            </button>
          )}
      </div>

      {/* Modal de Confirmación */}
      <ConfirmacionModal
        isOpen={isConfirmacionOpen}
        mensaje="¿Estás seguro de que quieres eliminar esta factura?"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={handleCancelarEliminar}
      />
    </div>
  );
};

export default BillModal;
