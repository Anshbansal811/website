import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRole } from "./types/auth";

// Import your other components
import {
  Homepage,
  Shopepage,
  Aboutpage,
  Contactpage,
  Dashboard,
  Unauthorized,
} from "./pages/components/index";
import {
  LoginForm,
  ProtectedRoute,
  SignupForm,
} from "./pages/login_sign_page/index";
import { Navbar } from "./pages/header/navebar";
import { Footer } from "./pages/footer/footer";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/shop" element={<Shopepage />} />
              <Route path="/about" element={<Aboutpage />} />
              <Route path="/contact" element={<Contactpage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Role-specific routes */}
              <Route
                path="/retailer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.RETAILER]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/corporate-dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.CORPORATE]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller-dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.SELLER]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
