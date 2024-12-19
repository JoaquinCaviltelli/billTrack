// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ServicesProvider } from "./context/ServicesContext";
import Home from "./pages/Home";
import ServiceDetails from "./pages/ServiceDetails";
import ExtractoBancario from "./pages/ExtractoBancario"; // Importa la nueva página

const App = () => {
  return (
    <ServicesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/extracto" element={<ExtractoBancario />} /> {/* Nueva ruta */}
        </Routes>

        
      </Router>
    </ServicesProvider>
  );
};

export default App;
