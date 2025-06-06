import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { UserRole } from "./types/auth";

// Import your other components
import {
  Homepage,
  Shopepage,
  Aboutpage,
  Contactpage,
  Dashboard,
  Unauthorized,
} from "./pages/components/all_main_pages/index";
import {
  LoginForm,
  ProtectedRoute,
  SignupForm,
} from "./pages/login_sign_page/index";
import { Navbar } from "./pages/header/navebar";
import { Footer } from "./pages/footer/footer";
import { ContactsPage } from "./pages/contact/contact-page";
import { UploadPage } from "./pages/upload_image/upload-page";

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

              <Route
                path="/dashboard/contacts"
                element={
                  <ProtectedRoute>
                    <ContactsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/upload"
                element={
                  <ProtectedRoute>
                    {/* Render upload content directly or pass to a layout component */}
                    <UploadPage />
                  </ProtectedRoute>
                }
              />

              {/* Role-specific routes (Consider removing or redirecting if Dashboard handles all role views) */}
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
