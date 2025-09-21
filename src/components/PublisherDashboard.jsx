import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SimplePublisherDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("create-request");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [websiteVerification, setWebsiteVerification] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // API base URL - your Vercel backend
  const API_BASE_URL = 'https://event-backend-eu68.vercel.app/api';
  
  // Categories and Gray Niches
  const categories = [
    "Business / Finance",
    "Technology", 
    "Health / Fitness",
    "Lifestyle",
    "Travel",
    "Food / Drink",
    "Education",
    "Fashion / Beauty",
    "Sports",
    "Entertainment",
    "Home / Garden",
    "Parenting / Family",
    "Automotive",
    "Real Estate",
    "News / Media",
    "Other"
  ];

  const grayNiches = [
    "Casino / Gambling",
    "CBD / Cannabis", 
    "Adult",
    "Crypto / Forex",
    "Betting / Sportsbook"
  ];

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "India", "Pakistan", "Bangladesh", "Netherlands", "Spain",
    "Italy", "Brazil", "Japan", "South Korea", "Other"
  ];
  
  const [formData, setFormData] = useState({
    publisherName: "",
    email: "",
    companyName: "",
    website: "",
    category: "",
    audienceSize: "",
    phone: "",
    address: "",
    // SEO Metrics
    domainAuthority: "",
    pageAuthority: "",
    monthlyTrafficAhrefs: "",
    topTrafficCountry: "",
    // Gray Niches
    grayNiches: [],
    // Pricing
    standardPostPrice: "",
    grayNichePrice: "",
    // Link Details
    dofollowAllowed: true,
    nofollowAllowed: true,
    // Content & Samples
    postSampleUrl: "",
    contentGuidelines: "",
    additionalNotes: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: ""
    }
  });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // API call helper with proper error handling
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = getAuthToken();
    
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'omit'
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      console.log('API Call:', method, `${API_BASE_URL}${endpoint}`);
      console.log('Auth token present:', !!token);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      console.log('Response status:', response.status);
      
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        console.log('Non-JSON response:', textResult);
        result = { message: textResult };
      }
      
      if (!response.ok) {
        console.error('API Error Response:', result);
        
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(result.message || `Server error: ${response.status}`);
      }
      
      console.log('API Success:', result);
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  // Check authentication and load user data
  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      console.log('Auth check - Token exists:', !!token);
      console.log('Auth check - User data exists:', !!userData);
      
      if (!token || !userData) {
        console.log('No auth data found, redirecting to login');
        navigate("/login");
        return false;
      }

      try {
        const user = JSON.parse(userData);
        console.log('User data:', user);
        
        if (!user.role || !["user", "publisher", "admin"].includes(user.role)) {
          console.log('Invalid user role:', user.role);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return false;
        }

        setCurrentUser(user);
        
        setFormData(prev => ({
          ...prev,
          publisherName: user.fullName || "",
          email: user.email || ""
        }));
        
        return true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return false;
      }
    };

    if (initializeUser()) {
      loadUserRequests();
    }
  }, [navigate]);

  // Load requests from API
  const loadUserRequests = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log('Loading user requests...');
      const response = await apiCall('/publisher-requests');
      
      console.log('Requests loaded:', response?.length || 0);
      setRequests(Array.isArray(response) ? response : []);
      
    } catch (error) {
      console.error('Failed to load requests:', error);
      setError(`Failed to load your requests: ${error.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setError("");
    
    if (name.startsWith('social_')) {
      const socialPlatform = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialPlatform]: value
        }
      }));
    } else if (name === 'grayNiches') {
      const updatedNiches = checked 
        ? [...formData.grayNiches, value]
        : formData.grayNiches.filter(niche => niche !== value);
      setFormData(prev => ({ ...prev, grayNiches: updatedNiches }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Website verification using API
  const verifyWebsite = async (url) => {
    if (!url || url.length < 8) {
      setWebsiteVerification({});
      return;
    }
    
    setLoading(true);
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await apiCall(`/publisher-requests/verify-website/${encodedUrl}`);
      setWebsiteVerification(response);
      console.log('Website verified:', response);
    } catch (error) {
      console.error('Website verification failed:', error);
      setWebsiteVerification({
        isAccessible: false,
        title: "Verification Failed",
        description: error.message,
        hasAnalytics: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit Publisher Request to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Basic validation
      if (!formData.publisherName || !formData.email || !formData.companyName || 
          !formData.website || !formData.category || !formData.audienceSize) {
        throw new Error("Please fill in all required fields");
      }

      // Validate website URL
      try {
        new URL(formData.website);
      } catch {
        throw new Error("Please enter a valid website URL");
      }

      // Prepare data for API
      const requestData = {
        fullName: formData.publisherName,
        email: formData.email,
        companyName: formData.companyName,
        website: formData.website,
        category: formData.category,
        grayNiches: formData.grayNiches,
        audienceSize: parseInt(formData.audienceSize) || 0,
        phone: formData.phone,
        address: formData.address,
        
        // SEO Metrics
        domainAuthority: parseInt(formData.domainAuthority) || 0,
        pageAuthority: parseInt(formData.pageAuthority) || 0,
        monthlyTrafficAhrefs: parseInt(formData.monthlyTrafficAhrefs) || 0,
        topTrafficCountry: formData.topTrafficCountry,
        
        // Pricing
        pricing: {
          standardPostPrice: parseFloat(formData.standardPostPrice) || 0,
          grayNichePrice: parseFloat(formData.grayNichePrice) || parseFloat(formData.standardPostPrice) || 0
        },
        
        // Social Media
        socialMedia: formData.socialMedia,
        
        // Content Details
        contentDetails: {
          postSampleUrl: formData.postSampleUrl,
          contentGuidelines: formData.contentGuidelines,
          additionalNotes: formData.additionalNotes
        }
      };

      console.log('Submitting request data:', requestData);

      // Create new publisher request via API
      const response = await apiCall('/publisher-requests/create', 'POST', requestData);
      
      console.log('Request submitted successfully:', response);
      
      // Show success message
      setSuccess(`Publisher Request Submitted Successfully! ${response.message || ''}`);
      
      // Reset form (but keep user details)
      setFormData({
        publisherName: currentUser.fullName || "",
        email: currentUser.email || "",
        companyName: "",
        website: "",
        category: "",
        audienceSize: "",
        phone: "",
        address: "",
        domainAuthority: "",
        pageAuthority: "",
        monthlyTrafficAhrefs: "",
        topTrafficCountry: "",
        grayNiches: [],
        standardPostPrice: "",
        grayNichePrice: "",
        dofollowAllowed: true,
        nofollowAllowed: true,
        postSampleUrl: "",
        contentGuidelines: "",
        additionalNotes: "",
        socialMedia: {
          facebook: "",
          instagram: "",
          twitter: "",
          youtube: "",
          linkedin: ""
        }
      });
      setWebsiteVerification({});
      
      // Reload requests and switch to requests tab
      await loadUserRequests();
      setActiveTab("requests");
      
    } catch (error) {
      console.error('Submit error:', error);
      setError(`Failed to submit request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Re-analyze website using API
  const reAnalyzeWebsite = async (requestId) => {
    if (!requestId) return;
    
    setLoading(true);
    setError("");
    
    try {
      await apiCall(`/publisher-requests/analyze-website/${requestId}`, 'POST', {
        socialMedia: formData.socialMedia
      });
      
      // Reload requests
      await loadUserRequests();
      setSuccess("Website re-analyzed successfully!");
      
    } catch (error) {
      console.error('Re-analyze error:', error);
      setError(`Failed to re-analyze website: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete request via API
  const deleteRequest = async (requestId) => {
    if (!requestId || !window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await apiCall(`/publisher-requests/${requestId}`, 'DELETE');
      
      // Reload requests
      await loadUserRequests();
      setSuccess("Request deleted successfully!");
      
    } catch (error) {
      console.error('Delete error:', error);
      setError(`Failed to delete request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format number for display
  const formatNumber = (num) => {
    const number = parseInt(num) || 0;
    if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
    return number.toString();
  };

  // Get trust level color
  const getTrustLevelColor = (score) => {
    const trustScore = parseInt(score) || 0;
    if (trustScore >= 70) return 'text-green-600 bg-green-100';
    if (trustScore >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Calculate stats
  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    approvedRequests: requests.filter(r => r.status === "approved").length,
    totalAudience: requests.reduce((sum, req) => {
      const audience = parseInt(req.audienceSize) || 0;
      const traffic = parseInt(req.websiteAnalysis?.monthlyTraffic) || 0;
      return sum + audience + traffic;
    }, 0),
    avgTrustScore: requests.length > 0 ? 
      Math.round(requests.reduce((sum, req) => sum + (parseInt(req.websiteAnalysis?.trustScore) || 0), 0) / requests.length) : 0,
    avgPrice: requests.length > 0 ?
      Math.round(requests.reduce((sum, req) => sum + (parseFloat(req.pricing?.standardPostPrice) || 0), 0) / requests.length) : 0
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error/Success Messages */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-4 text-white hover:text-gray-200">×</button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="ml-4 text-white hover:text-gray-200">×</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Publisher Dashboard</h1>
            <p className="text-blue-200 text-sm">Welcome, {currentUser.fullName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm bg-blue-700 px-3 py-1 rounded">
              {requests.length} Request{requests.length !== 1 ? 's' : ''} Submitted
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex space-x-6 px-6 py-4 bg-white shadow">
        <button
          onClick={() => setActiveTab("create-request")}
          className={`px-3 py-2 rounded-md font-medium ${
            activeTab === "create-request"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Submit New Request
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-3 py-2 rounded-md font-medium relative ${
            activeTab === "requests"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          My Requests
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-2 rounded-md font-medium ${
            activeTab === "overview"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Overview
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Create Request Tab */}
        {activeTab === "create-request" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow rounded-lg p-6 max-w-5xl mx-auto"
          >
            <h2 className="text-xl font-semibold mb-6 text-center">
              Publisher Details Form
            </h2>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Site Information */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-blue-800">Site Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
                    <input
                      type="url"
                      name="website"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleChange}
                      onBlur={() => verifyWebsite(formData.website)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {websiteVerification.isAccessible === false && (
                      <p className="text-red-500 text-xs mt-1">
                        {websiteVerification.description || "Website not accessible"}
                      </p>
                    )}
                    {websiteVerification.isAccessible === true && (
                      <p className="text-green-500 text-xs mt-1">Website verified</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain Authority (DA)</label>
                    <input
                      type="number"
                      name="domainAuthority"
                      placeholder="0-100"
                      value={formData.domainAuthority}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Authority (PA)</label>
                    <input
                      type="number"
                      name="pageAuthority"
                      placeholder="0-100"
                      value={formData.pageAuthority}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Traffic (Ahrefs)</label>
                    <input
                      type="number"
                      name="monthlyTrafficAhrefs"
                      placeholder="Monthly visits"
                      value={formData.monthlyTrafficAhrefs}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Top Traffic Country</label>
                    <select
                      name="topTrafficCountry"
                      value={formData.topTrafficCountry}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Publisher Information */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-green-800">Publisher Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="publisherName"
                    placeholder="Your Full Name *"
                    value={formData.publisherName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    required
                    readOnly
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address *"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    required
                    readOnly
                  />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Website/Company Name *"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <textarea
                  name="address"
                  placeholder="Complete Business Address *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-4"
                  rows="2"
                  required
                />
              </div>

              {/* Category */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-purple-800">Main Category *</h3>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose one category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Gray Niches */}
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-orange-800">Gray Niches (select all that apply)</h3>
                <p className="text-sm text-gray-600 mb-4">Select the sensitive niches you're willing to work with:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grayNiches.map(niche => (
                    <label key={niche} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="grayNiches"
                        value={niche}
                        checked={formData.grayNiches.includes(niche)}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">{niche}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="grayNiches"
                      value="Other"
                      checked={formData.grayNiches.includes("Other")}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Other (specify in additional notes)</span>
                  </label>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-red-800">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Standard Post Price ($) *</label>
                    <input
                      type="number"
                      name="standardPostPrice"
                      placeholder="e.g. 50"
                      value={formData.standardPostPrice}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gray Niche Price ($)</label>
                    <input
                      type="number"
                      name="grayNichePrice"
                      placeholder="Leave empty if same as standard"
                      value={formData.grayNichePrice}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">Higher price for sensitive niches</p>
                  </div>
                </div>
              </div>

              {/* Link Details */}
              <div className="border-l-4 border-teal-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-teal-800">Link Details</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="dofollowAllowed"
                      checked={formData.dofollowAllowed}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">Do-follow Links Allowed</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="nofollowAllowed"
                      checked={formData.nofollowAllowed}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium">No-follow Links Allowed</span>
                  </label>
                </div>
              </div>

              {/* Content & Samples */}
              <div className="border-l-4 border-indigo-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-indigo-800">Content & Samples</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Post Sample URL</label>
                    <input
                      type="url"
                      name="postSampleUrl"
                      placeholder="https://example.com/sample-post"
                      value={formData.postSampleUrl}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to a representative post on your site</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Guidelines or Requirements</label>
                    <textarea
                      name="contentGuidelines"
                      placeholder="Describe your content standards, editorial guidelines, or any specific requirements..."
                      value={formData.contentGuidelines}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      placeholder="Any additional information, special requirements, or notes..."
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-l-4 border-pink-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-pink-800">Social Media Presence (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">Add your social media links for audience verification</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    name="social_facebook"
                    placeholder="Facebook Page URL"
                    value={formData.socialMedia.facebook}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    name="social_instagram"
                    placeholder="Instagram Profile URL"
                    value={formData.socialMedia.instagram}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    name="social_twitter"
                    placeholder="Twitter Profile URL"
                    value={formData.socialMedia.twitter}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    name="social_youtube"
                    placeholder="YouTube Channel URL"
                    value={formData.socialMedia.youtube}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    name="social_linkedin"
                    placeholder="LinkedIn Profile URL"
                    value={formData.socialMedia.linkedin}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Audience Size */}
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-lg font-medium mb-4 text-yellow-800">Audience Information</h3>
                <input
                  type="number"
                  name="audienceSize"
                  placeholder="Current Monthly Audience *"
                  value={formData.audienceSize}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Total monthly unique visitors/readers</p>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-medium text-blue-800 mb-3">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• We'll automatically analyze your website metrics and social presence</li>
                  <li>• Your pricing and niche preferences will be recorded</li>
                  <li>• Trust score calculated based on DA, PA, and traffic data</li>
                  <li>• Review process takes 2-3 business days</li>
                  <li>• You can submit multiple sites with different pricing</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="w-4 h-4" required />
                <label htmlFor="terms" className="text-gray-600 text-sm">
                  I agree to the Terms and Conditions and confirm all information is accurate *
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:from-blue-400 disabled:to-blue-400 font-medium text-lg shadow-lg"
              >
                {loading ? "Submitting Request..." : "Submit Publisher Request"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Publisher Requests</h2>

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Loading your requests...</p>
                </div>
              )}

              {!loading && requests.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <p className="text-gray-600 mb-4">No requests submitted yet</p>
                  <button
                    onClick={() => setActiveTab("create-request")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Submit Your First Request
                  </button>
                </div>
              )}

              {!loading && requests.length > 0 && (
                <div className="space-y-6">
                  {requests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      {/* Request Header */}
                      <div className="p-6 border-b bg-white rounded-t-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-blue-800">{req.companyName}</h3>
                            <p className="text-gray-600">{req.fullName}</p>
                            <div className="flex space-x-4 mt-2 text-sm">
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                {req.category}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                ${req.pricing?.standardPostPrice || 0}
                                {req.pricing?.grayNichePrice && req.pricing.grayNichePrice !== req.pricing.standardPostPrice ? 
                                  ` - ${req.pricing.grayNichePrice}` : ''}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                req.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : req.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : req.status === "under_review"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {req.status === "under_review" ? "UNDER REVIEW" : req.status.toUpperCase()}
                            </span>
                            {(req.status === 'pending' || req.status === 'rejected') && (
                              <button
                                onClick={() => deleteRequest(req._id || req.id)}
                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1 hover:bg-red-50 rounded"
                                title="Delete Request"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Website:</span>
                            <a href={req.website} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline ml-1 block truncate">
                              {req.website}
                            </a>
                          </div>
                          <div>
                            <span className="font-medium">Gray Niches:</span>
                            <span className="ml-1">{req.grayNiches?.length || 0} selected</span>
                          </div>
                          <div>
                            <span className="font-medium">Link Types:</span>
                            <div className="ml-1">
                              {req.linkDetails?.dofollowAllowed && <span className="text-green-600 text-xs">Dofollow </span>}
                              {req.linkDetails?.nofollowAllowed && <span className="text-blue-600 text-xs">Nofollow</span>}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Audience:</span> {formatNumber(req.audienceSize)}
                          </div>
                        </div>

                        {req.rejectionReason && (
                          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{req.rejectionReason}</p>
                          </div>
                        )}

                        {req.adminNotes && (
                          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm font-medium text-blue-800">Admin Notes:</p>
                            <p className="text-sm text-blue-700">{req.adminNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Analytics Section */}
                      {req.websiteAnalysis && (
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
                          <h4 className="font-semibold mb-4 text-blue-800 flex items-center">
                            📊 Analytics Report
                          </h4>
                          
                          {/* Key Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                              <p className="text-xl font-bold text-blue-600">
                                {formatNumber(req.websiteAnalysis.monthlyTraffic || 0)}
                              </p>
                              <p className="text-xs text-gray-600">Monthly Traffic</p>
                            </div>
                            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                              <p className="text-xl font-bold text-green-600">
                                {req.websiteAnalysis.domainAuthority || req.domainAuthority || 'N/A'}/100
                              </p>
                              <p className="text-xs text-gray-600">Domain Authority</p>
                            </div>
                            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrustLevelColor(req.websiteAnalysis.trustScore || 0)}`}>
                                {req.websiteAnalysis.trustScore || 0}/100
                              </span>
                              <p className="text-xs text-gray-600 mt-1">Trust Score</p>
                            </div>
                            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                              <p className="text-lg font-bold text-purple-600">
                                {Object.keys(req.websiteAnalysis.socialMedia || {}).filter(key => 
                                  req.websiteAnalysis.socialMedia[key]?.url || 
                                  req.websiteAnalysis.socialMedia[key]?.followers || 
                                  req.websiteAnalysis.socialMedia[key]?.subscribers
                                ).length}
                              </p>
                              <p className="text-xs text-gray-600">Social Platforms</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              Last analyzed: {new Date(req.websiteAnalysis.lastAnalyzed || req.updatedAt).toLocaleDateString()}
                            </p>
                            <button
                              onClick={() => reAnalyzeWebsite(req._id || req.id)}
                              disabled={loading}
                              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:bg-blue-300 transition"
                            >
                              {loading ? "Analyzing..." : "Re-analyze Website"}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-gray-100 rounded-b-lg">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Submitted: {new Date(req.createdAt).toLocaleString()}</span>
                          {req.contentDetails?.postSampleUrl && (
                            <a href={req.contentDetails.postSampleUrl} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline">
                              View Sample Post
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Publisher Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Total Requests</h3>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Pending</h3>
                  <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Approved</h3>
                  <p className="text-2xl font-bold">{stats.approvedRequests}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Total Audience</h3>
                  <p className="text-2xl font-bold">{formatNumber(stats.totalAudience)}</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Avg Price</h3>
                  <p className="text-2xl font-bold">${stats.avgPrice}</p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">Welcome to Publisher Dashboard!</h3>
                  <p className="text-gray-600 mb-6">
                    Start earning by submitting your website for review.
                  </p>
                  <button
                    onClick={() => setActiveTab("create-request")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                  >
                    Submit Your First Request
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Average Trust Score</span>
                          <span>{stats.avgTrustScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div 
                            className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(stats.avgTrustScore, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {requests.slice(0, 3).map((req) => (
                        <div key={req._id || req.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{req.companyName}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(req.createdAt).toLocaleDateString()} - {req.status}
                            </p>
                            <div className="flex space-x-2 mt-1">
                              {req.grayNiches && req.grayNiches.length > 0 && (
                                <span className="text-xs bg-orange-100 text-orange-600 px-1 rounded">
                                  {req.grayNiches.length} Gray Niches
                                </span>
                              )}
                              <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                                {req.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">
                              ${req.pricing?.standardPostPrice || 0}
                              {req.pricing?.grayNichePrice && req.pricing.grayNichePrice !== req.pricing.standardPostPrice ? 
                                ` - ${req.pricing.grayNichePrice}` : ''}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatNumber(req.audienceSize || 0)} audience
                            </p>
                            <p className="text-xs text-gray-500">
                              DA: {req.domainAuthority || req.websiteAnalysis?.domainAuthority || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {requests.length > 3 && (
                        <button
                          onClick={() => setActiveTab("requests")}
                          className="text-blue-600 hover:text-blue-800 text-sm w-full text-left"
                        >
                          View all {requests.length} requests →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your request...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePublisherDashboard;