import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Eye,
  BookOpen
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AIExplanation {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
  recommendation: string;
  confidence: number;
}

interface PredictionResult {
  likelihood: number;
  loanType: string;
  factors: string[];
  recommendation: string;
}

export default function CreditAnalysis() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'explanation' | 'prediction' | 'trends'>('explanation');
  const [aiExplanations, setAIExplanations] = useState<AIExplanation[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate AI analysis
    const mockExplanations: AIExplanation[] = [
      {
        factor: 'Payment History',
        impact: 'positive',
        weight: 35,
        description: 'You have maintained 100% on-time payments for the past 12 months. This is the most important factor in your credit score.',
        recommendation: 'Continue making all payments on time to maintain this excellent record.',
        confidence: 98
      },
      {
        factor: 'Credit Utilization',
        impact: 'neutral',
        weight: 30,
        description: 'Your current utilization is 23%, which is acceptable but could be improved. Optimal range is below 10% for excellent scores.',
        recommendation: 'Consider paying down balances or requesting credit limit increases to lower utilization to below 10%.',
        confidence: 92
      },
      {
        factor: 'Length of Credit History',
        impact: 'positive',
        weight: 15,
        description: 'Your average account age of 7.2 years demonstrates established credit management experience.',
        recommendation: 'Keep older accounts open to maintain your credit history length.',
        confidence: 95
      },
      {
        factor: 'Credit Mix',
        impact: 'positive',
        weight: 10,
        description: 'You have a healthy mix of credit types including revolving credit and installment loans.',
        recommendation: 'Your credit mix is optimal. No changes needed.',
        confidence: 88
      },
      {
        factor: 'New Credit Inquiries',
        impact: 'negative',
        weight: 10,
        description: 'Recent hard inquiry from 2 weeks ago temporarily reduced your score by 3-5 points.',
        recommendation: 'Avoid new credit applications for the next 3-6 months to minimize impact.',
        confidence: 90
      }
    ];

    const mockPredictions: PredictionResult[] = [
      {
        likelihood: 92,
        loanType: 'Personal Loan ($25K)',
        factors: ['Excellent payment history', 'Stable income', 'Low debt-to-income ratio'],
        recommendation: 'Very likely to be approved with competitive rates'
      },
      {
        likelihood: 85,
        loanType: 'Auto Loan ($40K)',
        factors: ['Good credit score', 'Established credit history', 'Moderate utilization'],
        recommendation: 'Likely approved with good rates'
      },
      {
        likelihood: 68,
        loanType: 'Mortgage ($350K)',
        factors: ['Score meets requirements', 'Utilization could be lower', 'Recent inquiry'],
        recommendation: 'Possible approval, consider improving utilization first'
      }
    ];

    setAIExplanations(mockExplanations);
    setPredictions(mockPredictions);
  }, []);

  const runAIAnalysis = async () => {
    setLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    // Add slight randomization to demonstrate "new analysis"
    const updatedExplanations = aiExplanations.map(exp => ({
      ...exp,
      confidence: Math.max(85, Math.min(99, exp.confidence + (Math.random() - 0.5) * 6))
    }));
    setAIExplanations(updatedExplanations);
  };

  const utilizationData = {
    labels: ['Used Credit', 'Available Credit'],
    datasets: [
      {
        data: [23, 77],
        backgroundColor: ['#ef4444', '#10b981'],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  };

  const factorWeightData = {
    labels: aiExplanations.map(e => e.factor),
    datasets: [
      {
        label: 'Impact Weight (%)',
        data: aiExplanations.map(e => e.weight),
        backgroundColor: aiExplanations.map(e => 
          e.impact === 'positive' ? '#10b981' : 
          e.impact === 'negative' ? '#ef4444' : '#6b7280'
        ),
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgb(107, 114, 128)' }
      },
      y: {
        grid: { color: 'rgba(107, 114, 128, 0.1)' },
        ticks: { color: 'rgb(107, 114, 128)' }
      }
    }
  };

  const tabs = [
    { id: 'explanation', name: 'AI Explanation', icon: Brain },
    { id: 'prediction', name: 'Approval Predictions', icon: Target },
    { id: 'trends', name: 'Trends & Insights', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered insights into your credit profile and approval chances</p>
        </div>
        <button
          onClick={runAIAnalysis}
          disabled={loading}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </button>
      </div>

      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{user?.creditScore}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Excellent Credit</h3>
              <p className="text-gray-600">Your score is in the top 25% of consumers</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-gray-600">AI Confidence</div>
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
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
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
        {selectedTab === 'explanation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Explanations */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Explanations</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  SHAP Analysis
                </span>
              </div>
              
              {aiExplanations.map((explanation, index) => (
                <motion.div
                  key={explanation.factor}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        explanation.impact === 'positive' ? 'bg-green-500' :
                        explanation.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <h4 className="font-semibold text-gray-900">{explanation.factor}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">{explanation.weight}% weight</div>
                      <div className="text-xs text-gray-500">{explanation.confidence}% confidence</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{explanation.description}</p>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">AI Recommendation</p>
                        <p className="text-sm text-blue-800">{explanation.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visualizations */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Credit Utilization</h4>
                <div className="h-40 relative">
                  <Doughnut data={utilizationData} options={{ maintainAspectRatio: false }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">23%</div>
                      <div className="text-sm text-gray-600">Used</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used Credit</span>
                    <span className="font-medium">$11,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Credit</span>
                    <span className="font-medium">$38,500</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Factor Impact</h4>
                <div className="h-64">
                  <Bar data={factorWeightData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'prediction' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Loan Approval Predictions</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                ML Powered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.loanType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{prediction.loanType}</h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.likelihood >= 80 ? 'bg-green-100 text-green-700' :
                      prediction.likelihood >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {prediction.likelihood}%
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Approval Likelihood</span>
                      <span className="font-medium">{prediction.likelihood}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          prediction.likelihood >= 80 ? 'bg-green-500' :
                          prediction.likelihood >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.likelihood}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Factors:</p>
                    <ul className="space-y-1">
                      {prediction.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{prediction.recommendation}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How We Calculate Predictions</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Our AI model analyzes over 200 data points including your credit profile, 
                    alternative data sources, and current market conditions to predict approval likelihood.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Traditional credit factors (score, history, utilization)</li>
                    <li>• Alternative data (utility payments, banking behavior)</li>
                    <li>• Market conditions and lender requirements</li>
                    <li>• Real-time risk assessment algorithms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'trends' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Trends & Market Insights</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Industry Benchmarks</h4>
                <div className="space-y-4">
                  {[
                    { metric: 'Average Credit Score', yourValue: 742, industry: 714, unit: '' },
                    { metric: 'Credit Utilization', yourValue: 23, industry: 28, unit: '%' },
                    { metric: 'Payment History', yourValue: 100, industry: 89, unit: '%' },
                    { metric: 'Credit Accounts', yourValue: 8, industry: 6, unit: '' }
                  ].map((item, index) => (
                    <div key={item.metric} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.metric}</span>
                        <div className="space-x-4">
                          <span className="font-medium">You: {item.yourValue}{item.unit}</span>
                          <span className="text-gray-500">Avg: {item.industry}{item.unit}</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(item.yourValue / Math.max(item.yourValue, item.industry)) * 100}%` }}
                          />
                        </div>
                        <div
                          className="absolute top-0 w-1 h-2 bg-gray-400 rounded-full"
                          style={{ left: `${(item.industry / Math.max(item.yourValue, item.industry)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Market Trends</h4>
                <div className="space-y-4">
                  {[
                    {
                      trend: 'Interest Rates',
                      direction: 'up',
                      change: '+0.5%',
                      impact: 'Higher borrowing costs expected'
                    },
                    {
                      trend: 'Approval Rates',
                      direction: 'down',
                      change: '-3%',
                      impact: 'Lenders becoming more selective'
                    },
                    {
                      trend: 'Credit Utilization',
                      direction: 'down',
                      change: '-2%',
                      impact: 'Consumers paying down debt'
                    }
                  ].map((trend, index) => (
                    <div key={trend.trend} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {trend.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-500 transform rotate-180" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{trend.trend}</div>
                          <div className="text-xs text-gray-600">{trend.impact}</div>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        trend.direction === 'up' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {trend.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">Personalized Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Optimal Credit Mix',
                    description: 'Your current mix of credit types is well-balanced',
                    status: 'good',
                    icon: CheckCircle
                  },
                  {
                    title: 'Utilization Opportunity',
                    description: 'Reducing utilization to 10% could boost score by 15 points',
                    status: 'opportunity',
                    icon: TrendingUp
                  },
                  {
                    title: 'Hard Inquiry Impact',
                    description: 'Recent inquiry will have minimal impact after 6 months',
                    status: 'caution',
                    icon: AlertTriangle
                  }
                ].map((insight, index) => (
                  <div key={insight.title} className={`p-4 rounded-lg border-2 ${
                    insight.status === 'good' ? 'border-green-200 bg-green-50' :
                    insight.status === 'opportunity' ? 'border-blue-200 bg-blue-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <insight.icon className={`w-5 h-5 mt-0.5 ${
                        insight.status === 'good' ? 'text-green-600' :
                        insight.status === 'opportunity' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">{insight.title}</h5>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}