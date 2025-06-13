import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { UserRole } from "./types/types";
import { Navbar } from "./pages/header/navebar";
import { Footer } from "./pages/footer/footer";

// Lazy load components
const Homepage = lazy(() =>
  import("./pages/components/all_main_pages").then((module) => ({
    default: module.Homepage,
  }))
);
const Shopepage = lazy(() =>
  import("./pages/components/all_main_pages").then((module) => ({
    default: module.Shopepage,
  }))
);
const Aboutpage = lazy(() =>
  import("./pages/components/all_main_pages").then((module) => ({
    default: module.Aboutpage,
  }))
);
const Contactpage = lazy(() =>
  import("./pages/components/all_main_pages").then((module) => ({
    default: module.Contactpage,
  }))
);
const Dashboard = lazy(() =>
  import("./pages/components/all_main_pages").then((module) => ({
    default: module.Dashboard,
  }))
);
const Unauthorized = lazy(() =>
  import("./pages/components/all_main_pages").then((module) => ({
    default: module.Unauthorized,
  }))
);
const LoginForm = lazy(() =>
  import("./pages/login_sign_page/login-form").then((module) => ({
    default: module.LoginForm,
  }))
);
const SignupForm = lazy(() =>
  import("./pages/login_sign_page/signup-form").then((module) => ({
    default: module.SignupForm,
  }))
);
const ProtectedRoute = lazy(() =>
  import("./pages/login_sign_page/protected-route").then((module) => ({
    default: module.ProtectedRoute,
  }))
);
const ContactsPage = lazy(() => import("./pages/contact/contact-page"));
const UploadPage = lazy(() => import("./pages/upload_image/upload-page"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/products" element={<Shopepage />} />
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
                      <UploadPage />
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

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        404
                      </h1>
                      <p className="text-xl text-gray-600">Page not found</p>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
