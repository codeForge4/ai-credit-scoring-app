import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Database,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Settings,
  UserCheck,
  CreditCard,
  DollarSign,
  Eye,
  Download,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Ban,
  UserX
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { useNotifications } from '../contexts/NotificationContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface SystemMetric {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  creditScore: number;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  registrationDate: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SystemAlert {
  id: string;
  type: 'security' | 'system' | 'user' | 'data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export default function AdminDashboard() {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'alerts' | 'settings'>('overview');
  const [users, setUsers] = useState<UserData[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  useEffect(() => {
    // Mock user data
    const mockUsers: UserData[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        creditScore: 742,
        status: 'active',
        lastLogin: '2024-01-15T10:30:00Z',
        registrationDate: '2023-06-15T00:00:00Z',
        riskLevel: 'low'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        creditScore: 685,
        status: 'active',
        lastLogin: '2024-01-14T15:45:00Z',
        registrationDate: '2023-08-22T00:00:00Z',
        riskLevel: 'medium'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        creditScore: 590,
        status: 'inactive',
        lastLogin: '2024-01-10T09:20:00Z',
        registrationDate: '2023-12-01T00:00:00Z',
        riskLevel: 'high'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        creditScore: 798,
        status: 'active',
        lastLogin: '2024-01-15T14:15:00Z',
        registrationDate: '2023-03-10T00:00:00Z',
        riskLevel: 'low'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david@example.com',
        creditScore: 620,
        status: 'suspended',
        lastLogin: '2024-01-08T11:30:00Z',
        registrationDate: '2023-09-18T00:00:00Z',
        riskLevel: 'high'
      }
    ];

    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'security',
        severity: 'high',
        title: 'Multiple Failed Login Attempts',
        description: 'User john@example.com has 5 failed login attempts in the last hour',
        timestamp: '2024-01-15T10:45:00Z',
        resolved: false
      },
      {
        id: '2',
        type: 'system',
        severity: 'medium',
        title: 'High API Response Time',
        description: 'Credit scoring API response time increased to 2.3s (threshold: 2s)',
        timestamp: '2024-01-15T09:30:00Z',
        resolved: false
      },
      {
        id: '3',
        type: 'data',
        severity: 'low',
        title: 'Data Source Sync Delay',
        description: 'Utility data sync delayed by 15 minutes for 3 users',
        timestamp: '2024-01-15T08:15:00Z',
        resolved: true
      },
      {
        id: '4',
        type: 'user',
        severity: 'critical',
        title: 'Suspicious Credit Score Pattern',
        description: 'Unusual credit score fluctuation detected for user ID: 12345',
        timestamp: '2024-01-15T07:00:00Z',
        resolved: false
      }
    ];

    setUsers(mockUsers);
    setAlerts(mockAlerts);
  }, []);

  const systemMetrics: SystemMetric[] = [
    {
      name: 'Total Users',
      value: '12,847',
      change: '+324',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Sessions',
      value: '3,421',
      change: '+12%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      name: 'Credit Checks Today',
      value: '8,932',
      change: '+5.2%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'bg-purple-500'
    },
    {
      name: 'System Health',
      value: '99.8%',
      change: '-0.1%',
      changeType: 'negative',
      icon: Shield,
      color: 'bg-emerald-500'
    },
    {
      name: 'Revenue Today',
      value: '$45,230',
      change: '+8.7%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      name: 'Open Alerts',
      value: '7',
      change: '+2',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Active Users',
        data: [800, 1600, 2400, 4200, 1800, 2600],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const creditScoreDistribution = {
    labels: ['300-579', '580-669', '670-739', '740-799', '800-850'],
    datasets: [
      {
        data: [8, 22, 35, 25, 10],
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          '#3b82f6',
          '#10b981',
          '#059669'
        ],
        borderWidth: 0
      }
    ]
  };

  const apiUsageData = {
    labels: ['Credit Check', 'Data Sync', 'Report Gen', 'Auth', 'Analytics'],
    datasets: [
      {
        label: 'API Calls (thousands)',
        data: [45, 32, 18, 67, 23],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: action === 'suspend' ? 'suspended' : action === 'activate' ? 'active' : u.status }
        : u
    ));

    addNotification({
      type: action === 'delete' ? 'warning' : 'success',
      title: `User ${action === 'suspend' ? 'Suspended' : action === 'activate' ? 'Activated' : 'Deleted'}`,
      message: `${user.name} has been ${action}d successfully.`,
      duration: 3000
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));

    addNotification({
      type: 'success',
      title: 'Alert Resolved',
      message: 'The alert has been marked as resolved.',
      duration: 3000
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'alerts', name: 'System Alerts', icon: AlertTriangle },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and management console</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {systemMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{metric.name}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 
                    metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">today</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-lg ${metric.color} bg-opacity-10 flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
              <div className="h-64">
                <Line data={userGrowthData} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Distribution</h3>
              <div className="h-64">
                <Doughnut data={creditScoreDistribution} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage</h3>
              <div className="h-64">
                <Bar data={apiUsageData} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New user registration', user: 'john@example.com', time: '2 minutes ago', type: 'user' },
                  { action: 'Credit score updated', user: 'jane@example.com', time: '5 minutes ago', type: 'score' },
                  { action: 'Data source connected', user: 'mike@example.com', time: '8 minutes ago', type: 'data' },
                  { action: 'Report generated', user: 'sarah@example.com', time: '12 minutes ago', type: 'report' },
                  { action: 'Security alert resolved', user: 'System', time: '15 minutes ago', type: 'security' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'score' ? 'bg-green-500' :
                      activity.type === 'data' ? 'bg-purple-500' :
                      activity.type === 'report' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.creditScore}</div>
                          <div className={`text-xs ${
                            user.creditScore >= 740 ? 'text-green-600' :
                            user.creditScore >= 670 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {user.creditScore >= 740 ? 'Excellent' :
                             user.creditScore >= 670 ? 'Good' : 'Fair'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                            user.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.riskLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            {user.status === 'suspended' ? (
                              <button 
                                onClick={() => handleUserAction(user.id, 'activate')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {[
                  { metric: 'Average Response Time', value: '1.2s', target: '< 2s', status: 'good' },
                  { metric: 'API Success Rate', value: '99.7%', target: '> 99%', status: 'good' },
                  { metric: 'Credit Score Accuracy', value: '94.8%', target: '> 90%', status: 'good' },
                  { metric: 'User Satisfaction', value: '4.6/5', target: '> 4.0', status: 'good' },
                  { metric: 'Data Processing Speed', value: '2.8s', target: '< 3s', status: 'warning' }
                ].map((item, index) => (
                  <div key={item.metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{item.metric}</div>
                      <div className="text-sm text-gray-600">Target: {item.target}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{item.value}</div>
                      <div className={`text-xs ${
                        item.status === 'good' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {item.status === 'good' ? 'On Target' : 'Needs Attention'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$1.2M</div>
                    <div className="text-sm text-blue-800">Monthly Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$45K</div>
                    <div className="text-sm text-green-800">Daily Average</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { source: 'Credit Reports', amount: '$680K', percentage: 57 },
                    { source: 'API Subscriptions', amount: '$320K', percentage: 27 },
                    { source: 'Premium Features', amount: '$150K', percentage: 12 },
                    { source: 'Data Insights', amount: '$50K', percentage: 4 }
                  ].map((item, index) => (
                    <div key={item.source} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.source}</span>
                        <span className="font-medium">{item.amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                <p className="text-gray-600 mt-1">Monitor and manage system alerts and notifications</p>
              </div>
              <div className="divide-y divide-gray-200">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-6 ${alert.resolved ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium ${alert.resolved ? 'text-gray-600' : 'text-gray-900'}`}>
                              {alert.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              alert.type === 'security' ? 'bg-red-100 text-red-700' :
                              alert.type === 'system' ? 'bg-blue-100 text-blue-700' :
                              alert.type === 'user' ? 'bg-purple-100 text-purple-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {alert.type}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                              alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {alert.severity}
                            </span>
                            {alert.resolved && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                Resolved
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${alert.resolved ? 'text-gray-500' : 'text-gray-700'}`}>
                            {alert.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!alert.resolved && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Configuration</h3>
              <div className="space-y-4">
                {[
                  { setting: 'Maintenance Mode', description: 'Enable system maintenance mode', enabled: false },
                  { setting: 'Auto Backups', description: 'Automatic daily database backups', enabled: true },
                  { setting: 'Email Notifications', description: 'Send admin email notifications', enabled: true },
                  { setting: 'API Rate Limiting', description: 'Enable API rate limiting', enabled: true },
                  { setting: 'Debug Logging', description: 'Enable detailed debug logging', enabled: false }
                ].map((setting, index) => (
                  <div key={setting.setting} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{setting.setting}</h4>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Minimum Length</label>
                  <input
                    type="number"
                    defaultValue={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="pt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                    Save Security Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}