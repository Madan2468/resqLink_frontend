import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ReportCase from './pages/ReportCase';
import ViewCases from './pages/ViewCases';
import CaseDetail from './pages/CaseDetail';
import ChatbotWidget from './components/chatbot/ChatbotWidget';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CasesProvider } from './context/CasesContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CasesProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/report-case" element={
                  <ProtectedRoute>
                    <ReportCase />
                  </ProtectedRoute>
                } />
                <Route path="/cases" element={<ViewCases />} />
                <Route path="/cases/:id" element={<CaseDetail />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <ChatbotWidget />
            <Footer />
          </div>
        </Router>
      </CasesProvider>
    </AuthProvider>
  );
}

export default App;