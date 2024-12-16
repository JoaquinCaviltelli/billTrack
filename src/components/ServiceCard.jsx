import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service, currentBillAmount, percentageChange }) => {
  return (
    <Link
      to={`/services/${service.id}`}
      className="border text-gray-600 p-4 rounded shadow hover:shadow-lg transition"
    >
      <h2 className="font-medium text-sm leading-3">{service.name}</h2>
      <div className="flex gap-2">

      <p className="font-bold text-3xl">${currentBillAmount.toLocaleString('es-ES')}</p>

      {/* Mostrar porcentaje de cambio */}
      {currentBillAmount !== 0 && (
        <p
        className={`text-xs font-medium ${percentageChange > 0 ? "text-red-500" : "text-green-500"}`}
        >
          {percentageChange >= 0 ? "+" : ""}
          {percentageChange.toFixed(1)}%
        </p>
      )}
      </div>
    </Link>
  );
};

export default ServiceCard;
