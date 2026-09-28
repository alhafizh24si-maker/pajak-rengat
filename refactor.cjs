const fs = require('fs');

const content = fs.readFileSync('c:/pajak-rengat/src/App.jsx', 'utf-8');
const lines = content.split('\n');

const floatingWaLines = lines.slice(11, 181); 
const taxPortalLines = lines.slice(182, 886); 

const floatingWaCode = `import React, { useState } from "react";\n\n${floatingWaLines.join('\n')}\n\nexport default FloatingWhatsApp;\n`;

const taxPortalCode = `import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoDjp from "../assets/img/logo-djp-nonfix.jpeg";
import kppRengatImg from "../assets/img/KPP Pratama Rengat.jpg";
import ChatWidget from "../components/chatbot/ChatWidget";
import FloatingWhatsApp from "../components/ui/FloatingWhatsApp";

${taxPortalLines.join('\n')}

export default TaxPortal;
`;

fs.mkdirSync('c:/pajak-rengat/src/components/ui', { recursive: true });
fs.mkdirSync('c:/pajak-rengat/src/pages', { recursive: true });

fs.writeFileSync('c:/pajak-rengat/src/components/ui/FloatingWhatsApp.jsx', floatingWaCode);
fs.writeFileSync('c:/pajak-rengat/src/pages/TaxPortal.jsx', taxPortalCode);

const appJsxCode = `import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import TaxPortal from "./pages/TaxPortal";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaxPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
`;

fs.writeFileSync('c:/pajak-rengat/src/App.jsx', appJsxCode);

console.log("Refactoring complete");
