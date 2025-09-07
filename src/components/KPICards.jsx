import React from 'react';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

const KPICards = ({ kpis }) => {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Total Sales',
      value: `$${kpis.totalSales?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Active Customers',
      value: kpis.activeCustomers?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+3.2%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Daily Revenue',
      value: `$${kpis.dailyRevenue?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8.1%',
      changeColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {card.value}
                </p>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${card.changeColor}`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;