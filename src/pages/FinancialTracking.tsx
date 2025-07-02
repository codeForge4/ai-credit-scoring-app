import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Download,
  Filter,
  Plus,
  Wallet,
  CreditCard,
  Building,
  Smartphone,
  Lightbulb,
  Target,
  AlertCircle
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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
import { format, subMonths, startOfMonth } from 'date-fns';

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

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  source: 'banking' | 'utility' | 'telecom' | 'ecommerce';
  creditImpact: number;
}

interface FinancialGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

export default function FinancialTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  useEffect(() => {
    // Generate mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date().toISOString(),
        description: 'Salary Deposit',
        amount: 5500,
        category: 'Income',
        type: 'income',
        source: 'banking',
        creditImpact: 2
      },
      {
        id: '2',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Electric Bill',
        amount: -120,
        category: 'Utilities',
        type: 'expense',
        source: 'utility',
        creditImpact: 1
      },
      {
        id: '3',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Credit Card Payment',
        amount: -450,
        category: 'Credit Cards',
        type: 'expense',
        source: 'banking',
        creditImpact: 8
      },
      {
        id: '4',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Mobile Phone Bill',
        amount: -85,
        category: 'Telecom',
        type: 'expense',
        source: 'telecom',
        creditImpact: 1
      },
      {
        id: '5',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Online Shopping',
        amount: -230,
        category: 'Shopping',
        type: 'expense',
        source: 'ecommerce',
        creditImpact: 0
      }
    ];

    const mockGoals: FinancialGoal[] = [
      {
        id: '1',
        title: 'Emergency Fund',
        target: 10000,
        current: 6500,
        deadline: '2024-12-31',
        category: 'Savings'
      },
      {
        id: '2',
        title: 'Credit Utilization Under 10%',
        target: 10,
        current: 23,
        deadline: '2024-06-30',
        category: 'Credit'
      },
      {
        id: '3',
        title: 'Investment Portfolio',
        target: 25000,
        current: 8750,
        deadline: '2025-01-31',
        category: 'Investment'
      }
    ];

    setTransactions(mockTransactions);
    setGoals(mockGoals);
  }, []);

  const spendingData = {
    labels: ['Housing', 'Transportation', 'Food', 'Utilities', 'Entertainment', 'Other'],
    datasets: [
      {
        data: [1200, 400, 600, 200, 300, 250],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#6b7280'
        ],
        borderWidth: 0
      }
    ]
  };

  const incomeVsExpensesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [5500, 5500, 5800, 5500, 5700, 5500],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: [4200, 3800, 4500, 4100, 4300, 3950],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const creditImpactData = {
    labels: ['Banking', 'Utilities', 'Telecom', 'E-commerce'],
    datasets: [
      {
        label: 'Credit Impact Score',
        data: [85, 72, 65, 45],
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'banking': return Building;
      case 'utility': return Lightbulb;
      case 'telecom': return Smartphone;
      case 'ecommerce': return Wallet;
      default: return DollarSign;
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netWorth = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your finances and credit impact in real-time</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowAddTransaction(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'Total Income',
            value: `$${totalIncome.toLocaleString()}`,
            change: '+$500',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'bg-green-500'
          },
          {
            name: 'Total Expenses',
            value: `$${totalExpenses.toLocaleString()}`,
            change: '-$200',
            changeType: 'positive',
            icon: TrendingDown,
            color: 'bg-red-500'
          },
          {
            name: 'Net Worth',
            value: `$${netWorth.toLocaleString()}`,
            change: '+$700',
            changeType: 'positive',
            icon: Wallet,
            color: 'bg-blue-500'
          },
          {
            name: 'Credit Impact',
            value: '+12 pts',
            change: 'This month',
            changeType: 'positive',
            icon: Target,
            color: 'bg-purple-500'
          }
        ].map((stat, index) => (
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
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="3months">Last 3 months</option>
              <option value="6months">Last 6 months</option>
              <option value="12months">Last 12 months</option>
            </select>
          </div>
          <div className="h-64">
            <Line data={incomeVsExpensesData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Breakdown</h3>
          <div className="h-64">
            <Doughnut data={spendingData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => {
              const SourceIcon = getSourceIcon(transaction.source);
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <SourceIcon className={`w-5 h-5 ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    {transaction.creditImpact > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                        +{transaction.creditImpact} credit pts
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternative Data Impact */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Data Impact</h3>
          <p className="text-sm text-gray-600 mb-6">
            How different data sources contribute to your credit profile
          </p>
          <div className="h-48 mb-4">
            <Bar data={creditImpactData} options={{
              ...chartOptions,
              plugins: { legend: { display: false } }
            }} />
          </div>
          <div className="space-y-3">
            {[
              { source: 'Banking', score: 85, color: 'bg-green-500' },
              { source: 'Utilities', score: 72, color: 'bg-blue-500' },
              { source: 'Telecom', score: 65, color: 'bg-purple-500' },
              { source: 'E-commerce', score: 45, color: 'bg-yellow-500' }
            ].map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.source}</span>
                </div>
                <span className="text-sm font-medium">{item.score}/100</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Financial Goals</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = goal.category === 'Credit' 
              ? Math.max(0, (goal.target - goal.current) / goal.target * 100)
              : (goal.current / goal.target) * 100;
            const isOnTrack = progress >= 50;
            
            return (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{goal.title}</h4>
                  {isOnTrack ? (
                    <Target className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${isOnTrack ? 'bg-green-500' : 'bg-yellow-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, progress)}%` }}
                      transition={{ delay: 0.3, duration: 1 }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Current: {goal.category === 'Credit' ? `${goal.current}%` : `$${goal.current.toLocaleString()}`}</p>
                  <p>Target: {goal.category === 'Credit' ? `${goal.target}%` : `$${goal.target.toLocaleString()}`}</p>
                  <p>Deadline: {format(new Date(goal.deadline), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Insights & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Spending Pattern Alert',
              description: 'Your utility payments have consistently improved your credit profile by 3-5 points monthly.',
              type: 'positive',
              action: 'Continue regular payments'
            },
            {
              title: 'Optimization Opportunity',
              description: 'Increasing your emergency fund by $500/month could improve your financial stability score.',
              type: 'opportunity',
              action: 'Set up auto-transfer'
            },
            {
              title: 'Credit Utilization Warning',
              description: 'Your credit utilization increased to 23%. Consider paying down balances to stay under 10%.',
              type: 'warning',
              action: 'Make extra payment'
            },
            {
              title: 'Alternative Data Boost',
              description: 'Your consistent telecom payments could add 8-12 points to alternative credit models.',
              type: 'info',
              action: 'Enable data sharing'
            }
          ].map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              insight.type === 'positive' ? 'border-green-200 bg-green-50' :
              insight.type === 'opportunity' ? 'border-blue-200 bg-blue-50' :
              insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-purple-200 bg-purple-50'
            }`}>
              <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
              <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
              <button className={`text-sm font-medium px-3 py-1 rounded-full ${
                insight.type === 'positive' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                insight.type === 'opportunity' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                insight.type === 'warning' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                'bg-purple-100 text-purple-700 hover:bg-purple-200'
              } transition-colors`}>
                {insight.action}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}