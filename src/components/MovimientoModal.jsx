// src/components/MovimientoModal.js

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
  return (
    <div className="fixed inset-0 bg-white flex justify-center">

    <div className="bg-white p-6 w-full max-w-lg ">
      <h2 className="text-xl text-gray-700 font-semibold mb-10">
        {movimientoEditando ? "Editar Movimiento" : "Agregar Movimiento"}
      </h2>

      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="border-b-2 pt-6 pl-2 pb-2  w-full outline-none text-gray-700 font-semibold"
        />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="border-b-2 pt-6 pl-2 pb-2 w-full outline-none text-gray-700 font-semibold"
        />

      <select
        value={tipoMovimiento}
        onChange={(e) => setTipoMovimiento(e.target.value)}
        className="border-b-2 pt-6 pl-1 pb-2  w-full outline-none text-gray-700 font-semibold"
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
        className="border-b-2 pt-6 pl-2 pb-2  w-full outline-none text-gray-700 font-semibold"
        />

      <div className="flex flex-col justify-end gap-4 mt-20">
        <button
          onClick={movimientoEditando ? handleGuardarEdicion : handleAddMovimiento}
          className="bg-[#302A73] text-white rounded flex justify-center font-semibold items-center w-full p-4 gap-2 shadow-lg"
          >
          {movimientoEditando ? "Guardar Edición" : "Agregar Movimiento"}
        </button>
        <button
          onClick={handleCancelarEdicion}
          className="bg-white border border-[#302A73] p-2  rounded text-[#302A73] font-semibold"
          >
          Cancelar
        </button>

        {/* Botón Eliminar solo si estamos editando un movimiento */}
        {movimientoEditando && (
          <button
            onClick={() => handleEliminarMovimiento(movimientoEditando.id)}
            className="bg-red-500 text-white px-4 py-3 font-semibold rounded mt-14"
            >
            Eliminar Movimiento
          </button>
        )}
      </div>
    </div>
        </div>
  );
};

export default MovimientoModal;
