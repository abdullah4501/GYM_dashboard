import React, { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Download, User, Calendar, FileImage } from "lucide-react";
import axios from "axios";

interface Receipt {
    _id: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    priceId: string;
    receipt: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;
// 👇 Add this helper
const IMAGE_BASE = API_URL.replace(/\/api$/, "");

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
};

const SEPA: React.FC = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const adminToken = localStorage.getItem("adminToken");

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const res = await axios.get(`${API_URL}/receipts`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                setReceipts(res.data.receipts || []);
            } catch {
                setReceipts([]);
            }
        };
        fetchReceipts();
    }, []);

    // Approve/Reject actions
    const handleApprove = async (id: string) => {
        await axios.post(`${API_URL}/receipts/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        setReceipts((r) => r.map(rec => rec._id === id ? { ...rec, status: "approved" } : rec));
    };

    const handleReject = async (id: string) => {
        await axios.post(`${API_URL}/receipts/${id}/reject`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        setReceipts((r) => r.map(rec => rec._id === id ? { ...rec, status: "rejected" } : rec));
    };

    // Filtered & searched receipts
    const filtered = receipts.filter(rec => {
        const name = `${rec.user.firstName} ${rec.user.lastName}`.toLowerCase();
        const matchSearch =
            name.includes(search.toLowerCase()) ||
            rec.user.email.toLowerCase().includes(search.toLowerCase()) ||
            rec.priceId.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || rec.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Bank Transfer Receipts</h1>
                    <p className="text-gray-400">Review & approve all uploaded SEPA bank receipts</p>
                </div>
            </div>
            {/* Filters/Search */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                        placeholder="Search by user, email, or price ID..."
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            {/* Receipts Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider"><User className="inline w-5 h-5 mr-2" />User</th>
                                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">Receipt</th>
                                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider"><Calendar className="inline w-5 h-5 mr-2" />Uploaded</th>
                                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-[16px] font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filtered.map(rec => (
                                <tr key={rec._id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{rec.user.firstName} {rec.user.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{rec.user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-blue-400">{rec.priceId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {rec.receipt && (
                                            <>
                                                <button onClick={() => setPreviewImg(`${IMAGE_BASE}${rec.receipt}`)} className="hover:underline text-blue-500 flex items-center">
                                                    <FileImage className="w-5 h-5 mr-1" /> View
                                                </button>
                                                <a href={`${IMAGE_BASE}${rec.receipt}`} download className="ml-2 text-gray-300 hover:text-white"><Download className="w-5 h-5" /></a>
                                            </>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[rec.status]}`}>{rec.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                defaultValue=""
                                                onChange={e => {
                                                    if (e.target.value === "approve") handleApprove(rec._id);
                                                    if (e.target.value === "reject") handleReject(rec._id);
                                                }}
                                                className="bg-gray-700 text-white rounded-lg px-2 py-1 focus:ring-1 focus:ring-red-500"
                                            >
                                                <option value="" disabled>Actions</option>
                                                <option value="approve">Approve</option>
                                                <option value="reject">Reject</option>
                                            </select>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-gray-400">No receipts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Image Preview Modal */}
            {previewImg && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="relative">
                        <button onClick={() => setPreviewImg(null)} className="absolute -top-4 -right-4 bg-gray-900 rounded-full p-2 text-white">
                            <XCircle className="w-6 h-6" />
                        </button>
                        <img src={previewImg} alt="Receipt Preview" className="max-w-[80vw] max-h-[80vh] rounded-xl shadow-lg" />
                    </div>
                </div>
    )}
        </div>
    );
};

export default SEPA;
