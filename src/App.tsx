// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SettingsPageNav from "./pages/SettingsPageNav";
import { useState, createContext, type Dispatch, type SetStateAction, useEffect } from "react";
import TransactionsPage from "./pages/TransactionsPage";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster /> 
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/settings-nav" element={<SettingsPageNav />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
