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
        className="border-b-2 pt-6 pl-2 pb-2 text-lg w-full outline-none text-gray-700 font-semibold"
        />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="border-b-2 pt-6 pl-2 pb-2 text-lg w-full outline-none text-gray-700 font-semibold"
        />

      <select
        value={tipoMovimiento}
        onChange={(e) => setTipoMovimiento(e.target.value)}
        className="border-b-2 pt-6 pl-1 pb-2 text-lg w-full outline-none text-gray-700 font-semibold"
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
        className="border-b-2 pt-6 pl-2 pb-2 text-lg w-full outline-none text-gray-700 font-semibold"
        />

      <div className="flex flex-col justify-end gap-2 mt-10">
        <button
          onClick={movimientoEditando ? handleGuardarEdicion : handleAddMovimiento}
          className="bg-gray-800 text-white px-4 py-2 rounded"
          >
          {movimientoEditando ? "Guardar Edición" : "Agregar Movimiento"}
        </button>
        <button
          onClick={handleCancelarEdicion}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
          Cancelar
        </button>

        {/* Botón Eliminar solo si estamos editando un movimiento */}
        {movimientoEditando && (
          <button
            onClick={() => handleEliminarMovimiento(movimientoEditando.id)}
            className="bg-red-500 text-white px-4 py-2 rounded mt-3"
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
