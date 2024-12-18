// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto flex justify-center gap-10">
        <Link to="/" className=""><span className="material-symbols-outlined">
docs
</span></Link>
        <Link to="/extracto" className=""><span className="material-symbols-outlined">
account_balance
</span></Link>
      </div>
    </footer>
  );
};

export default Footer;
