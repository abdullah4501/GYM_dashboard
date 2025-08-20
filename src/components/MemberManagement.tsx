import React, { useState, useEffect } from 'react';
import { Search, Mail } from 'lucide-react';
import axios from 'axios';
import ConfirmModal from './ConfirmModal'; // import path as per your structure

interface MemberData {
  id: string;
  name: string;
  email: string;
  plan: string;
  memberSince: string | null;
  lastActivity: string;
  membership?: {
    _id: string;
    paymentStatus: string;
    startDate?: string;
    endDate?: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL;

const statusOptions = [
  { label: "Active", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Inactive", value: "inactive" }, // this triggers delete
];

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [plans, setPlans] = useState<{ priceId: string, name: string }[]>([]);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; membershipId: string | null }>({ open: false, membershipId: null });

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
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
  }, [adminToken]);

  function getDisplayStatus(member: MemberData): string {
    if (!member.membership || !member.membership.paymentStatus) return "Inactive";
    const status = member.membership.paymentStatus.toLowerCase();
    if (status === "paid") return "Active";
    if (status === "pending") return "Pending";
    if (status === "failed") return "Failed";
    if (status === "cancelled") return "Cancelled";
    return "Inactive";
  }

  function getStatusColorClass(status: string) {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-400 text-gray-800';
    }
  }
  const priceIdToName: { [priceId: string]: string } = {};
  plans.forEach(plan => { priceIdToName[plan.priceId] = plan.name; });

  const filteredMembers = members.filter(member => {
    const displayStatus = getDisplayStatus(member);
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = !filterPlan || (member.plan && member.plan.includes(filterPlan));
    const matchesStatus = !filterStatus || displayStatus === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // --- Handle Status Change ---

  const handleEdit = (memberId: string, currentStatus: string) => {
    setEditMemberId(memberId);
    setEditStatus(currentStatus);
  };

  const handleSave = async (member: MemberData) => {
    if (!member.membership?._id) return;
    if (editStatus === "inactive") {
      // Show confirmation modal
      setConfirmModal({ open: true, membershipId: member.membership._id });
    } else {
      // Just update membership status
      await updateMemberStatus(member.membership._id, editStatus);
    }
    setEditMemberId(null);
    setEditStatus("");
  };

  const updateMemberStatus = async (membershipId: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/members/${membershipId}`, { paymentStatus: status }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      // Refetch
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setMembers(res.data.users || []);
    } catch (err) {
      alert("Failed to update member status.");
    }
  };

  // --- Confirm Delete for Inactive ---
  const handleConfirmInactive = async () => {
    if (!confirmModal.membershipId) return;
    try {
      await axios.patch(`${API_URL}/members/${confirmModal.membershipId}`, { paymentStatus: "inactive" }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      // Refetch
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setMembers(res.data.users || []);
      setConfirmModal({ open: false, membershipId: null });
    } catch (err) {
      alert("Failed to make inactive.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Member Management</h1>
          <p className="text-gray-400">Manage and track your gym members</p>
        </div>
      </div>
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
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredMembers.map((member) => {
                const status = getDisplayStatus(member);
                const isInactive = !member.membership;
                return (
                  <tr key={member.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <Mail className="inline w-4 h-4 mr-2" />
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {priceIdToName[member.plan] || member.plan || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColorClass(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {member.memberSince ? new Date(member.memberSince).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {member.lastActivity ? new Date(member.lastActivity).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {isInactive ? (
                        <select disabled className="bg-gray-500 text-white rounded-lg px-2 py-1">
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : editMemberId === member.id ? (
                        <>
                          <select
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value)}
                            className="bg-gray-700 text-white rounded-lg px-2 py-1"
                          >
                            {statusOptions.map(opt => (
                              <option value={opt.value} key={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSave(member)}
                            className="bg-green-700 text-white px-2 rounded hover:bg-green-800"
                          >
                            Save
                          </button>
                          <button onClick={() => { setEditMemberId(null); setEditStatus(""); }} className="bg-gray-700 text-white px-2 rounded hover:bg-gray-800">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(member.id, member.membership?.paymentStatus || "inactive")}
                            className="bg-[#ED2C2C] text-white px-2 rounded hover:bg-[#000] mx-auto w-full py-1"
                            disabled={isInactive}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Confirm Inactive Modal */}
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, membershipId: null })}
        onConfirm={handleConfirmInactive}
        title="Set Member as Inactive"
        description="Are you sure you want to make this member inactive? This action cannot be undone and the user will lose their membership."
      />
    </div>
  );
};

export default MemberManagement;
