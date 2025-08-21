import React, { useEffect, useState } from 'react';
import { Users, Video, BookOpen, Award, TrendingUp, DollarSign } from 'lucide-react';
import StatsCard from './StatsCard';
// import ChartCard from './ChartCard'; // Uncomment if you use this

type Stats = {
  activeMembers: number;
  totalVideos: number;
  ebooksPublished: number;
  ebookBuyers: number;
};

type RevenueStats = {
  monthlyRevenue: number;
  revenueChange: number;   // in percent, e.g. 18
  conversions: number;     // as percent, e.g. 87.3
  conversionsChange: number; // percent change, e.g. 5.2
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard totals
    fetch(`${import.meta.env.VITE_API_URL}/dashboard-data/dashboard-stats`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);

    // Fetch revenue/conversion stats
    fetch(`${import.meta.env.VITE_API_URL}/dashboard-data/revenue-summary`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setRevenue)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          value={stats ? stats.activeMembers.toLocaleString() : '--'}
          change={stats ? "+12%" : ""}
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Total Videos"
          value={stats ? stats.totalVideos.toLocaleString() : '--'}
          change={stats ? "+5%" : ""}
          icon={Video}
          trend="up"
        />
        <StatsCard
          title="E-Books Published"
          value={stats ? stats.ebooksPublished.toLocaleString() : '--'}
          change={stats ? "+3%" : ""}
          icon={BookOpen}
          trend="up"
        />
        <StatsCard
          title="E-Book Buyers"
          value={stats ? stats.ebookBuyers.toLocaleString() : '--'}
          change={stats ? "+8%" : ""}
          icon={BookOpen}
          trend="up"
        />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Monthly Revenue</h3>
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            €{revenue ? revenue.monthlyRevenue.toLocaleString() : '--'}
          </div>
          <div className="flex items-center text-green-500 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            {revenue ? `+${revenue.revenueChange}% from last month` : ''}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Plan Conversions</h3>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {revenue ? `${revenue.conversions}%` : '--'}
          </div>
          <div className="flex items-center text-blue-500 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            {revenue ? `+${revenue.conversionsChange}% conversion rate` : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
