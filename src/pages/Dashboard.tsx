import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  AlertTriangle,
  Target,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  CheckCircle
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CreditInsight {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: number;
  timestamp: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [insights, setInsights] = useState<CreditInsight[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Simulate loading insights and achievements
    const mockInsights: CreditInsight[] = [
      {
        id: '1',
        type: 'positive',
        title: 'Credit Utilization Improved',
        description: 'Your credit card utilization decreased by 8% this month',
        impact: 12,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'negative',
        title: 'New Credit Inquiry',
        description: 'A hard inquiry was made on your credit report',
        impact: -5,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'positive',
        title: 'On-Time Payment Streak',
        description: 'You have maintained 12 months of on-time payments',
        impact: 8,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Credit Builder',
        description: 'Maintain good credit for 6 months',
        icon: '🏗️',
        unlocked: true,
        progress: 100
      },
      {
        id: '2',
        title: 'Payment Master',
        description: 'Make 12 consecutive on-time payments',
        icon: '💎',
        unlocked: true,
        progress: 100
      },
      {
        id: '3',
        title: 'Utilization Pro',
        description: 'Keep credit utilization below 30%',
        icon: '🎯',
        unlocked: false,
        progress: 75
      }
    ];

    setInsights(mockInsights);
    setAchievements(mockAchievements);

    // Show welcome notification
    setTimeout(() => {
      addNotification({
        type: 'info',
        title: 'Credit Score Updated',
        message: 'Your credit score has been refreshed with the latest data.',
        duration: 4000
      });
    }, 1000);
  }, [addNotification]);

  const creditScoreData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Credit Score',
        data: [680, 695, 710, 725, 735, 742],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        }
      },
      y: {
        min: 600,
        max: 800,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: 'rgb(107, 114, 128)'
        }
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 740) return 'text-green-600';
    if (score >= 670) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 740) return 'Excellent';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const stats = [
    {
      name: 'Credit Score',
      value: user?.creditScore || 742,
      change: '+12',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      name: 'Credit Utilization',
      value: '23%',
      change: '-8%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'bg-blue-500'
    },
    {
      name: 'Available Credit',
      value: '$45,200',
      change: '+$2,500',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      name: 'Payment History',
      value: '100%',
      change: '12 months',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's your financial overview.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
            Refresh Score
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">this month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Score Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Credit Score Trend</h2>
              <p className="text-sm text-gray-600">Your credit score over the last 6 months</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(user?.creditScore || 742)}`}>
                {user?.creditScore || 742}
              </div>
              <div className="text-sm text-gray-600">{getScoreStatus(user?.creditScore || 742)}</div>
            </div>
          </div>
          <div className="h-64">
            <Line data={creditScoreData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Credit Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Factors</h3>
          <div className="space-y-4">
            {[
              { name: 'Payment History', value: 95, color: 'bg-green-500' },
              { name: 'Credit Utilization', value: 78, color: 'bg-yellow-500' },
              { name: 'Credit History', value: 85, color: 'bg-blue-500' },
              { name: 'Credit Mix', value: 70, color: 'bg-purple-500' },
              { name: 'New Credit', value: 82, color: 'bg-indigo-500' }
            ].map((factor) => (
              <div key={factor.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{factor.name}</span>
                  <span className="font-medium">{factor.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${factor.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.value}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Insights</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  insight.type === 'positive' ? 'bg-green-500' : 
                  insight.type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                    <span className={`text-xs font-medium ${
                      insight.impact > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {insight.impact > 0 ? '+' : ''}{insight.impact} pts
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(insight.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'border-yellow-200 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className={`text-sm font-medium ${
                        achievement.unlocked ? 'text-yellow-800' : 'text-gray-700'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                {!achievement.unlocked && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ delay: 0.3, duration: 1 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Pay Down Credit Cards',
              description: 'Reduce utilization by $1,200 to boost score',
              impact: '+15 points',
              urgency: 'high'
            },
            {
              title: 'Set Up Auto-Pay',
              description: 'Never miss a payment again',
              impact: '+8 points',
              urgency: 'medium'
            },
            {
              title: 'Request Credit Increase',
              description: 'Lower utilization ratio automatically',
              impact: '+12 points',
              urgency: 'low'
            }
          ].map((action, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  action.urgency === 'high' ? 'bg-red-100 text-red-700' :
                  action.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {action.urgency}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">{action.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-green-600">{action.impact}</span>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}