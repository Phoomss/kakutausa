import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const StatsCard = ({ title, value, change, trend, color, icon }) => {
  const Icon = icon || BarChart3;
  const getCardColor = (color) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'yellow': return 'from-yellow-500 to-yellow-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 p-6 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">{title}</h3>
          <span className="text-3xl font-black text-slate-800 tracking-tight">{value}</span>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCardColor(color)} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {(change && change !== '+0%') && (
        <div className="flex items-center mt-4 pt-4 border-t border-slate-50">
          <div className={`flex items-center text-sm font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-650'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
          </div>
          <span className="text-xs text-slate-400 ml-2">since last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;