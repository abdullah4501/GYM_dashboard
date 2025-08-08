import React from 'react';

const ChartCard: React.FC = () => {
  const data = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1500 },
    { month: 'Mar', value: 1100 },
    { month: 'Apr', value: 1800 },
    { month: 'May', value: 2100 },
    { month: 'Jun', value: 2400 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Member Growth</h3>
      <div className="flex items-end space-x-4 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex-1 flex items-end">
              <div 
                className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all duration-300 hover:from-red-400 hover:to-red-300"
                style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '20px' }}
              />
            </div>
            <div className="mt-2 text-gray-400 text-sm">{item.month}</div>
            <div className="text-white text-xs font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartCard;