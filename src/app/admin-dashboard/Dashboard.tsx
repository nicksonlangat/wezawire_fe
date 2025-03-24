import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard as AdminDashboardType } from '../../../types/api';
import { getAdminDashboard } from '../../../services/api';
import PendingLinksList from './PendingLinksList';
import WithdrawalRequestsList from './WithdrawalRequestsList';
import PressReleaseStats from './PressReleaseStats';
// import JournalistsList from './JournalistsList';

const AdminDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboard();
        setDashboard(data);
        setError(null);
      } catch (err) {
        setError('Failed to load admin dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Something went wrong'}</p>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            onClick={() => router.refresh()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="bg-light-400 p-1 rounded-lg">
        <div className="bg-white rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl text-gray-800">Admin Dashboard</h1>
              <p className="text-slate-500">Manage press releases, links, and withdrawal requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-light-400 mt-5 p-1 rounded-lg">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl text-gray-800 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending Links</p>
              <p className="text-2xl font-bold text-blue-600">{dashboard.pending_links}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-yellow-600">{dashboard.pending_withdrawals}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total KSH Processed</p>
              <p className="text-2xl font-bold text-green-600">{dashboard.total_ksh_processed} KSH</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Points Awarded</p>
              <p className="text-2xl font-bold text-purple-600">{dashboard.total_points_awarded}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Points Withdrawn</p>
              <p className="text-2xl font-bold text-indigo-600">{dashboard.total_points_withdrawn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-light-400 mt-5 p-1 rounded-lg">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview' 
                  ? 'border-b-2 border-violet-500 text-violet-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'pending-links'
                  ? 'border-b-2 border-violet-500 text-violet-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('pending-links')}
            >
              Pending Links
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'withdrawal-requests'
                  ? 'border-b-2 border-violet-500 text-violet-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('withdrawal-requests')}
            >
              Withdrawal Requests
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'journalists'
                  ? 'border-b-2 border-violet-500 text-violet-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('journalists')}
            >
              Journalists
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'press-releases'
                  ? 'border-b-2 border-violet-500 text-violet-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('press-releases')}
            >
              Press Releases
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Top Journalists</h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboard.top_journalists.map((journalist, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {journalist.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {journalist.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {journalist.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'pending-links' && (
              <PendingLinksList onRefresh={() => router.refresh()} />
            )}
            
            {activeTab === 'withdrawal-requests' && (
              <WithdrawalRequestsList onRefresh={() => router.refresh()} />
            )}
            
            {/* {activeTab === 'journalists' && (
              <JournalistsList />
            )} */}
            
            {activeTab === 'press-releases' && (
              <PressReleaseStats />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;