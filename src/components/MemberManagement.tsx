import React, { useState, useEffect } from 'react';
import { Users, Search, MoreHorizontal, Mail, Calendar } from 'lucide-react';
import axios from 'axios';

interface MemberData {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'inactive';
  memberSince: string | null;
  lastActivity: string;
  stripeCustomerId?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [plans, setPlans] = useState<{ priceId: string, name: string }[]>([]);


  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    // Fetch available Stripe plans for filter dropdown
    axios.get(`${API_URL}/coachingplans/stripe`)
      .then(res => setPlans(res.data.plans || []))
      .catch(() => setPlans([]));
  }, []);


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setMembers(res.data.users || []);
      } catch (err) {
        setMembers([]);
      }
    };
    fetchMembers();
    // eslint-disable-next-line
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = !filterPlan || (member.plan && member.plan.includes(filterPlan));
    const matchesStatus = !filterStatus || member.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Member Management</h1>
          <p className="text-gray-400">Manage and track your gym members</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
          <select
            value={filterPlan}
            onChange={e => setFilterPlan(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
          >
            <option value="">All Plans</option>
            {plans.map(plan => (
              <option key={plan.priceId} value={plan.name}>{plan.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{member.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    <Mail className="inline w-4 h-4 mr-2" />
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {member.plan || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {member.memberSince ? new Date(member.memberSince).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {member.lastActivity ? new Date(member.lastActivity).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
