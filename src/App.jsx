import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ServicesProvider } from "./context/ServicesContext";
import Home from "./pages/Home";
import ServiceDetails from "./pages/ServiceDetails";

const App = () => {
  return (
    <ServicesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
        </Routes>
      </Router>
    </ServicesProvider>
  );
};

export default App;
