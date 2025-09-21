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
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  // API Base URL
  const API_BASE_URL = 'https://event-backend-eu68.vercel.app/api';
  
  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };
  
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
    password: "",
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

  // Check authentication and load user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
    
    // Pre-fill form with user data
    setFormData(prev => ({
      ...prev,
      publisherName: user.fullName || "",
      email: user.email || ""
    }));
    
    // Load user's requests from API
    loadUserRequests();
  }, [navigate]);

  // Load requests from API
  const loadUserRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/publisher/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data || []);
      } else {
        console.error('Failed to load requests');
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social_')) {
      const socialPlatform = name.replace('social_', '');
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialPlatform]: value
        }
      });
    } else if (name === 'grayNiches') {
      const updatedNiches = checked 
        ? [...formData.grayNiches, value]
        : formData.grayNiches.filter(niche => niche !== value);
      setFormData({ ...formData, grayNiches: updatedNiches });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Mock website verification
  const verifyWebsite = async (url) => {
    if (!url) return;
    
    setLoading(true);
    setTimeout(() => {
      const isValid = url.startsWith('http') && url.includes('.');
      setWebsiteVerification({
        isAccessible: isValid,
        title: isValid ? "Website Title Found" : "Invalid URL",
        hasAnalytics: Math.random() > 0.5
      });
      setLoading(false);
    }, 1000);
  };

  // Submit Publisher Request via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.publisherName || !formData.email || !formData.password || 
          !formData.companyName || !formData.website || !formData.category ||
          !formData.standardPostPrice) {
        showToast("Please fill all required fields", "error");
        return;
      }

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/publisher/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.publisherName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          website: formData.website,
          category: formData.category,
          audienceSize: parseInt(formData.audienceSize) || 0,
          phone: formData.phone,
          address: formData.address,
          domainAuthority: parseInt(formData.domainAuthority) || 0,
          pageAuthority: parseInt(formData.pageAuthority) || 0,
          monthlyTrafficAhrefs: parseInt(formData.monthlyTrafficAhrefs) || 0,
          topTrafficCountry: formData.topTrafficCountry,
          pricing: {
            standardPostPrice: parseFloat(formData.standardPostPrice) || 0,
            grayNichePrice: parseFloat(formData.grayNichePrice) || 0
          },
          grayNiches: formData.grayNiches || [],
          socialMedia: formData.socialMedia || {}
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Request submitted:', data);
        showToast("Publisher request submitted successfully! Please wait for admin approval.", "success");
        
        // Reset form but keep user details
        setFormData({
          publisherName: currentUser.fullName || "",
          email: currentUser.email || "",
          password: "",
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
        
        // Reload user requests
        loadUserRequests();
        
        // Switch to requests tab
        setActiveTab("requests");
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to submit request", "error");
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast("Failed to submit request. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Re-analyze website
  const reAnalyzeWebsite = async (requestId) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/publisher/analyze-website/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          socialMedia: {}
        })
      });

      if (response.ok) {
        showToast("Website re-analyzed successfully!", "success");
        loadUserRequests(); // Reload requests
      } else {
        showToast("Failed to re-analyze website", "error");
      }
    } catch (error) {
      console.error('Re-analyze error:', error);
      showToast("Failed to re-analyze website", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete request
  const deleteRequest = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/publisher/${requestId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          showToast("Request deleted successfully", "success");
          loadUserRequests(); // Reload requests
        } else {
          showToast("Failed to delete request", "error");
        }
      } catch (error) {
        console.error('Delete error:', error);
        showToast("Failed to delete request", "error");
      }
    }
  };

  // Format number for display
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  // Get trust level color
  const getTrustLevelColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Calculate stats
  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    approvedRequests: requests.filter(r => r.status === "approved").length,
    totalAudience: requests.reduce((sum, req) => sum + (req.analyticsSummary?.totalAudience || 0), 0),
    avgTrustScore: requests.length > 0 ? 
      Math.round(requests.reduce((sum, req) => sum + (req.websiteAnalysis?.trustScore || 0), 0) / requests.length) : 0,
    avgPrice: requests.length > 0 ?
      Math.round(requests.reduce((sum, req) => sum + (parseFloat(req.pricing?.standardPostPrice) || 0), 0) / requests.length) : 0
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
          toast.type === "error" 
            ? "bg-red-100 text-red-800 border-l-4 border-red-600" 
            : "bg-green-100 text-green-800 border-l-4 border-green-600"
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{toast.type === "error" ? "❌" : "✅"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-primary text-white py-4 px-6 shadow">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Publisher Dashboard</h1>
            <p className="text-secondary text-sm">Welcome, {currentUser.fullName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm bg-secondary px-3 py-1 rounded">
              {requests.length} Request{requests.length !== 1 ? 's' : ''} Submitted
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex space-x-6 px-6 py-4 bg-white shadow">
        <button
          onClick={() => setActiveTab("create-request")}
          className={`px-3 py-2 rounded-md font-medium ${
            activeTab === "create-request"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Submit New Request
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-3 py-2 rounded-md font-medium relative ${
            activeTab === "requests"
              ? "bg-primary text-white"
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
              ? "bg-primary text-white"
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
            <h2 className="text-xl font-semibold mb-6 text-center text-primary">
              Publisher Details Form
            </h2>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Site Information */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-medium mb-4 text-primary">Site Information</h3>
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                    {websiteVerification.isAccessible === false && (
                      <p className="text-red-500 text-xs mt-1">Website not accessible</p>
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Top Traffic Country</label>
                    <select
                      name="topTrafficCountry"
                      value={formData.topTrafficCountry}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
              <div className="border-l-4 border-secondary pl-6">
                <h3 className="text-lg font-medium mb-4 text-secondary">Publisher Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="publisherName"
                    placeholder="Your Full Name *"
                    value={formData.publisherName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                    readOnly
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address *"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                    readOnly
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create Password *"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Website/Company Name *"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <textarea
                  name="address"
                  placeholder="Complete Business Address *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary mt-4"
                  rows="2"
                  required
                />
              </div>

              {/* Category */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-medium mb-4 text-primary">Main Category *</h3>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Choose one category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Gray Niches */}
              <div className="border-l-4 border-secondary pl-6">
                <h3 className="text-lg font-medium mb-4 text-secondary">Gray Niches (select all that apply)</h3>
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
                        className="w-4 h-4 text-primary"
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
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium">Other (specify in additional notes)</span>
                  </label>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-medium mb-4 text-primary">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Standard Post Price ($) *</label>
                    <input
                      type="number"
                      name="standardPostPrice"
                      placeholder="e.g. 50"
                      value={formData.standardPostPrice}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">Higher price for sensitive niches</p>
                  </div>
                </div>
              </div>

              {/* Audience Size */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-medium mb-4 text-primary">Audience Information</h3>
                <input
                  type="number"
                  name="audienceSize"
                  placeholder="Current Monthly Audience *"
                  value={formData.audienceSize}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Total monthly unique visitors/readers</p>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-primary">
                <h4 className="font-medium text-primary mb-3">What happens next?</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Your request will be submitted to our database</li>
                  <li>• Admin will review your website and pricing</li>
                  <li>• Review process takes 2-3 business days</li>
                  <li>• You'll be notified of approval/rejection status</li>
                  <li>• You can submit multiple sites with different pricing</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="w-4 h-4 text-primary" required />
                <label htmlFor="terms" className="text-gray-600 text-sm">
                  I agree to the Terms and Conditions and confirm all information is accurate *
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-lg hover:bg-secondary transition disabled:bg-gray-400 font-medium text-lg shadow-lg"
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
              <h2 className="text-xl font-semibold mb-4 text-primary">Your Publisher Requests</h2>

              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <p className="text-gray-600 mb-4">No requests submitted yet</p>
                  <button
                    onClick={() => setActiveTab("create-request")}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary"
                  >
                    Submit Your First Request
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {requests.map((req) => (
                    <div
                      key={req._id}
                      className="border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      {/* Request Header */}
                      <div className="p-6 border-b bg-white rounded-t-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-primary">{req.companyName}</h3>
                            <p className="text-gray-600">{req.fullName}</p>
                            <div className="flex space-x-4 mt-2 text-sm">
                              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                                {req.category}
                              </span>
                              <span className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-medium">
                                ${req.pricing?.standardPostPrice || 'N/A'}
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
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {req.status.toUpperCase()}
                            </span>
                            <button
                              onClick={() => deleteRequest(req._id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                              title="Delete Request"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Website:</span>
                            <a href={req.website} target="_blank" rel="noopener noreferrer" 
                               className="text-primary hover:underline ml-1 block truncate">
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
                              {req.linkDetails?.nofollowAllowed && <span className="text-primary text-xs">Nofollow</span>}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Audience:</span> {formatNumber(req.audienceSize)}
                          </div>
                        </div>
                      </div>

                      {/* Analytics Section */}
                      {req.websiteAnalysis && (
                        <div className="p-6 bg-gray-100">
                          <h4 className="font-semibold mb-4 text-primary flex items-center">
                            📊 Analytics Report
                          </h4>
                          
                          {/* Key Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                              <p className="text-xl font-bold text-primary">
                                {formatNumber(req.websiteAnalysis.monthlyTraffic || 0)}
                              </p>
                              <p className="text-xs text-gray-600">Monthly Traffic</p>
                            </div>
                            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                              <p className="text-xl font-bold text-secondary">
                                {req.domainAuthority || req.websiteAnalysis.domainAuthority || 'N/A'}/100
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
                              <p className="text-lg font-bold text-primary">
                                {Object.keys(req.websiteAnalysis.socialMedia || {}).length}
                              </p>
                              <p className="text-xs text-gray-600">Social Platforms</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              Last analyzed: {new Date(req.websiteAnalysis.lastAnalyzed).toLocaleDateString()}
                            </p>
                            <button
                              onClick={() => reAnalyzeWebsite(req._id)}
                              disabled={loading}
                              className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-secondary disabled:bg-gray-400 transition"
                            >
                              Re-analyze Website
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-gray-200 rounded-b-lg">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Submitted: {new Date(req.createdAt).toLocaleString()}</span>
                          {req.contentDetails?.postSampleUrl && (
                            <a href={req.contentDetails.postSampleUrl} target="_blank" rel="noopener noreferrer" 
                               className="text-primary hover:underline">
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
              <h2 className="text-xl font-semibold mb-6 text-primary">Publisher Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-primary text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Total Requests</h3>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
                <div className="bg-secondary text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Pending</h3>
                  <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Approved</h3>
                  <p className="text-2xl font-bold">{stats.approvedRequests}</p>
                </div>
                <div className="bg-gray-700 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Total Audience</h3>
                  <p className="text-2xl font-bold">{formatNumber(stats.totalAudience)}</p>
                </div>
                <div className="bg-primary text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Avg Price</h3>
                  <p className="text-2xl font-bold">${stats.avgPrice}</p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Welcome to Publisher Dashboard!</h3>
                  <p className="text-gray-600 mb-6">
                    Start earning by submitting your website for review.
                  </p>
                  <button
                    onClick={() => setActiveTab("create-request")}
                    className="bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-secondary transition"
                  >
                    Submit Your First Request
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4 text-primary">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Average Trust Score</span>
                          <span>{stats.avgTrustScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div 
                            className="h-2 bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${stats.avgTrustScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4 text-primary">Recent Activity</h3>
                    <div className="space-y-3">
                      {requests.slice(0, 3).map((req) => (
                        <div key={req._id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <div>
                            <p className="font-medium text-sm text-primary">{req.companyName}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(req.createdAt).toLocaleDateString()} - {req.status}
                            </p>
                            <div className="flex space-x-2 mt-1">
                              {req.grayNiches && req.grayNiches.length > 0 && (
                                <span className="text-xs bg-gray-200 text-gray-800 px-1 rounded">
                                  {req.grayNiches.length} Gray Niches
                                </span>
                              )}
                              <span className="text-xs bg-primary text-white px-1 rounded">
                                {req.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-secondary">
                              ${req.pricing?.standardPostPrice || 'N/A'}
                              {req.pricing?.grayNichePrice && req.pricing.grayNichePrice !== req.pricing.standardPostPrice && 
                                ` - ${req.pricing.grayNichePrice}`
                              }
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatNumber(req.analyticsSummary?.totalAudience || 0)} audience
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
                          className="text-primary hover:text-secondary text-sm w-full text-left"
                        >
                          View all {requests.length} requests →
                        </button>
                      )}
                      {requests.length === 0 && (
                        <p className="text-gray-500 text-sm">No recent activity</p>
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your request...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePublisherDashboard;