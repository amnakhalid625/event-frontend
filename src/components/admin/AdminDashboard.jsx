import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  FileText,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending-requests");
  const [publisherRequests, setPublisherRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dashboardStats, setDashboardStats] = useState({});
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Get API base URL with fallback
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://event-backend-eu68.vercel.app/api';

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      setError("Please login first");
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      if (user.role !== "admin") {
        setError("Access denied: Admin account required");
        return;
      }

      setCurrentUser(user);
      loadDashboardData();

      // Auto refresh when window gets focus (user comes back to tab)
      const handleFocus = () => {
        console.log('Window focused, refreshing data...');
        loadDashboardData();
      };

      window.addEventListener('focus', handleFocus);

      // Auto refresh every 30 seconds if enabled
      const interval = setInterval(() => {
        if (autoRefresh) {
          console.log('Auto-refreshing dashboard data...');
          loadDashboardData();
        }
      }, 30000); // 30 seconds

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    } catch (err) {
      setError("Invalid user data. Please login again.");
    }
  }, []);

  // Test API connection first
  const testAPIConnection = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('Testing API connection to:', `${API_BASE_URL}/admin/`);
      console.log('Token exists:', !!token);
      
      const response = await fetch(`${API_BASE_URL}/admin/`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response Data:', data);
        return true;
      } else {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        return false;
      }
    } catch (error) {
      console.error('API Connection Error:', error);
      return false;
    }
  };

  // Load dashboard stats and requests from API
  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log('Loading dashboard data from:', API_BASE_URL);

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Test API connection first
      const apiWorking = await testAPIConnection();
      if (!apiWorking) {
        throw new Error("Admin API is not accessible. Please check your server.");
      }

      // Try to load dashboard stats (optional)
      try {
        console.log('Fetching dashboard stats...');
        const statsResponse = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
          headers
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('Dashboard stats loaded:', statsData);
          setDashboardStats(statsData);
        } else {
          console.warn('Dashboard stats failed:', statsResponse.status);
        }
      } catch (statsError) {
        console.warn('Dashboard stats error:', statsError);
      }

      // Load publisher requests (required)
      console.log('Fetching publisher requests...');
      const requestsResponse = await fetch(`${API_BASE_URL}/admin/publisher-requests?limit=100`, {
        headers
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        console.log('Publisher requests loaded:', requestsData);
        setPublisherRequests(requestsData.requests || []);
        setLastUpdate(new Date());
      } else if (requestsResponse.status === 404) {
        // If endpoint doesn't exist, try alternative approach
        console.log('Admin endpoint not found, trying alternative...');
        setPublisherRequests([]);
        setError("Admin endpoints not configured. Please check your server setup.");
      } else {
        throw new Error(`Failed to load requests: ${requestsResponse.status}`);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(`Failed to load dashboard data: ${error.message}`);
      
      // Fallback to localStorage for testing
      console.log('Falling back to localStorage...');
      try {
        const localRequests = JSON.parse(localStorage.getItem("all_publisher_requests") || "[]");
        if (localRequests.length > 0) {
          setPublisherRequests(localRequests);
          setError("Using local data. Server connection failed.");
        }
      } catch (localError) {
        console.error('LocalStorage fallback failed:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Approve request via API
  const approveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      
      console.log('Approving request:', requestId);
      
      const response = await fetch(`${API_BASE_URL}/admin/publisher-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminNotes: "Approved from dashboard"
        })
      });

      if (response.ok) {
        alert("Publisher request approved successfully!");
        setShowModal(false);
        loadDashboardData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to approve request");
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert("Failed to approve request: " + error.message);
      
      // Fallback to localStorage update
      updateLocalStorage(requestId, "approved");
    }
  };

  // Reject request via API
  const rejectRequest = async (requestId) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/admin/publisher-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason,
          adminNotes: "Rejected from dashboard"
        })
      });

      if (response.ok) {
        alert("Publisher request rejected");
        setShowModal(false);
        setRejectionReason("");
        loadDashboardData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to reject request");
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert("Failed to reject request: " + error.message);
      
      // Fallback to localStorage update
      updateLocalStorage(requestId, "rejected", rejectionReason);
    }
  };

  // Fallback localStorage update
  const updateLocalStorage = (requestId, status, reason = "") => {
    try {
      const updatedRequests = publisherRequests.map(req => 
        (req.id || req._id) === requestId 
          ? { 
              ...req, 
              status: status,
              rejectionReason: reason,
              reviewedBy: currentUser.id,
              reviewedAt: new Date().toISOString()
            }
          : req
      );
      
      localStorage.setItem("all_publisher_requests", JSON.stringify(updatedRequests));
      setPublisherRequests(updatedRequests);
      setShowModal(false);
      setRejectionReason("");
    } catch (error) {
      console.error('LocalStorage update failed:', error);
    }
  };

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  // Filter requests
  const filteredRequests = publisherRequests.filter(req => {
    const matchesSearch = (req.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (req.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (req.website || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (req.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get requests by tab
  const getRequestsByTab = () => {
    switch (activeTab) {
      case "pending-requests":
        return filteredRequests.filter(req => req.status === "pending");
      case "approved-requests":
        return filteredRequests.filter(req => req.status === "approved");
      case "rejected-requests":
        return filteredRequests.filter(req => req.status === "rejected");
      default:
        return filteredRequests;
    }
  };

  // Calculate stats from API data or local data
  const stats = dashboardStats.stats || {
    total: publisherRequests.length,
    pending: publisherRequests.filter(req => req.status === "pending").length,
    approved: publisherRequests.filter(req => req.status === "approved").length,
    rejected: publisherRequests.filter(req => req.status === "rejected").length,
    totalTraffic: publisherRequests.reduce((sum, req) => sum + (req.websiteAnalysis?.monthlyTraffic || 0), 0)
  };

  // Show error state
  if (error && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white py-4 px-6 shadow">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-red-200 text-sm">Welcome, {currentUser.fullName}</p>
            {error && (
              <p className="text-red-200 text-xs bg-red-700 px-2 py-1 rounded mt-1">
                {error}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm bg-red-700 px-3 py-1 rounded">
              {stats.pending} Pending Requests
            </div>
            {lastUpdate && (
              <div className="text-xs text-red-200">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs px-2 py-1 rounded ${autoRefresh ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm flex items-center space-x-1 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Traffic</p>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.totalTraffic)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* API Connection Status */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="text-sm font-medium">
                API Status: {error ? 'Disconnected' : 'Connected'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Endpoint: {API_BASE_URL}/admin
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 py-4">
              <button
                onClick={() => setActiveTab("pending-requests")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "pending-requests"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending Requests ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab("approved-requests")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "approved-requests"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setActiveTab("rejected-requests")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "rejected-requests"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </nav>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by company, publisher, or website..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Requests List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p>Loading requests...</p>
              </div>
            ) : getRequestsByTab().length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "pending-requests" && "No pending requests to review."}
                  {activeTab === "approved-requests" && "No approved requests yet."}
                  {activeTab === "rejected-requests" && "No rejected requests."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getRequestsByTab().map((request) => (
                  <div key={request._id || request.id} className="border rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.companyName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === "pending" 
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Publisher</p>
                            <p className="text-sm text-gray-900">{request.fullName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Website</p>
                            <a 
                              href={request.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {request.website}
                            </a>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Category</p>
                            <p className="text-sm text-gray-900">{request.category}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Submitted: {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowModal(true);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                            >
                              <Eye size={16} />
                              <span>Review</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Review Publisher Request</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-3">Publisher Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Company:</span> {selectedRequest.companyName}</p>
                    <p><span className="font-medium">Publisher:</span> {selectedRequest.fullName}</p>
                    <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedRequest.phone}</p>
                    <p><span className="font-medium">Website:</span> 
                      <a href={selectedRequest.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {selectedRequest.website}
                      </a>
                    </p>
                    <p><span className="font-medium">Address:</span> {selectedRequest.address}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Request Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Category:</span> {selectedRequest.category}</p>
                    <p><span className="font-medium">Audience Size:</span> {formatNumber(selectedRequest.audienceSize)}</p>
                    <p><span className="font-medium">Domain Authority:</span> {selectedRequest.domainAuthority || 'N/A'}</p>
                    <p><span className="font-medium">Page Authority:</span> {selectedRequest.pageAuthority || 'N/A'}</p>
                    <p><span className="font-medium">Monthly Traffic:</span> {formatNumber(selectedRequest.monthlyTrafficAhrefs || 0)}</p>
                    <p><span className="font-medium">Standard Price:</span> ${selectedRequest.pricing?.standardPostPrice || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.grayNiches && selectedRequest.grayNiches.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Gray Niches Accepted</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.grayNiches.map(niche => (
                      <span key={niche} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div className="border-t pt-6">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (if rejecting)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide reason for rejection..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                        rows="3"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => rejectRequest(selectedRequest._id || selectedRequest.id)}
                        disabled={!rejectionReason.trim()}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => approveRequest(selectedRequest._id || selectedRequest.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                      >
                        Approve Request
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-2 text-red-600">Rejection Reason</h3>
                  <p className="text-sm text-gray-700 bg-red-50 p-3 rounded">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;