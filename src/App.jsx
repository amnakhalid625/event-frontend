import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { HelmetProvider } from "react-helmet-async";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogDetail from "./components/BlogDetail";
import Form from "./pages/Form";
import Error from "./components/Error";
import Signup from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Payment from "./components/Payment";
import ForgetPassword from "./components/ForgotPassword";
import ServiceDetail from "./components/ServiceDetail";
import ClientForm from "./pages/ClientForm";
import AdministratorForm from "./pages/AdministratorForm";
import PublisherDashboard from "./components/PublisherDashboard";
import AdvertiserDashboard from "./components/AdvertiserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";

// Login Redirect Component (inline)
const LoginRedirect = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      
      // User is already logged in, redirect to appropriate dashboard
      if (user.role === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
      } else if (user.role === 'publisher') {
        return <Navigate to="/publisher-dashboard" replace />;
      } else if (user.role === 'advertiser') {
        return <Navigate to="/advertiser-dashboard" replace />;
      }
    } catch (error) {
      // Corrupted data, clear and continue to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // Not logged in or corrupted data, show login form
  return children;
};

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [adminChecking, setAdminChecking] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          if (user.role === 'admin') {
            setAdminUser(user);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      setAdminChecking(false);
    };

    checkAdminAuth();
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          
          {/* Login/Signup with redirect for already logged-in users */}
          <Route
            path="/login"
            element={
              <LoginRedirect>
                <Form />
              </LoginRedirect>
            }
          />
          <Route
            path="/signup"
            element={
              <LoginRedirect>
                <Signup />
              </LoginRedirect>
            }
          />
          
          <Route path="/payment" element={<Payment />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/client-form" element={<ClientForm />} />
          <Route path="/admin-form" element={<AdministratorForm />} />

          {/* Role-based Protected Routes */}
          <Route
            path="/publisher-dashboard"
            element={
              <ProtectedRoute requiredRole="publisher">
                <PublisherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/advertiser-dashboard"
            element={
              <ProtectedRoute requiredRole="advertiser">
                <AdvertiserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-login"
            element={
              adminUser ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <AdminLogin onLoginSuccess={setAdminUser} />
              )
            }
          />
          

          <Route
            path="/admin-dashboard"
            element={
              adminUser ? (
                <AdminDashboard />
              ) : adminChecking ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />

          {/* Error / 404 */}
          <Route path="*" element={<Error />} />
        </Routes>

        <Footer />
        <Toaster position="top-center" />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;