import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import KPICards from './KPICards';
import SalesChart from './SalesChart';
import TransactionsTable from './TransactionsTable';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = ({ user, onLogout, backendUrl }) => {
  const [kpis, setKpis] = useState(null);
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kpisRes, salesRes, transactionsRes] = await Promise.all([
          axios.get(`${backendUrl}/kpis`).catch(() => ({ data: getMockKPIs() })),
          axios.get(`${backendUrl}/sales`).catch(() => ({ data: getMockSales() })),
          axios.get(`${backendUrl}/transactions`).catch(() => ({ data: getMockTransactions() }))
        ]);
        
        setKpis(kpisRes.data);
        setSales(salesRes.data);
        setTransactions(transactionsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={onLogout} className="btn-primary">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.username}! Here's your business overview.
          </p>
        </div>

        <div className="space-y-6">
          <KPICards kpis={kpis} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SalesChart sales={sales} />
            </div>
            <div className="lg:col-span-1">
              <div className="card h-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-green-600">2.4%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Avg. Order Value</span>
                    <span className="font-semibold">$156</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Customer Retention</span>
                    <span className="font-semibold text-blue-600">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TransactionsTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

// Mock data functions
const getMockKPIs = () => ({
  totalSales: 125000,
  activeCustomers: 1247,
  dailyRevenue: 5430
});

const getMockSales = () => [
  { date: '2024-01-01', sales: 12000 },
  { date: '2024-01-02', sales: 15000 },
  { date: '2024-01-03', sales: 13500 },
  { date: '2024-01-04', sales: 18000 },
  { date: '2024-01-05', sales: 16500 },
  { date: '2024-01-06', sales: 21000 },
  { date: '2024-01-07', sales: 19500 }
];

const getMockTransactions = () => [
  { id: 1, customer: 'John Doe', amount: 299, date: '2024-01-07' },
  { id: 2, customer: 'Jane Smith', amount: 156, date: '2024-01-07' },
  { id: 3, customer: 'Bob Johnson', amount: 89, date: '2024-01-06' },
  { id: 4, customer: 'Alice Brown', amount: 432, date: '2024-01-06' },
  { id: 5, customer: 'Charlie Wilson', amount: 178, date: '2024-01-05' }
];

export default Dashboard;