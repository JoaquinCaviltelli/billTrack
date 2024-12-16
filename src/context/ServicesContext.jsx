import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "/src/firebase/config.js";
import moment from "moment";

const ServicesContext = createContext();

export const useServices = () => {
  return useContext(ServicesContext);
};

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);

  // Función para cargar servicios desde Firestore
  const fetchServices = async () => {
    const querySnapshot = await getDocs(collection(db, "services"));
    const servicesData = querySnapshot.docs.map((doc) => {
      const service = doc.data();
      // Formatea month y year si es necesario
      service.bills = service.bills.map((bill) => ({
        ...bill,
        month: moment(bill.month, "MM").format("MM"),
        year: moment(bill.year, "YYYY").format("YYYY"),
      }));
      return {
        id: doc.id,
        ...service,
      };
    });
    setServices(servicesData);
  };

  // Función para agregar un nuevo servicio
  const addService = async (name) => {
    const newService = {
      name,
      bills: [], // Inicialmente no tiene facturas
    };

    const docRef = await addDoc(collection(db, "services"), newService);
    setServices((prev) => [...prev, { id: docRef.id, ...newService }]);
  };

  // Función para actualizar el nombre del servicio
  const updateServiceName = async (serviceId, newName) => {
    const serviceRef = doc(db, "services", serviceId);

    await updateDoc(serviceRef, { name: newName });
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, name: newName } : service
      )
    );
  };

  // Función para eliminar un servicio
  const deleteService = async (serviceId) => {
    const serviceRef = doc(db, "services", serviceId);

    await deleteDoc(serviceRef);
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
  };

  // Función para agregar una factura a un servicio
  const addBill = async (serviceId, newBill) => {
    const serviceRef = doc(db, "services", serviceId);
    const service = services.find((s) => s.id === serviceId);
    const updatedBills = [...service.bills, newBill];

    await updateDoc(serviceRef, { bills: updatedBills });
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, bills: updatedBills } : service
      )
    );
  };

  // Función para editar una factura dentro de un servicio
  const updateBill = async (serviceId, billIndex, updatedBill) => {
    const serviceRef = doc(db, "services", serviceId);
    const service = services.find((s) => s.id === serviceId);

    const updatedBills = [...service.bills];
    updatedBills[billIndex] = { ...updatedBills[billIndex], ...updatedBill };

    await updateDoc(serviceRef, { bills: updatedBills });
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, bills: updatedBills } : service
      )
    );
  };

  // Función para eliminar una factura dentro de un servicio
  const deleteBill = async (serviceId, billIndex) => {
    const serviceRef = doc(db, "services", serviceId);
    const service = services.find((s) => s.id === serviceId);

    const updatedBills = service.bills.filter((_, index) => index !== billIndex);

    await updateDoc(serviceRef, { bills: updatedBills });
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, bills: updatedBills } : service
      )
    );
  };

  // Efecto para cargar los servicios al iniciar la app
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateServiceName,
        deleteService,
        addBill,
        updateBill,
        deleteBill,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
