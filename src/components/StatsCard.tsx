import React from 'react';
import { TrendingUp, TrendingDown, DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, trend }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-full">
          <Icon className="w-6 h-6 text-red-500" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-gray-400 text-sm ml-1">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;