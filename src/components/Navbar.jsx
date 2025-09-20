import React, { useState, useEffect, useRef } from "react";
import logo from "/public/llogo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  BadgeCheck, 
  PhoneCall, 
  BookOpenText, 
  Menu, 
  X, 
  Star,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to check and update user state
  const checkAuthState = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        // First try to use stored user data for immediate UI update
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoading(false);
        
        // Then verify with backend (optional, for data consistency)
        const response = await axios.get("https://event-backend-latest.vercel.app/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Update with fresh data from backend
        setUser(response.data);
        
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(response.data));
        
      } catch (error) {
        console.error("Auth verification failed:", error);
        // Token is invalid, clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuthState();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for route changes to update auth state
  useEffect(() => {
    // Check auth state when navigating between pages
    // This helps catch login/logout that happened on other pages
    checkAuthState();
  }, [location.pathname]);

  // Custom event listener for manual auth state updates
  useEffect(() => {
    const handleAuthUpdate = () => {
      checkAuthState();
    };

    // Listen for custom auth events
    window.addEventListener("authStateChanged", handleAuthUpdate);
    return () => window.removeEventListener("authStateChanged", handleAuthUpdate);
  }, []);

  // Simplified Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authStateChanged"));
    
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Navigate to dashboard based on user role
  const goToDashboard = () => {
    setIsProfileOpen(false);
    if (user?.role === "advertiser") {
      navigate("/advertiser-dashboard");
    } else {
      navigate("/publisher-dashboard");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[88rem] mx-auto px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex-shrink-0">
              <img className="h-12 w-auto" src={logo} alt="Logo" />
            </Link>
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[88rem] mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img className="h-12 w-auto" src={logo} alt="Logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="flex items-center space-x-2 text-primary font-semibold hover:text-secondary">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <a href="#about" className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-secondary">
              <BadgeCheck size={18} />
              <span>Our Story</span>
            </a>
            <a href="#faq" className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-secondary">
              <Star size={18} />
              <span>FAQ</span>
            </a>
            <Link to="/blogs" className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-secondary">
              <BookOpenText size={18} />
              <span>Blogs</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-secondary">
              <PhoneCall size={18} />
              <span>Contact</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                {/* Profile Button */}
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden lg:block max-w-32 truncate">{user.fullName}</span>
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mt-1 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <div className="py-1">
                      <button onClick={goToDashboard} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </button>
                      <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t mt-1 pt-2">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signup" className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90">
                  Sign Up
                </Link>
                <Link to="/login" className="px-5 py-2 text-sm font-medium text-primary border border-primary rounded-md  ">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 hover:text-secondary hover:bg-gray-100">
              {!isMenuOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-primary font-semibold">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-gray-700 font-semibold">
                <BadgeCheck size={18} />
                <span>Our Story</span>
              </a>
              <a href="#why-us" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-gray-700 font-semibold">
                <Star size={18} />
                <span>Why Choose Us</span>
              </a>
              <Link to="/blogs" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-gray-700 font-semibold">
                <BookOpenText size={18} />
                <span>Blogs</span>
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-gray-700 font-semibold">
                <PhoneCall size={18} />
                <span>Contact</span>
              </Link>

              {/* Mobile Auth Section */}
              {user ? (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg mb-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      goToDashboard();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t space-y-2">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-5 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90">
                    Sign Up
                  </Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-5 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-secondary hover:text-white">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;