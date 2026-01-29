"use client";
import React, { useState, useEffect } from 'react';
import { CreditCard, History, Download, Filter, Calendar, TrendingUp, DollarSign, Gift, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import MemberGiveModal from '@/components/MemberGiveModal';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

export default function Giving() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [givingData, setGivingData] = useState({
    donations: [],
    stats: { total_given: 0, this_month_total: 0, total_contributions: 0 },
    pagination: { current_page: 1, total_pages: 1, total_records: 0, per_page: 10 },
    filters: { months: ['all'], types: ['all'] }
  });

  const fetchGivingHistory = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/giving/member_history.php`, {
        params: {
          member_id: user.id,
          page: currentPage,
          limit: 10,
          type: filterType,
          month: filterMonth
        }
      });

      if (response.data.success) {
        setGivingData({
          donations: response.data.data,
          stats: response.data.stats,
          pagination: response.data.pagination,
          filters: response.data.filters
        });
      }
    } catch (error) {
      console.error('Error fetching giving history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGivingHistory();
  }, [user?.id, currentPage, filterType, filterMonth]);

  const { donations, stats, pagination, filters } = givingData;

  const handleGenerateReceipt = async (donationId) => {
    try {
      const response = await axios.post(`${API_URL}/giving/generate_receipt.php`, {
        donation_id: donationId
      });

      if (response.data.success) {
        // Refresh the giving history to get the updated receipt URL
        fetchGivingHistory();
        alert('Receipt generated successfully!');
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  return (
    <>
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-3xl text-white">
          <DollarSign size={32} className="mb-4 opacity-80" />
          <p className="text-sm uppercase font-bold opacity-80 mb-1">Total Given</p>
          <p className="text-4xl font-black">K {stats.total_given.toLocaleString()}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100">
          <TrendingUp size={32} className="mb-4 text-green-600" />
          <p className="text-sm uppercase font-bold text-gray-500 mb-1">This Month</p>
          <p className="text-4xl font-black text-gray-900">K {stats.this_month_total.toLocaleString()}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100">
          <Calendar size={32} className="mb-4 text-blue-600" />
          <p className="text-sm uppercase font-bold text-gray-500 mb-1">Contributions</p>
          <p className="text-4xl font-black text-gray-900">{stats.total_contributions}</p>
        </div>
      </div>

      {/* Give Now Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100">
        <h2 className="text-2xl font-black mb-6 uppercase">Give Now</h2>
        
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-600/20">
            <Gift size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Support the Ministry</h3>
          <p className="text-gray-500 mb-8 px-6 max-w-md mx-auto">
            Your generosity fuels the mission. Safe, secure, and simple online giving.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-orange-700 transition-all active:scale-[0.98] mx-auto shadow-xl shadow-orange-600/20"
          >
            <CreditCard size={24} />
            Give Now
          </button>
          <div className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div> 256-bit SSL Secure Payment
          </div>
        </div>

        {/* Recurring Giving Setup */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg">Set Up Recurring Giving</h3>
              <p className="text-sm text-gray-500 mt-1">Automate your tithes and offerings</p>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-2xl font-bold text-sm transition-all">
              Set Up
            </button>
          </div>
        </div>
      </div>

      {/* Giving History */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <History size={24} className="text-gray-400" />
            <h3 className="font-black uppercase text-xl">Giving History</h3>
          </div>
          
          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="flex-1 md:flex-initial px-4 py-2 bg-gray-50 rounded-xl border-2 border-transparent focus:border-orange-600 outline-none font-bold text-sm"
            >
              {filters.types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>

            <select
              value={filterMonth}
              onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
              className="flex-1 md:flex-initial px-4 py-2 bg-gray-50 rounded-xl border-2 border-transparent focus:border-orange-600 outline-none font-bold text-sm"
            >
              {filters.months.map(month => (
                <option key={month} value={month}>
                  {month === 'all' ? 'All Months' : month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={48} className="mx-auto text-orange-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading giving history...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold uppercase text-gray-500">Date</th>
                    <th className="text-left p-4 text-xs font-bold uppercase text-gray-500">Type</th>
                    <th className="text-left p-4 text-xs font-bold uppercase text-gray-500">Amount</th>
                    <th className="text-left p-4 text-xs font-bold uppercase text-gray-500">Method</th>
                    <th className="text-left p-4 text-xs font-bold uppercase text-gray-500">Reference</th>
                    <th className="text-left p-4 text-xs font-bold uppercase text-gray-500">Status</th>
                    <th className="text-center p-4 text-xs font-bold uppercase text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((record) => (
                    <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-bold text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                          record.type === 'Tithe' ? 'bg-blue-100 text-blue-600' :
                          record.type === 'Offering' ? 'bg-green-100 text-green-600' :
                          record.type === 'Seed' ? 'bg-yellow-100 text-yellow-600' :
                          record.type === 'Partnership' ? 'bg-red-100 text-red-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-black text-gray-900">K {parseFloat(record.amount).toLocaleString()}</td>
                      <td className="p-4 text-sm text-gray-600">{record.method}</td>
                      <td className="p-4 text-xs text-gray-400 font-mono">{record.reference}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                          record.status === 'completed' ? 'bg-green-100 text-green-600' :
                          record.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {record.receipt_url ? (
                          <a 
                            href={`${API_URL}/${record.receipt_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-xs font-bold hover:underline"
                          >
                            <Download size={14} />
                            Receipt
                          </a>
                        ) : record.status === 'completed' ? (
                          <button
                            onClick={() => handleGenerateReceipt(record.id)}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-bold hover:underline"
                          >
                            <Download size={14} />
                            Generate
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {donations.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                        record.type === 'Tithe' ? 'bg-blue-100 text-blue-600' :
                        record.type === 'Offering' ? 'bg-green-100 text-green-600' :
                        record.type === 'Seed' ? 'bg-yellow-100 text-yellow-600' :
                        record.type === 'Partnership' ? 'bg-red-100 text-red-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {record.type}
                      </span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                      record.status === 'completed' ? 'bg-green-100 text-green-600' :
                      record.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="text-lg font-black text-gray-900">K {parseFloat(record.amount).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Date</span>
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Method</span>
                      <span className="text-sm text-gray-600">{record.method}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Reference</span>
                      <span className="text-xs text-gray-400 font-mono">{record.reference}</span>
                    </div>
                    
                    {record.receipt_url ? (
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <a 
                          href={`${API_URL}/${record.receipt_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-bold w-full py-2 bg-white rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          <Download size={16} />
                          Download Receipt
                        </a>
                      </div>
                    ) : record.status === 'completed' ? (
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <button
                          onClick={() => handleGenerateReceipt(record.id)}
                          className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-bold w-full py-2 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Download size={16} />
                          Generate Receipt
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && donations.length === 0 && (
          <div className="p-12 text-center text-gray-500 text-sm">
            No transactions found matching your filters.
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_records)} of{' '}
              {pagination.total_records} records
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={pagination.current_page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                      page === pagination.current_page
                        ? 'bg-orange-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                disabled={pagination.current_page === pagination.total_pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    
    <MemberGiveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} />
    </>
  );
}