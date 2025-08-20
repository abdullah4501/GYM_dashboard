import React from 'react';
import { Users, Video, BookOpen, Award, TrendingUp, DollarSign } from 'lucide-react';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Members"
          value="1,247"
          change="+12%"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Total Videos"
          value="89"
          change="+5%"
          icon={Video}
          trend="up"
        />
        <StatsCard
          title="E-Books Published"
          value="24"
          change="+3%"
          icon={BookOpen}
          trend="up"
        />
        <StatsCard
          title="Certificates Issued"
          value="156"
          change="+8%"
          icon={Award}
          trend="up"
        />
      </div>

      {/* Charts and Recent Activity */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard />
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New member joined', user: 'John Smith', time: '2 hours ago', type: 'member' },
              { action: 'Video uploaded', user: 'Admin', time: '4 hours ago', type: 'video' },
              { action: 'E-book published', user: 'Admin', time: '1 day ago', type: 'ebook' },
              { action: 'Certificate generated', user: 'Sarah Johnson', time: '2 days ago', type: 'certificate' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'member' ? 'bg-blue-500' :
                  activity.type === 'video' ? 'bg-red-500' :
                  activity.type === 'ebook' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {activity.type === 'member' && <Users className="w-4 h-4 text-white" />}
                  {activity.type === 'video' && <Video className="w-4 h-4 text-white" />}
                  {activity.type === 'ebook' && <BookOpen className="w-4 h-4 text-white" />}
                  {activity.type === 'certificate' && <Award className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Revenue Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Monthly Revenue</h3>
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">€24,580</div>
          <div className="flex items-center text-green-500 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +18% from last month
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Plan Conversions</h3>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">87.3%</div>
          <div className="flex items-center text-blue-500 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5.2% conversion rate
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;