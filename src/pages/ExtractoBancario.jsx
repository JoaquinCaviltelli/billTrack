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

const ExtractoBancario = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("Deposito");
  const [saldo, setSaldo] = useState(0);
  const [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [movimientoEditando, setMovimientoEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
        obtenerMovimientos();
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
        obtenerMovimientos();
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
      obtenerMovimientos();
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

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mb-20 bg-gradient-to-tl from-[#5B50D9] to-[#302A73]">
      {/* Mostrar saldo final */}
      <div className="flex items-center gap-3 p-6 justify-between">
<p className="text-white font-semibold">Detalle bancario</p>
      <Link to="/" className="">
    
        <span className="material-symbols-outlined text-[#302A73] text-[34px] bg-white p-3 rounded-full shadow">
          docs
        </span>

      </Link>
      </div>
      <div className=" pt-14 pb-14 flex flex-col justify-center items-center text-white gap-2">
        <p className="leading-3  font-semibold text-sm">
          {moment(fecha).format("DD")} de{" "}
          {monthsInSpanish[moment(fecha).format("MM") - 1]}
        </p>
        <span className="text-5xl font-bold">
          ${saldo.toLocaleString("es-ES")}
        </span>
      </div>

      {/* Mostrar el modal para agregar o editar un movimiento */}
      {modalVisible && (
        
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
            handleEliminarMovimiento={handleEliminarMovimiento} // Pasa la función de eliminar
          />
        
      )}

      {/* Mostrar los movimientos como tarjetas */}
      <div className="grid grid-cols-1 bg-white p-6 pt-10 rounded-t-xl">
        <button
          onClick={() => setModalVisible(true)}
          className="bg-[#302A73] text-white rounded flex justify-center font-semibold items-center w-full p-4 gap-2 shadow-lg"
        >
          <span className="material-symbols-outlined">playlist_add</span>
          Agregar
        </button>
        {movimientos.length > 0 ? (
          // Agrupar movimientos por mes
          Object.entries(
            movimientos
              .slice()
              .reverse()
              .reduce((acc, mov) => {
                const monthYear =
                  monthsInSpanish[moment(mov.fecha).format("MM") - 1] +
                  " " +
                  moment(mov.fecha).format("YYYY");
                if (!acc[monthYear]) {
                  acc[monthYear] = [];
                }
                acc[monthYear].push(mov);
                return acc;
              }, {})
          ).map(([monthYear, monthMovements], index) => (
            <div key={index}>
              {/* Mostrar el nombre del mes y año */}

              <div className="text-right text-md font-bold text-gray-600 mt-6 mb-1">
                {monthYear}
              </div>

              {/* Mostrar los movimientos de este mes */}
              {monthMovements.map((mov) => (
                <div key={mov.id} className="">
                  <div className="bg-white rounded shadow  mb-2 flex justify-between">
                    
                    <div className="text-gray-600 flex flex-col px-4 py-2  w-full">
                      <div className="flex w-full justify-between items-start text-gray-600 text-xs font-semibold">
                        <p className="">
                          {moment(mov.fecha).format("DD/MM/YY")}
                        </p>
                      

                        <p className="">
                          ${mov.saldo.toLocaleString("es-ES")}
                        </p>
                      </div>

                      <div className="flex gap-1 text-xs font-semibold flex-wrap">
                        <p>{mov.tipoMovimiento}</p>
                        <p>
                          {mov.descripcion ? "(" + mov.descripcion + ")" : ""}
                        </p>
                      </div>
                      
                      <p
                        className="text-2xl font-bold "
                      >
                        {
                          ["Deposito", "Retiro", "Intereses"].includes(
                            mov.tipoMovimiento
                          )
                            ? "$"+mov.monto.toLocaleString("es-ES")
                            : "-$" + mov.monto.toLocaleString("es-ES")
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditarMovimiento(mov)} // Llamada a la función de editar
                      className="bg-gray-600 text-white flex justify-center items-center p-2 rounded-r"
                    >
                      <span className="material-symbols-outlined text-xl">
                        edit_square
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-gray-500 col-span-3">
            No hay movimientos registrados.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExtractoBancario;
