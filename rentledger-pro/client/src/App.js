import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PayPage from './pages/PayPage';
import History from './pages/History';

export default function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pay/:paymentLink" element={<PayPage />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}
