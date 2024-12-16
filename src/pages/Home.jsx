import React, { useState } from "react";
import { useServices } from "../context/ServicesContext";
import ServiceCard from "../components/ServiceCard";
import AddServiceModal from "../components/AddServiceModal";
import moment from "moment";

// Array de los meses en español
const monthsInSpanish = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
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
    return getBillAmountForMonth(service.bills, currentMonth.format("MM"), currentMonth.format("YYYY"));
  };

  // Calcular el monto total del mes anterior para un servicio
  const getPreviousMonthBillAmountForService = (service) => {
    return getBillAmountForMonth(service.bills, currentMonth.clone().subtract(1, "month").format("MM"), currentMonth.format("YYYY"));
  };

  // Calcular el porcentaje de cambio entre dos montos
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0; // Si el mes anterior tiene monto 0, consideramos un aumento del 100% si el monto actual es positivo
    }
    return ((current - previous) / previous) * 100;
  };

  // Obtener los montos del total de todos los servicios para el mes actual y el mes anterior
  const currentTotalAmount = services.reduce((total, service) => total + getCurrentBillAmountForService(service), 0);
  const previousTotalAmount = services.reduce((total, service) => total + getPreviousMonthBillAmountForService(service), 0);

  // Calcular el porcentaje de cambio entre el total actual y el total anterior
  const totalPercentageChange = calculatePercentageChange(currentTotalAmount, previousTotalAmount);

  return (
    <div className="p-6 max-w-5xl m-auto">
      <div className="flex w-full items-center justify-between">
        <button
          className="bg-gray-800 text-white font-black py-1 px-2 rounded-l"
          onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "month"))}
        >
          &lt;
        </button>
        <p className="text-lg text-gray-700 font-bold mx-4">{`${monthsInSpanish[currentMonth.month()]} ${currentMonth.year()}`}</p>
        <button
          className="bg-gray-800 text-white font-black py-1 px-2 rounded-r"
          onClick={() => setCurrentMonth(currentMonth.clone().add(1, "month"))}
        >
          &gt;
        </button>
      </div>

      <div className="flex text-gray-700 gap-1 items-start my-10">
        <p className="text-5xl font-bold">${currentTotalAmount.toLocaleString("es-ES")}</p>

        {/* Mostrar porcentaje de cambio en el total */}
        {previousTotalAmount !== 0 && currentTotalAmount !== 0 && (
          <p
            className={`text-md font-semibold ${totalPercentageChange >= 0 ? "text-red-500" : "text-green-500"}`}
          >
            {totalPercentageChange >= 0 ? "+" : ""}
            {totalPercentageChange.toFixed(1)}%
          </p>
        )}
      </div>

      <button
        className="bg-gray-800 w-full font-bold text-white px-4 py-2 rounded"
        onClick={() => setModalOpen(true)}
      >
        Agregar servicio
      </button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((service) => {
          const currentAmount = getCurrentBillAmountForService(service);
          const previousAmount = getPreviousMonthBillAmountForService(service);
          const percentageChange = calculatePercentageChange(currentAmount, previousAmount);

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

      {modalOpen && <AddServiceModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Home;
