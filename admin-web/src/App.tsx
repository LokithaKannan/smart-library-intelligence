import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/auth";

// Public pages
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";

// Protected pages
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Students from "./pages/Students";
import Forecast from "./pages/Forecast";
import Chat from "./pages/Chat";
import IssueReturn from "./pages/IssueReturn";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import BrowseBooks from "./pages/BrowseBooks";
import MyBooks from "./pages/MyBooks";

import Sidebar from "./components/Sidebar";

function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060810" }}>
      <Sidebar />
      <main style={{ marginLeft: "245px", flex: 1, padding: "28px 32px", minHeight: "100vh" }}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="students" element={<Students />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="chat" element={<Chat />} />
          <Route path="issue" element={<IssueReturn />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="browse" element={<BrowseBooks />} />
          <Route path="mybooks" element={<MyBooks />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
      <Route path="/dashboard/*" element={<ProtectedLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}