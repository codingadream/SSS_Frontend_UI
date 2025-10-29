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
import SettingsPage from "./pages/SettingsPage";
import { useState, createContext, type Dispatch, type SetStateAction } from "react";
import TransactionsPage from "./pages/TransactionsPage";

interface IUserContext {
  fbToken: string | null;
  setFbToken: Dispatch<SetStateAction<string | null>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<IUserContext | null>(null);

function App() {
  
const [fbToken, setFbToken] = useState<string | null>(null);
  return (
    <AuthProvider>
      <UserContext.Provider value={{ fbToken: fbToken, setFbToken: setFbToken }}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          
          </Routes>
        </Router>
      </UserContext.Provider>
    </AuthProvider>
  );
}

export default App;
