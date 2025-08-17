import React, { useState, useEffect } from 'react';
import { Search, Calendar, CreditCard, DollarSign, User } from 'lucide-react';
import axios from 'axios';

interface Purchase {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null; // User may be null (if user deleted)
  itemType: string;
  itemName: string;
  amount: number;
  date: string;
  stripePaymentId: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const PurchasesManagement: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterItemType, setFilterItemType] = useState('');
  const adminToken = localStorage.getItem('adminToken');

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(`${API_URL}/purchases`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        setPurchases(res.data.purchases || []);
      } catch (err) {
        setPurchases([]);
      }
    };
    fetchPurchases();
    // eslint-disable-next-line
  }, []);

  // Unique item types for filter (ignore purchases with missing type)
  const itemTypes = Array.from(new Set(purchases.map(p => p.itemType))).filter(Boolean);

  // Filtering logic (defensive for missing user)
  const filteredPurchases = purchases.filter(purchase => {
    const userFullName = purchase.user
      ? `${purchase.user.firstName} ${purchase.user.lastName}`.toLowerCase()
      : '';
    const userEmail = purchase.user?.email?.toLowerCase() || '';
    const matchesSearch =
      userFullName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase()) ||
      purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.stripePaymentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterItemType || purchase.itemType === filterItemType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions Management</h1>
          <p className="text-gray-400">View and track all user purchases</p>
        </div>
      </div>
      {/* Search & Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by user, email, item or transaction ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
          <select
            value={filterItemType}
            onChange={e => setFilterItemType(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
          >
            <option value="">All Item Types</option>
            {itemTypes.map(type => (
              <option value={type} key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">
                  <User className="inline w-5 h-5 mr-2" />User
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">
                  Amount (€)
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">
                  <Calendar className="inline w-5 h-5 mr-2" />Date
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPurchases
                .slice() // to avoid mutating original
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(purchase => (
                
                <tr key={purchase._id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                    {purchase.user
                      ? `${purchase.user.firstName} ${purchase.user.lastName}`
                      : <span className="text-gray-400 italic">Deleted User</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {purchase.user ? purchase.user.email : <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {purchase.itemName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize">
                    {purchase.itemType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-semibold">
                    €{purchase.amount?.toFixed(2) ?? '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {purchase.date ? new Date(purchase.date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-mono">
                    {purchase.stripePaymentId || '—'}
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No transactionsfound.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasesManagement;
