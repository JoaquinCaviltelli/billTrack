// src/pages/ExtractoBancario.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  db,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "/src/firebase/config.js";
import moment from "moment";
import MovimientoModal from "/src/components/MovimientoModal";

const ExtractoBancario = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("Deposito");
  const [saldo, setSaldo] = useState(0);
  const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [movimientoEditando, setMovimientoEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] =
    useState(false);
  const [movimientoAEliminar, setMovimientoAEliminar] = useState(null);

  const obtenerMovimientos = async () => {
    try {
      const q = query(collection(db, "movimientos"), orderBy("fecha", "asc"));
      const querySnapshot = await getDocs(q);
      const movimientosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let saldoAcumulado = 0;
      const movimientosOrdenados = movimientosData.map((mov) => {
        if (["Deposito", "Retiro", "Intereses"].includes(mov.tipoMovimiento)) {
          saldoAcumulado += mov.monto;
        } else if (
          ["Facturas", "Remesa", "Pagos"].includes(mov.tipoMovimiento)
        ) {
          saldoAcumulado -= mov.monto;
        }

        return {
          ...mov,
          saldo: saldoAcumulado,
        };
      });

      setMovimientos(movimientosOrdenados);
      setSaldo(saldoAcumulado);
    } catch (error) {
      console.error("Error al obtener los movimientos: ", error);
    }
  };

  const handleAddMovimiento = async () => {
    if (monto !== "") {
      const fechaFormateada = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
      const importe = parseFloat(monto);

      let nuevoSaldo = saldo;

      if (["Deposito", "Retiro", "Intereses"].includes(tipoMovimiento)) {
        nuevoSaldo += importe;
      } else if (["Facturas", "Remesa", "Pagos"].includes(tipoMovimiento)) {
        nuevoSaldo -= importe;
      }

      const nuevoMovimiento = {
        fecha: fechaFormateada,
        tipoMovimiento,
        monto: importe,
        descripcion: descripcion || "", // Si no hay descripción, se guarda como cadena vacía
        saldo: nuevoSaldo,
      };

      try {
        await addDoc(collection(db, "movimientos"), nuevoMovimiento);
        setMovimientos([nuevoMovimiento, ...movimientos]);
        setSaldo(nuevoSaldo);

        setDescripcion("");
        setMonto("");
        setFecha(moment().format("YYYY-MM-DD"));
        setModalVisible(false);
        obtenerMovimientos()
      } catch (error) {
        console.error("Error al agregar movimiento a Firebase: ", error);
      }
    } else {
      alert("Por favor, ingresa un monto.");
    }
  };

  const handleEditarMovimiento = (movimiento) => {
    setMovimientoEditando(movimiento);
    setDescripcion(movimiento.descripcion);
    setMonto(movimiento.monto);
    setTipoMovimiento(movimiento.tipoMovimiento);
    setFecha(moment(movimiento.fecha).format("YYYY-MM-DD"));
    setModalVisible(true);
    obtenerMovimientos()
  };

  const handleGuardarEdicion = async () => {
    if (monto !== "") {
      const fechaFormateada = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
      const importe = parseFloat(monto);

      let nuevoSaldo = saldo;

      if (["Deposito", "Retiro", "Intereses"].includes(tipoMovimiento)) {
        nuevoSaldo += importe;
      } else if (["Facturas", "Remesa", "Pagos"].includes(tipoMovimiento)) {
        nuevoSaldo -= importe;
      }

      const movimientoActualizado = {
        ...movimientoEditando,
        fecha: fechaFormateada,
        tipoMovimiento,
        monto: importe,
        descripcion: descripcion || "", // Si no hay descripción, se guarda como cadena vacía
        saldo: nuevoSaldo,
      };

      try {
        const movimientoRef = doc(db, "movimientos", movimientoEditando.id);
        await updateDoc(movimientoRef, movimientoActualizado);

        setMovimientos(
          movimientos.map((mov) =>
            mov.id === movimientoEditando.id ? movimientoActualizado : mov
          )
        );
        setSaldo(nuevoSaldo);

        setMovimientoEditando(null);
        setDescripcion("");
        setMonto("");
        setFecha(moment().format("YYYY-MM-DD"));
        setModalVisible(false);
        obtenerMovimientos()
      } catch (error) {
        console.error("Error al actualizar movimiento: ", error);
      }
    } else {
      alert("Por favor, ingresa un monto.");
    }
  };

  const handleEliminarMovimiento = async (id) => {
    try {
      const movimientoRef = doc(db, "movimientos", id);
      await deleteDoc(movimientoRef);

      setMovimientos(movimientos.filter((mov) => mov.id !== id));

      let saldoAcumulado = 0;
      const movimientosActualizados = movimientos
        .filter((mov) => mov.id !== id)
        .map((mov) => {
          if (
            ["Deposito", "Retiro", "Intereses"].includes(mov.tipoMovimiento)
          ) {
            saldoAcumulado += mov.monto;
          } else if (
            ["Facturas", "Remesa", "Pagos"].includes(mov.tipoMovimiento)
          ) {
            saldoAcumulado -= mov.monto;
          }

          return {
            ...mov,
            saldo: saldoAcumulado,
          };
        });

      setSaldo(saldoAcumulado);
      setMovimientos(movimientosActualizados);
      obtenerMovimientos()
    } catch (error) {
      console.error("Error al eliminar movimiento: ", error);
    }
  };

  const handleCancelarEdicion = () => {
    setMovimientoEditando(null);
    setDescripcion("");
    setMonto("");
    setFecha(moment().format("YYYY-MM-DD"));
    setModalVisible(false);
  };

  const handleAbrirModal = () => {
    setModalVisible(true);
  };

  const handleAbrirModalConfirmacion = (id) => {
    setMovimientoAEliminar(id);
    setModalConfirmacionVisible(true);
  };

  const handleCerrarModalConfirmacion = () => {
    setMovimientoAEliminar(null);
    setModalConfirmacionVisible(false);
  };

  const handleConfirmarEliminacion = () => {
    if (movimientoAEliminar) {
      handleEliminarMovimiento(movimientoAEliminar);
      setModalConfirmacionVisible(false);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mb-20">
      {/* Mostrar saldo final */}
      <div className="my-10 flex  justify-between items-end gap-3">
        <div>
          <p className="leading-3 text-gray-600 font-bold text-sm">
            Detalle bancario
          </p>
          <span className="text-green-800 text-4xl font-bold">
            ${saldo.toLocaleString("es-ES")}
          </span>
        </div>

        <button
          onClick={handleAbrirModal}
          className="bg-green-800 text-white rounded flex justify-center items-center w-10 h-10"
        >
          <span className="material-symbols-outlined">playlist_add</span>
        </button>
      </div>

      {/* Mostrar el modal para agregar o editar un movimiento */}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <MovimientoModal
            movimientoEditando={movimientoEditando}
            descripcion={descripcion}
            monto={monto}
            tipoMovimiento={tipoMovimiento}
            fecha={fecha}
            setDescripcion={setDescripcion}
            setMonto={setMonto}
            setTipoMovimiento={setTipoMovimiento}
            setFecha={setFecha}
            handleAddMovimiento={handleAddMovimiento}
            handleGuardarEdicion={handleGuardarEdicion}
            handleCancelarEdicion={handleCancelarEdicion}
          />
        </div>
      )}

      {/* Mostrar los movimientos como tarjetas */}
      <div className="grid grid-cols-1  gap-2">
        {movimientos.length > 0 ? (
          movimientos
            .slice()
            .reverse()
            .map((mov) => (
              <div
                key={mov.id}
                className="bg-white p-4 rounded shadow border"
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs leading-3 font-medium text-gray-700">
                    {moment(mov.fecha).format("DD/MM/YY")}
                  </p>
                  <p className="text-xl leading-3 font-medium text-gray-700">
                    ${mov.saldo.toLocaleString("es-ES")}
                  </p>
                </div>
                <div className="text-gray-700 flex justify-between items-end ">
                  <div>
                    <p
                      className={`text-xl font-medium ${
                        ["Deposito", "Retiro", "Intereses"].includes(
                          mov.tipoMovimiento
                        )
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      ${mov.monto.toLocaleString("es-ES")}
                    </p>
                    <p className="text-xs font-medium leading-3">{mov.tipoMovimiento}</p>
                    <p className="text-xs font-medium leading-3">{mov.descripcion || "-"}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditarMovimiento(mov)}
                      className="bg-gray-800 text-white  w-8 h-8 flex justify-center items-center rounded"
                    >
                      <span className="material-symbols-outlined ">
                        edit_square
                      </span>
                    </button>
                    <button
                      onClick={() => handleAbrirModalConfirmacion(mov.id)}
                      className="bg-gray-600 text-white w-8 h-8 flex justify-center items-center rounded"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            No hay movimientos registrados.
          </p>
        )}
      </div>

      {/* Modal de Confirmación */}
      {modalConfirmacionVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de eliminar este movimiento?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handleCerrarModalConfirmacion}
                className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminacion}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractoBancario;
