import React, { useState } from "react";
import { useServices } from "../context/ServicesContext";
import ServiceCard from "../components/ServiceCard";
import AddServiceModal from "../components/AddServiceModal";
import moment from "moment";
import { Link } from "react-router-dom";

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

const Home = () => {
  const { services } = useServices();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment()); // Estado para manejar el mes actual

  // Función para obtener la cantidad de la factura del mes específico
  const getBillAmountForMonth = (bills, month, year) => {
    const currentBill = bills.find(
      (bill) => bill.month === month && bill.year === year
    );
    return currentBill ? currentBill.amount : 0;
  };

  // Calcular el monto total de un servicio para un mes específico
  const getCurrentBillAmountForService = (service) => {
    return getBillAmountForMonth(
      service.bills,
      currentMonth.format("MM"),
      currentMonth.format("YYYY")
    );
  };

  // Calcular el monto total del mes anterior para un servicio
  const getPreviousMonthBillAmountForService = (service) => {
    return getBillAmountForMonth(
      service.bills,
      currentMonth.clone().subtract(1, "month").format("MM"),
      currentMonth.format("YYYY")
    );
  };

  // Calcular el porcentaje de cambio entre dos montos
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0; // Si el mes anterior tiene monto 0, consideramos un aumento del 100% si el monto actual es positivo
    }
    return ((current - previous) / previous) * 100;
  };

  // Obtener los montos del total de todos los servicios para el mes actual y el mes anterior
  const currentTotalAmount = services.reduce(
    (total, service) => total + getCurrentBillAmountForService(service),
    0
  );
  const previousTotalAmount = services.reduce(
    (total, service) => total + getPreviousMonthBillAmountForService(service),
    0
  );

  // Calcular el porcentaje de cambio entre el total actual y el total anterior
  const totalPercentageChange = calculatePercentageChange(
    currentTotalAmount,
    previousTotalAmount
  );

  return (
    <div className="w-full inset-0 fixed overflow-y-scroll   ">
      <div className="max-w-4xl mx-auto ">
        <div className="pb-24 bg-gradient-to-tl from-[#5B50D9] to-[#302A73]">

       
        {/* Encabezado */}
        <div className="flex items-center gap-3 p-6 justify-between">
          <p className="text-white font-semibold">Facturas de servicios</p>
          <Link to="/extracto" className="">
            <span className="material-symbols-outlined text-[#463DA6] text-[34px] bg-white p-3 rounded-full shadow">
              account_balance
            </span>
            
          </Link>
        </div>

        {/* Navegación entre meses */}
        <div className="flex w-full items-center justify-between px-6 mt-12 ">
          <button
            className="bg-white text-[#463DA6]  w-7 h-7 flex justify-center items-center rounded"
            onClick={() =>
              setCurrentMonth(currentMonth.clone().subtract(1, "month"))
            }
          >
            <span className="material-symbols-outlined">arrow_left</span>
          </button>
          <p className="text-white font-semibold text-sm">{`${
            monthsInSpanish[currentMonth.month()]
          } ${currentMonth.year()}`}</p>
          <button
            className="bg-white text-[#463DA6] w-7 h-7 flex justify-center items-center rounded"
            onClick={() =>
              setCurrentMonth(currentMonth.clone().add(1, "month"))
            }
          >
            <span className="material-symbols-outlined">arrow_right</span>
          </button>
        </div>

        {/* Total */}
        <div className=" text-white  px-6 text-center ">
          <span className="text-5xl font-bold relative ">
          <span className="text-5xl font-bold absolute -left-8">$</span>
            {currentTotalAmount.toLocaleString("es-ES")}
          </span>
          {/* Porcentaje de cambio en el total */}
          {previousTotalAmount !== 0 && currentTotalAmount !== 0 && (
            <span className="text-md font-semibold absolute">
              {totalPercentageChange >= 0 ? "+" : ""}
              {totalPercentageChange.toFixed(1)}%
            </span>
          )}

        </div>
        </div>
        <div className="bg-white p-6 py-10 rounded-t-2xl relative -top-10">
          {/* Botón para agregar servicio */}
          <button
            className="bg-[#463DA6] text-white rounded flex justify-center font-semibold items-center w-full p-4 gap-2 shadow-lg"
            onClick={() => setModalOpen(true)}
          >
            <span className="material-symbols-outlined">playlist_add</span>
            Agregar servicio
          </button>

          {/* Mostrar los servicios */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const currentAmount = getCurrentBillAmountForService(service);
              const previousAmount =
                getPreviousMonthBillAmountForService(service);
              const percentageChange = calculatePercentageChange(
                currentAmount,
                previousAmount
              );

              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  currentBillAmount={currentAmount}
                  percentageChange={percentageChange}
                />
              );
            })}
          </div>
        </div>
        {/* Modal para agregar servicio */}
        {modalOpen && <AddServiceModal onClose={() => setModalOpen(false)} />}
      </div>
    </div>
  );
};

export default Home;
