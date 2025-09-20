import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEye, 
  FaDollarSign, 
  FaClock, 
  FaCheckCircle,
  FaBell,
  FaUserCircle,
  FaSearch,
  FaFilter,
  FaStar,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

const AdvertiserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for advertiser
  const stats = [
    { title: 'Active Services', value: '12', icon: <FaEye />, color: 'bg-blue-500' },
    { title: 'Pending Orders', value: '5', icon: <FaClock />, color: 'bg-yellow-500' },
    { title: 'Completed Orders', value: '89', icon: <FaCheckCircle />, color: 'bg-green-500' },
    { title: 'Total Earnings', value: '$12,450', icon: <FaDollarSign />, color: 'bg-purple-500' }
  ];

  const myServices = [
    { 
      id: 1, 
      title: 'Professional Website Development', 
      category: 'Web Development',
      price: '$500 - $2000',
      orders: 15,
      rating: 4.8,
      status: 'Active',
      image: 'https://via.placeholder.com/300x200'
    },
    { 
      id: 2, 
      title: 'Modern Logo Design', 
      category: 'Graphic Design',
      price: '$50 - $200',
      orders: 28,
      rating: 4.9,
      status: 'Active',
      image: 'https://via.placeholder.com/300x200'
    },
    { 
      id: 3, 
      title: 'SEO Content Writing', 
      category: 'Content Writing',
      price: '$20 - $100',
      orders: 42,
      rating: 4.7,
      status: 'Paused',
      image: 'https://via.placeholder.com/300x200'
    }
  ];

  const recentOrders = [
    { id: 1, service: 'Website Development', client: 'John Smith', status: 'In Progress', amount: '$800', date: '2024-01-15', deadline: '2024-01-30' },
    { id: 2, service: 'Logo Design', client: 'Sarah Johnson', status: 'Delivered', amount: '$150', date: '2024-01-14', deadline: '2024-01-20' },
    { id: 3, service: 'Content Writing', client: 'Mike Davis', status: 'Revision', amount: '$75', date: '2024-01-13', deadline: '2024-01-18' },
    { id: 4, service: 'Website Development', client: 'Lisa Wilson', status: 'In Progress', amount: '$1200', date: '2024-01-12', deadline: '2024-02-01' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Revision': return 'bg-yellow-100 text-yellow-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Advertiser Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaBell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaUserCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex space-x-8">
          {['overview', 'my-services', 'orders', 'create-service'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-lg text-white`}>
                      {stat.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service & Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.service}</div>
                            <div className="text-sm text-gray-500">by {order.client}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.deadline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'my-services' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">My Services</h2>
              <button 
                onClick={() => setActiveTab('create-service')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hoverColor flex items-center"
              >
                <FaPlus className="mr-2" />
                Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{service.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.category}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-primary">{service.price}</span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{service.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{service.orders} orders</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FaFilter className="mr-2" />
                  Filter
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{order.service}</h3>
                        <p className="text-sm text-gray-600 mt-1">Client: {order.client}</p>
                        <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-1">{order.amount}</p>
                        <p className="text-sm text-gray-600">Due: {order.deadline}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'create-service' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Service</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                <input
                  type="text"
                  placeholder="I will create a professional website for you..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Select a category...</option>
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>Graphic Design</option>
                  <option>Content Writing</option>
                  <option>Digital Marketing</option>
                  <option>Video & Animation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
                <textarea
                  rows={5}
                  placeholder="Describe what you will deliver to buyers..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Basic Price</label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Standard Price</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Premium Price</label>
                  <input
                    type="number"
                    placeholder="200"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>7 days</option>
                  <option>14 days</option>
                  <option>30 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-600">Click to upload service images (up to 5 images)</p>
                  <input type="file" multiple className="hidden" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-hoverColor transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Create Service
              </button>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdvertiserDashboard;