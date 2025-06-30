import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { UserRole } from "./types/types";

// Loading component for better mobile experience
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-modus-orange"></div>
  </div>
);

// Lazy load components with prefetch
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
const LoginForm = lazy(() => import("./pages/login_sign_page/login-form"));
const SignupForm = lazy(() => import("./pages/login_sign_page/signup-form"));
const ContactsPage = lazy(() => import("./pages/contact/contact-page"));
const UploadPage = lazy(() => import("./pages/upload_image/upload-page"));
const ProductDetailPage = lazy(() => import("./pages/product_detail_page/product-detail-page"));

// Keep Navbar and Footer as regular imports since they're needed immediately
import { Navbar } from "./pages/header/navebar";
import { Footer } from "./pages/footer/footer";
import { ProtectedRoute } from "./pages/login_sign_page/index";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
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
                <Route
                  path="/dashboard/products"
                  element={
                    <ProtectedRoute>
                      <ProductDetailPage />
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
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
