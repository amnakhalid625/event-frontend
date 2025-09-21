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
  Filter
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

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      alert("Please login first");
      return;
    }

    const user = JSON.parse(userData);
    
    if (user.role !== "admin") {
      alert("Access denied: Admin account required");
      return;
    }

    setCurrentUser(user);
    loadPublisherRequests();
  }, []);

  // Load all publisher requests
  const loadPublisherRequests = async () => {
    setLoading(true);
    try {
      // For now, load from localStorage (later will be API call)
      const allRequests = JSON.parse(localStorage.getItem("all_publisher_requests") || "[]");
      setPublisherRequests(allRequests);
    } catch (error) {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

 

  // Approve request
  const approveRequest = async (requestId) => {
    try {
      const updatedRequests = publisherRequests.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: "approved", 
              approvedBy: currentUser.id,
              approvalDate: new Date().toISOString(),
              reviewedAt: new Date().toISOString()
            }
          : req
      );
      
      localStorage.setItem("all_publisher_requests", JSON.stringify(updatedRequests));
      setPublisherRequests(updatedRequests);
      setShowModal(false);
      alert("Publisher request approved successfully!");
    } catch (error) {
      alert("Failed to approve request");
    }
  };

  // Reject request
  const rejectRequest = async (requestId) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      const updatedRequests = publisherRequests.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: "rejected", 
              rejectionReason: rejectionReason,
              reviewedBy: currentUser.id,
              reviewedAt: new Date().toISOString()
            }
          : req
      );
      
      localStorage.setItem("all_publisher_requests", JSON.stringify(updatedRequests));
      setPublisherRequests(updatedRequests);
      setShowModal(false);
      setRejectionReason("");
      alert("Publisher request rejected");
    } catch (error) {
      alert("Failed to reject request");
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
    const matchesSearch = req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.publisherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.website.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  // Calculate stats
  const stats = {
    total: publisherRequests.length,
    pending: publisherRequests.filter(req => req.status === "pending").length,
    approved: publisherRequests.filter(req => req.status === "approved").length,
    rejected: publisherRequests.filter(req => req.status === "rejected").length,
    totalTraffic: publisherRequests.reduce((sum, req) => sum + (req.websiteAnalysis?.trafficData?.monthlyVisits || 0), 0)
  };

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
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm bg-red-700 px-3 py-1 rounded">
              {stats.pending} Pending Requests
            </div>
          
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
                  <div key={request.id} className="border rounded-lg p-6 hover:shadow-md transition">
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
                            <p className="text-sm text-gray-900">{request.publisherName}</p>
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

                        {request.websiteAnalysis && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-xs text-gray-500">Monthly Traffic</p>
                              <p className="font-semibold">
                                {formatNumber(request.websiteAnalysis.trafficData?.monthlyVisits || 0)}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-xs text-gray-500">Domain Authority</p>
                              <p className="font-semibold">
                                {request.domainAuthority || request.websiteAnalysis.seoMetrics?.domainAuthority || 'N/A'}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-xs text-gray-500">Trust Score</p>
                              <p className="font-semibold">
                                {request.websiteAnalysis.analysis?.trustScore || 0}/100
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-xs text-gray-500">Price</p>
                              <p className="font-semibold text-green-600">
                                ${request.standardPostPrice}
                              </p>
                            </div>
                          </div>
                        )}

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
                    <p><span className="font-medium">Publisher:</span> {selectedRequest.publisherName}</p>
                    <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedRequest.phone}</p>
                    <p><span className="font-medium">Website:</span> 
                      <a href={selectedRequest.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {selectedRequest.website}
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Analytics Data</h3>
                  {selectedRequest.websiteAnalysis && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Monthly Traffic</p>
                        <p className="font-semibold">
                          {formatNumber(selectedRequest.websiteAnalysis.trafficData?.monthlyVisits || 0)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Domain Authority</p>
                        <p className="font-semibold">
                          {selectedRequest.domainAuthority || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Trust Score</p>
                        <p className="font-semibold">
                          {selectedRequest.websiteAnalysis.analysis?.trustScore || 0}/100
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Standard Price</p>
                        <p className="font-semibold text-green-600">
                          ${selectedRequest.standardPostPrice}
                        </p>
                      </div>
                    </div>
                  )}
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
                        onClick={() => rejectRequest(selectedRequest.id)}
                        disabled={!rejectionReason.trim()}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => approveRequest(selectedRequest.id)}
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