import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Books from "./Pages/Books";
import Transactions from "./Pages/Transactions";
import Users from "./Pages/Users";

import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard - everyone */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Librarian", "Member"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Books - everyone */}
        <Route
          path="/books"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Librarian", "Member"]}
            >
              <Books />
            </ProtectedRoute>
          }
        />

        {/* Transactions - everyone */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Librarian", "Member"]}
            >
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Users - Admin and Librarian only */}
        <Route
          path="/users"
          element={
            <ProtectedRoute
              allowedRoles={["Admin", "Librarian"]}
            >
              <Users />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;