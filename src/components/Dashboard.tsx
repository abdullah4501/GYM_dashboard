import React, { useEffect, useState } from 'react';
import { Users, Video, BookOpen, User as UserIcon, Mail, Calendar, CreditCard, Menu} from 'lucide-react';
import StatsCard from './StatsCard';

type Stats = {
  activeMembers: number;
  totalVideos: number;
  ebooksPublished: number;
  ebookBuyers: number;
};
interface DashboardProps {
  setSidebarOpen?: (open: boolean) => void;
}
type Member = {
  _id: string;
  user: { firstName: string; lastName: string; email: string };
  createdAt: string;
};

type Purchase = {
  _id: string;
  user: { firstName: string; lastName: string; email: string };
  itemType: string;
  itemName: string;
  amount: number;
  date: string;
  stripePaymentId: string;
};

const Dashboard: React.FC<DashboardProps> = ({ setSidebarOpen }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Purchase[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Fetch stats only once on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboard-data/dashboard-stats`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  // Polling for recent members
  useEffect(() => {
    const fetchRecentMembers = () => {
      fetch(`${import.meta.env.VITE_API_URL}/members/recent`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setRecentMembers(data.recentMembers || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchRecentMembers(); // Initial fetch
    const interval = setInterval(fetchRecentMembers, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchRecentTransactions = () => {
      fetch(`${import.meta.env.VITE_API_URL}/purchases/recent`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setRecentTransactions(data.purchases || []))
        .catch(console.error)
        .finally(() => setTransactionsLoading(false));
    };

    fetchRecentTransactions(); // Initial fetch
    const interval = setInterval(fetchRecentTransactions, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className='mb-8 flex items-center gap-8'>
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setSidebarOpen?.(true)}
          aria-label="Open sidebar"
          type="button"
        >
          <Menu className="w-7 h-7 text-white" />
        </button>
        <div className="">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back to your admin panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Members"
          value={stats ? stats.activeMembers.toLocaleString() : '--'}
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Total Videos"
          value={stats ? stats.totalVideos.toLocaleString() : '--'}
          icon={Video}
          trend="up"
        />
        <StatsCard
          title="E-Books Published"
          value={stats ? stats.ebooksPublished.toLocaleString() : '--'}
          icon={BookOpen}
          trend="up"
        />
        <StatsCard
          title="E-Book Buyers"
          value={stats ? stats.ebookBuyers.toLocaleString() : '--'}
          icon={BookOpen}
          trend="up"
        />
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Recent Subscribers Widget */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <UserIcon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Recent Subscribers</h3>
            </div>
            <div className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              {recentMembers.length} total
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {recentMembers.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No recent subscribers</p>
                </div>
              ) : (
                recentMembers.map((member) => (
                  <div
                    key={member._id}
                    className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="font-medium text-white text-base">
                            {[member.user.firstName, member.user.lastName].filter(Boolean).join(' ') || 'No Name'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-10">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm truncate">
                            {member.user?.email || "No Email"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap ml-10 sm:ml-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(member.createdAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Recent Transactions Widget */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
            </div>
            <div className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              {recentTransactions.length} total
            </div>
          </div>

          {transactionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions found</p>
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Amount and Item */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="text-green-400 font-bold text-xl">
                            €{tx.amount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 px-3 py-1 rounded-full">
                            <CreditCard className="w-3 h-3" />
                            <span className="font-medium">{tx.itemType.charAt(0).toUpperCase() + tx.itemType.slice(1)}</span>
                          </div>
                        </div>
                        <div className="text-gray-300 font-medium text-sm bg-gray-800 px-3 py-1 rounded-full truncate">
                          {tx.itemName}
                        </div>
                      </div>

                      {/* User Info and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <UserIcon className="w-3 h-3 text-blue-400" />
                            </div>
                            <span className="text-gray-200 text-sm font-medium">
                              {[tx.user.firstName, tx.user.lastName].filter(Boolean).join(' ') || 'Unknown User'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-8 xs:ml-0">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400 text-xs truncate">
                              {tx.user?.email || "No Email"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap ml-8 sm:ml-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.date).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>



    </div>
  );
};

export default Dashboard;
