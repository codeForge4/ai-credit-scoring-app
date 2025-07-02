import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Fingerprint,
  Smartphone,
  Bell,
  Download,
  FileText,
  Settings,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Database,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ComponentType<any>;
}

interface DataSource {
  id: string;
  name: string;
  type: 'banking' | 'utility' | 'telecom' | 'ecommerce';
  connected: boolean;
  lastSync: string;
  impact: number;
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'data' | 'reports'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, San Francisco, CA 94102',
    dateOfBirth: '1990-01-01'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: 'biometric',
      name: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition to sign in',
      enabled: user?.biometricEnabled || false,
      icon: Fingerprint
    },
    {
      id: 'mfa',
      name: 'Multi-Factor Authentication',
      description: 'Add an extra layer of security with SMS or app-based codes',
      enabled: user?.mfaEnabled || false,
      icon: Shield
    },
    {
      id: 'notifications',
      name: 'Security Notifications',
      description: 'Get notified of suspicious account activity',
      enabled: true,
      icon: Bell
    },
    {
      id: 'autoLogout',
      name: 'Auto Logout',
      description: 'Automatically sign out after 30 minutes of inactivity',
      enabled: true,
      icon: Lock
    }
  ]);

  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'primary-bank',
      name: 'Chase Bank',
      type: 'banking',
      connected: true,
      lastSync: '2024-01-15T10:30:00Z',
      impact: 85
    },
    {
      id: 'utility-pge',
      name: 'PG&E Utilities',
      type: 'utility',
      connected: true,
      lastSync: '2024-01-14T15:45:00Z',
      impact: 72
    },
    {
      id: 'telecom-verizon',
      name: 'Verizon Wireless',
      type: 'telecom',
      connected: true,
      lastSync: '2024-01-15T08:20:00Z',
      impact: 65
    },
    {
      id: 'ecommerce-amazon',
      name: 'Amazon',
      type: 'ecommerce',
      connected: false,
      lastSync: '',
      impact: 45
    }
  ]);

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      email: formData.email
    });
    setIsEditing(false);
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      duration: 3000
    });
  };

  const toggleSecuritySetting = (settingId: string) => {
    setSecuritySettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );

    const setting = securitySettings.find(s => s.id === settingId);
    if (setting) {
      addNotification({
        type: setting.enabled ? 'warning' : 'success',
        title: `${setting.name} ${setting.enabled ? 'Disabled' : 'Enabled'}`,
        message: `${setting.name} has been ${setting.enabled ? 'disabled' : 'enabled'} for your account.`,
        duration: 3000
      });

      if (settingId === 'biometric') {
        updateProfile({ biometricEnabled: !setting.enabled });
      } else if (settingId === 'mfa') {
        updateProfile({ mfaEnabled: !setting.enabled });
      }
    }
  };

  const connectDataSource = (sourceId: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId
          ? { ...source, connected: true, lastSync: new Date().toISOString() }
          : source
      )
    );

    const source = dataSources.find(s => s.id === sourceId);
    addNotification({
      type: 'success',
      title: 'Data Source Connected',
      message: `${source?.name} has been successfully connected to enhance your credit profile.`,
      duration: 4000
    });
  };

  const disconnectDataSource = (sourceId: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId
          ? { ...source, connected: false, lastSync: '' }
          : source
      )
    );

    const source = dataSources.find(s => s.id === sourceId);
    addNotification({
      type: 'warning',
      title: 'Data Source Disconnected',
      message: `${source?.name} has been disconnected from your credit profile.`,
      duration: 4000
    });
  };

  const downloadReport = (type: string) => {
    addNotification({
      type: 'info',
      title: 'Report Generation Started',
      message: `Your ${type} report is being generated and will be available for download shortly.`,
      duration: 4000
    });
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'banking': return CreditCard;
      case 'utility': return Settings;
      case 'telecom': return Smartphone;
      case 'ecommerce': return Share2;
      default: return Database;
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data Sources', icon: Database },
    { id: 'reports', name: 'Reports', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account, security, and data preferences</p>
        </div>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="mt-4 sm:mt-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Account Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">Credit Score:</span>
                <span className="text-lg font-bold text-green-600">{user?.creditScore}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {isEditing ? 'Save Changes' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <div className="mt-1 relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Statistics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Member Since', value: 'January 2023' },
                  { label: 'Credit Checks', value: '24 this year' },
                  { label: 'Reports Generated', value: '12 reports' },
                  { label: 'Data Sources', value: '3 connected' },
                  { label: 'Security Score', value: '95/100' }
                ].map((stat, index) => (
                  <div key={stat.label} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="font-medium text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Account Verified</span>
                </div>
                <p className="text-sm text-blue-800 mt-1">
                  Your identity has been verified and your account is fully active.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
              <div className="space-y-4">
                {securitySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        setting.enabled ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <setting.icon className={`w-5 h-5 ${
                          setting.enabled ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.name}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSecuritySetting(setting.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Update Password
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Data Sources</h3>
              <p className="text-gray-600 mb-6">
                Connect various data sources to improve your credit profile accuracy and get better insights.
              </p>
              
              <div className="space-y-4">
                {dataSources.map((source) => {
                  const SourceIcon = getSourceTypeIcon(source.type);
                  return (
                    <div key={source.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          source.connected ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <SourceIcon className={`w-6 h-6 ${
                            source.connected ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{source.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{source.type} Data</p>
                          {source.connected && source.lastSync && (
                            <p className="text-xs text-gray-500">
                              Last synced: {new Date(source.lastSync).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            Impact: {source.impact}/100
                          </div>
                          <div className={`text-xs ${
                            source.connected ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {source.connected ? 'Connected' : 'Not Connected'}
                          </div>
                        </div>
                        <button
                          onClick={() => source.connected 
                            ? disconnectDataSource(source.id)
                            : connectDataSource(source.id)
                          }
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            source.connected
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {source.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
            >
              <div className="flex items-start space-x-3">
                <Database className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Privacy & Security</h4>
                  <p className="text-gray-700 text-sm mb-4">
                    Your data is encrypted and securely processed. We use bank-level security measures 
                    and never share your personal information without explicit consent.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 256-bit AES encryption for all data transmission</li>
                    <li>• GDPR and CCPA compliant data handling</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• You can disconnect any data source at any time</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Download Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Monthly Credit Report',
                    description: 'Comprehensive credit analysis with AI insights',
                    type: 'monthly',
                    size: '2.3 MB',
                    lastGenerated: '2024-01-15'
                  },
                  {
                    title: 'Financial Summary',
                    description: 'Overview of your financial health and trends',
                    type: 'financial',
                    size: '1.8 MB',
                    lastGenerated: '2024-01-10'
                  },
                  {
                    title: 'Alternative Data Report',
                    description: 'Impact analysis of alternative data sources',
                    type: 'alternative',
                    size: '1.2 MB',
                    lastGenerated: '2024-01-08'
                  },
                  {
                    title: 'Loan Readiness Report',
                    description: 'Assessment of your loan approval likelihood',
                    type: 'loan',
                    size: '900 KB',
                    lastGenerated: '2024-01-05'
                  }
                ].map((report, index) => (
                  <div key={report.type} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>Size: {report.size}</span>
                      <span>Last: {report.lastGenerated}</span>
                    </div>
                    <button
                      onClick={() => downloadReport(report.title)}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Automatic Monthly Reports</h4>
                    <p className="text-sm text-gray-600">Generate and email reports automatically each month</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified when new reports are available</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Include Alternative Data</h4>
                    <p className="text-sm text-gray-600">Add alternative data insights to reports</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
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