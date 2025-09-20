

const AdvertiserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("browse-publishers");
  const [campaigns, setCampaigns] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minDA: "",
    maxDA: "",
    minTraffic: "",
    maxTraffic: "",
    grayNiche: "",
    country: ""
  });

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

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    
    // Check if user is an advertiser
    if (user.role !== "advertiser") {
      navigate("/login");
      return;
    }

    setCurrentUser(user);
    
    // Load publishers and campaigns
    loadPublishers();
    loadUserCampaigns(user.id);
  }, [navigate]);

  // Load all approved publishers
  const loadPublishers = () => {
    const allRequests = JSON.parse(localStorage.getItem("all_publisher_requests") || "[]");
    const approvedPublishers = allRequests.filter(req => req.status === "approved");
    setPublishers(approvedPublishers);
  };

  // Load user's campaigns
  const loadUserCampaigns = (userId) => {
    const allCampaigns = JSON.parse(localStorage.getItem("all_campaigns") || "[]");
    const userCampaigns = allCampaigns.filter(campaign => campaign.advertiserId === userId);
    setCampaigns(userCampaigns);
  };

  // Save campaigns
  const saveCampaigns = (userCampaigns) => {
    const allCampaigns = JSON.parse(localStorage.getItem("all_campaigns") || "[]");
    const otherUserCampaigns = allCampaigns.filter(campaign => campaign.advertiserId !== currentUser.id);
    const updatedAllCampaigns = [...otherUserCampaigns, ...userCampaigns];
    
    localStorage.setItem("all_campaigns", JSON.stringify(updatedAllCampaigns));
    setCampaigns(userCampaigns);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Filter publishers
  const filteredPublishers = publishers.filter(publisher => {
    const matchesCategory = !filters.category || publisher.category === filters.category;
    const matchesPrice = (!filters.minPrice || parseFloat(publisher.standardPostPrice) >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || parseFloat(publisher.standardPostPrice) <= parseFloat(filters.maxPrice));
    const matchesDA = (!filters.minDA || (publisher.domainAuthority || publisher.websiteAnalysis?.seoMetrics?.domainAuthority || 0) >= parseInt(filters.minDA)) &&
                     (!filters.maxDA || (publisher.domainAuthority || publisher.websiteAnalysis?.seoMetrics?.domainAuthority || 0) <= parseInt(filters.maxDA));
    const matchesTraffic = (!filters.minTraffic || (publisher.websiteAnalysis?.trafficData?.monthlyVisits || 0) >= parseInt(filters.minTraffic)) &&
                          (!filters.maxTraffic || (publisher.websiteAnalysis?.trafficData?.monthlyVisits || 0) <= parseInt(filters.maxTraffic));
    const matchesGrayNiche = !filters.grayNiche || (publisher.grayNiches && publisher.grayNiches.includes(filters.grayNiche));
    const matchesCountry = !filters.country || publisher.topTrafficCountry === filters.country;
    
    return matchesCategory && matchesPrice && matchesDA && matchesTraffic && matchesGrayNiche && matchesCountry;
  });

  // Create campaign
  const createCampaign = (publisherId) => {
    const publisher = publishers.find(p => p.id === publisherId);
    const campaignData = {
      id: Date.now(),
      advertiserId: currentUser.id,
      publisherId: publisherId,
      publisherName: publisher.companyName,
      publisherWebsite: publisher.website,
      publisherCategory: publisher.category,
      price: publisher.standardPostPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
      notes: ""
    };
    
    const updatedCampaigns = [campaignData, ...campaigns];
    saveCampaigns(updatedCampaigns);
    
    alert(`Campaign request sent to ${publisher.companyName}!`);
  };

  // Format number
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
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === "active").length,
    pendingCampaigns: campaigns.filter(c => c.status === "pending").length,
    totalSpent: campaigns.reduce((sum, campaign) => sum + (campaign.status === "completed" ? parseFloat(campaign.price) : 0), 0),
    availablePublishers: publishers.length
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
      {/* Header */}
      <header className="bg-green-600 text-white py-4 px-6 shadow">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Advertiser Dashboard</h1>
            <p className="text-green-200 text-sm">Welcome, {currentUser.fullName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm bg-green-700 px-3 py-1 rounded">
              {campaigns.length} Campaign{campaigns.length !== 1 ? 's' : ''} Created
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex space-x-6 px-6 py-4 bg-white shadow">
        <button
          onClick={() => setActiveTab("browse-publishers")}
          className={`px-3 py-2 rounded-md font-medium ${
            activeTab === "browse-publishers"
              ? "bg-green-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Browse Publishers ({publishers.length})
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-3 py-2 rounded-md font-medium relative ${
            activeTab === "campaigns"
              ? "bg-green-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          My Campaigns
          {campaigns.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {campaigns.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-2 rounded-md font-medium ${
            activeTab === "overview"
              ? "bg-green-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Overview
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Browse Publishers Tab */}
        {activeTab === "browse-publishers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Find Publishers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="p-2 border rounded-lg"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <input
                  type="number"
                  placeholder="Min Price ($)"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="p-2 border rounded-lg"
                />
                
                <input
                  type="number"
                  placeholder="Max Price ($)"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="p-2 border rounded-lg"
                />
                
                <input
                  type="number"
                  placeholder="Min DA"
                  value={filters.minDA}
                  onChange={(e) => setFilters({...filters, minDA: e.target.value})}
                  className="p-2 border rounded-lg"
                />
                
                <input
                  type="number"
                  placeholder="Min Traffic"
                  value={filters.minTraffic}
                  onChange={(e) => setFilters({...filters, minTraffic: e.target.value})}
                  className="p-2 border rounded-lg"
                />
                
                <select
                  value={filters.grayNiche}
                  onChange={(e) => setFilters({...filters, grayNiche: e.target.value})}
                  className="p-2 border rounded-lg"
                >
                  <option value="">All Niches</option>
                  {grayNiches.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setFilters({
                    category: "", minPrice: "", maxPrice: "", minDA: "", maxDA: "",
                    minTraffic: "", maxTraffic: "", grayNiche: "", country: ""
                  })}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Publishers List */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Available Publishers ({filteredPublishers.length})
              </h3>
              
              {filteredPublishers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <p className="text-gray-600 mb-4">No publishers found matching your criteria</p>
                  <button
                    onClick={() => setFilters({
                      category: "", minPrice: "", maxPrice: "", minDA: "", maxDA: "",
                      minTraffic: "", maxTraffic: "", grayNiche: "", country: ""
                    })}
                    className="text-blue-600 hover:underline"
                  >
                    Clear filters to see all publishers
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPublishers.map((publisher) => (
                    <div key={publisher.id} className="border rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{publisher.companyName}</h4>
                          <a 
                            href={publisher.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {publisher.website}
                          </a>
                          <div className="flex space-x-2 mt-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {publisher.category}
                            </span>
                            {publisher.grayNiches && publisher.grayNiches.length > 0 && (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                {publisher.grayNiches.length} Gray Niches
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${publisher.standardPostPrice}
                            {publisher.grayNichePrice && publisher.grayNichePrice !== publisher.standardPostPrice && 
                              ` - $${publisher.grayNichePrice}`
                            }
                          </p>
                          <p className="text-sm text-gray-500">per post</p>
                        </div>
                      </div>

                      {/* Analytics */}
                      {publisher.websiteAnalysis && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center bg-gray-50 p-3 rounded">
                            <p className="text-sm font-bold">
                              {formatNumber(publisher.websiteAnalysis.trafficData?.monthlyVisits || 0)}
                            </p>
                            <p className="text-xs text-gray-600">Monthly Traffic</p>
                          </div>
                          <div className="text-center bg-gray-50 p-3 rounded">
                            <p className="text-sm font-bold">
                              {publisher.domainAuthority || publisher.websiteAnalysis.seoMetrics?.domainAuthority || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-600">Domain Authority</p>
                          </div>
                          <div className="text-center bg-gray-50 p-3 rounded">
                            <span className={`px-2 py-1 rounded-full text-xs ${getTrustLevelColor(publisher.websiteAnalysis.analysis?.trustScore || 0)}`}>
                              {publisher.websiteAnalysis.analysis?.trustScore || 0}/100
                            </span>
                            <p className="text-xs text-gray-600 mt-1">Trust Score</p>
                          </div>
                          <div className="text-center bg-gray-50 p-3 rounded">
                            <p className="text-sm font-bold">
                              {formatNumber(publisher.analyticsSummary?.totalAudience || 0)}
                            </p>
                            <p className="text-xs text-gray-600">Total Audience</p>
                          </div>
                        </div>
                      )}

                      {/* Gray Niches */}
                      {publisher.grayNiches && publisher.grayNiches.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Accepts Gray Niches:</p>
                          <div className="flex flex-wrap gap-1">
                            {publisher.grayNiches.map(niche => (
                              <span key={niche} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                {niche}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <p>Contact: {publisher.email}</p>
                          <p>Links: {publisher.dofollowAllowed && "Dofollow"} {publisher.nofollowAllowed && "Nofollow"}</p>
                        </div>
                        <button
                          onClick={() => createCampaign(publisher.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                          Create Campaign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">My Campaigns</h2>

              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📢</div>
                  <p className="text-gray-600 mb-4">No campaigns created yet</p>
                  <button
                    onClick={() => setActiveTab("browse-publishers")}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Browse Publishers
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{campaign.publisherName}</h4>
                          <a 
                            href={campaign.publisherWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {campaign.publisherWebsite}
                          </a>
                          <div className="flex space-x-2 mt-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {campaign.publisherCategory}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              campaign.status === "active" 
                                ? "bg-green-100 text-green-800"
                                : campaign.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {campaign.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${campaign.price}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </p>
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
              <h2 className="text-xl font-semibold mb-6">Advertiser Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Total Campaigns</h3>
                  <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Active</h3>
                  <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Pending</h3>
                  <p className="text-2xl font-bold">{stats.pendingCampaigns}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Total Spent</h3>
                  <p className="text-2xl font-bold">${stats.totalSpent}</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Publishers Available</h3>
                  <p className="text-2xl font-bold">{stats.availablePublishers}</p>
                </div>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">Welcome to Advertiser Dashboard!</h3>
                  <p className="text-gray-600 mb-6">
                    Start your marketing campaigns by browsing our approved publishers.
                  </p>
                  <button
                    onClick={() => setActiveTab("browse-publishers")}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition"
                  >
                    Browse Publishers
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Campaign Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Active Campaigns</span>
                          <span>{Math.round((stats.activeCampaigns / stats.totalCampaigns) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div 
                            className="h-2 bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${(stats.activeCampaigns / stats.totalCampaigns) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Recent Campaigns</h3>
                    <div className="space-y-3">
                      {campaigns.slice(0, 3).map((campaign) => (
                        <div key={campaign.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{campaign.publisherName}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(campaign.createdAt).toLocaleDateString()} - {campaign.status}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">${campaign.price}</p>
                          </div>
                        </div>
                      ))}
                      {campaigns.length > 3 && (
                        <button
                          onClick={() => setActiveTab("campaigns")}
                          className="text-green-600 hover:text-green-800 text-sm w-full text-left"
                        >
                          View all {campaigns.length} campaigns →
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
    </div>
  );
};

export default AdvertiserDashboard;