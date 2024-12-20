import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServices } from "../context/ServicesContext";
import moment from "moment";
import BillModal from "/src/components/BillModal.jsx";
import EditServiceModal from "/src/components/EditServiceModal.jsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Asegúrate de registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    services,
    updateServiceName,
    deleteService,
    addBill,
    updateBill,
    deleteBill,
  } = useServices();
  const service = services.find((s) => s.id === id);

  const [serviceName, setServiceName] = useState(service?.name || "");
  const [editingName, setEditingName] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBillData, setEditingBillData] = useState(null);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);

  const [showConsumption, setShowConsumption] = useState(false); // Estado para cambiar entre importe y consumo
  const [monthsToShow, setMonthsToShow] = useState(12); // Estado para los meses a mostrar (12, 6, o 24)

  const handleUpdateServiceName = async () => {
    if (!serviceName.trim()) return alert("El nombre no puede estar vacío");
    await updateServiceName(id, serviceName);
    setEditingName(false);
    setIsEditNameModalOpen(false);
  };

  const handleDeleteService = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      await deleteService(id);
      navigate("/");
    }
  };
  const handleAddBill = () => {
    setEditingBillData(false);  // Restablecer los datos cuando se agrega una nueva factura
    setIsModalOpen(true);  // Abrir el modal
  };

  const handleAddOrEditBill = async (bill) => {
    if (editingBillData) {
      await updateBill(id, editingBillData.index, bill);
    } else {
      await addBill(id, bill);
    }
    setIsModalOpen(false);
    setEditingBillData(null);
  };

  const handleEditBill = (bill, index) => {
    setEditingBillData({ ...bill, index });
    setIsModalOpen(true);
  };

  const handleDeleteBill = async (billIndex) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta factura?")) {
      await deleteBill(id, billIndex);
      setIsModalOpen(false);
    }
  };

  const sortedBills =
    service?.bills?.sort((a, b) => {
      const dateA = moment(`${a.year}-${a.month}`, "YYYY-MM");
      const dateB = moment(`${b.year}-${b.month}`, "YYYY-MM");
      return dateB.isBefore(dateA) ? -1 : 1;
    }) || [];

  // Filtrar las facturas para los últimos X meses
  const filteredBills = sortedBills.slice(0, monthsToShow).reverse();

  const labels = filteredBills.map(
    (bill) => `${monthsInSpanish[bill.month - 1].slice(0, 3)}`
  );

  const data = filteredBills.map((bill) =>
    showConsumption ? bill.consumption : bill.amount
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: showConsumption
          ? "Consumo del servicio"
          : "Importe del servicio",
        data: data,
        backgroundColor: "#463DA6",
        borderColor: "#463DA6",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${
              tooltipItem.dataset.label
            }: ${tooltipItem.raw.toLocaleString("es-ES")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
          callback: (value) => `$${value.toLocaleString("es-ES")}`,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  return (
    <div className="p-6 max-w-5xl m-auto mb-20">
      <div className="flex justify-between my-10 gap-6">
        <h1 className="text-5xl text-[#302A73] font-bold">{service?.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditNameModalOpen(true)} // Abre el modal de edición del nombre
            className="bg-[#302A73] text-white w-10 h-10 flex justify-center items-center rounded"
          >
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>
      </div>
      <div className="mt-6 w-full max-w-lg m-auto">
        <Bar data={chartData} options={chartOptions} />

        <div className="flex justify-between gap-3 mt-1 text-xs">
          {/* Botones para seleccionar el rango de meses */}
          <div className="flex gap-1 justify-center ">
            <button
              onClick={() => setMonthsToShow(6)}
              className="bg-gray-600 text-white w-10 flex justify-center items-center px-4 py-2 rounded"
            >
              6
            </button>
            <button
              onClick={() => setMonthsToShow(12)}
              className="bg-gray-600 text-white w-10 flex justify-center items-center px-4 py-2 rounded"
            >
              12
            </button>
            <button
              onClick={() => setMonthsToShow(24)}
              className="bg-gray-600 text-white w-10 flex justify-center items-center px-4 py-2 rounded"
            >
              24
            </button>
          </div>
          <button
            onClick={() => setShowConsumption(!showConsumption)} // Cambiar entre importe y consumo
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            {showConsumption ? "Ver Importe" : "Ver Consumo"}
          </button>
        </div>
      </div>

      <div className="mt-14">
        <button
          onClick={handleAddBill}
          className="bg-[#302A73] mb-6 w-full font-semibold text-white px-4 py-3 rounded"
        >
          Agregar Factura
        </button>
        <ul className="flex flex-col gap-4">
          {sortedBills.map((bill, index) => (
            <li
              key={index}
              className="border text-gray-600 rounded shadow hover:shadow-lg transition flex justify-between"
            >
              <div className="flex items-center p-4 justify-between">
                <div className="flex flex-col">
                  <p className="font-semibold text-xs">
                    {monthsInSpanish[bill.month - 1]} {bill.year}
                  </p>
                  <p className="font-bold text-3xl">
                    ${bill.amount.toLocaleString("es-ES")}
                  </p>
                  {/* <p className="font-medium text-sm">
                    Consumo: {bill.consumption}
                  </p> */}
                </div>

                
                 
                
              </div>
                  <button
                    onClick={() => handleEditBill(bill, index)}
                    className="bg-[#463DA6] text-white p-1 flex justify-center items-center rounded-r"
                  >
                    <span className="material-symbols-outlined">
                      edit_square
                    </span>
                  </button>
            </li>
          ))}
        </ul>
      </div>

      <BillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddOrEditBill}
        billData={editingBillData}
        onDelete={handleDeleteBill}
      />

      {isEditNameModalOpen && (
        <EditServiceModal
          service={service}
          serviceName={serviceName}
          onClose={() => setIsEditNameModalOpen(false)}
          onSave={handleUpdateServiceName}
          setServiceName={setServiceName}
          handleDeleteService={handleDeleteService}
          
        />
      )}
    </div>
  );
};

export default ServiceDetails;
