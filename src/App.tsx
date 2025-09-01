import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VideoManagement from './components/VideoManagement';
import EbookManagement from './components/EbookManagement';
import CertificateManagement from './components/CertificateManagement';
import MemberManagement from './components/MemberManagement';
import PlansManagement from './components/PlansManagement';
import AdminLogin from './components/AdminLogin'; // Make sure this exists
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import PurchasesManagement from './components/PurchasesManagement';
import SEPA from './components/SEPA';
import AdminSettings from './components/AdminSettings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex">
        {/* Only show Sidebar if logged in */}
        {localStorage.getItem("adminToken") && (
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        )}


        <main className={`flex-1 overflow-auto transition-all duration-300 ${localStorage.getItem("adminToken") ? "md:ml-64" : ""
          }`}>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard setSidebarOpen={setSidebarOpen} />
              </ProtectedRoute>
            } />
            <Route path="/videos" element={
              <ProtectedRoute>
                <VideoManagement />
              </ProtectedRoute>
            } />
            <Route path="/ebooks" element={
              <ProtectedRoute>
                <EbookManagement />
              </ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute>
                <CertificateManagement />
              </ProtectedRoute>
            } />
            <Route path="/members" element={
              <ProtectedRoute>
                <MemberManagement />
              </ProtectedRoute>
            } />
            <Route path="/plans" element={
              <ProtectedRoute>
                <PlansManagement />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <PurchasesManagement />
              </ProtectedRoute>
            } />
            <Route path="/bank-transfers" element={
              <ProtectedRoute>
                <SEPA />
              </ProtectedRoute>
            } />
            <Route path="/admin-settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
