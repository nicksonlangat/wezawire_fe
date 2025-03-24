// components/journalist/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JournalistDashboard } from '../../../types/api';
import { getJournalistDashboard } from '../../../services/api';
import PressReleaseList from './PressReleaseList';
import PublishedLinkList from './PublishedLinkList';
import WithdrawalRequestList from './WithdrawalRequestList';
import NewLinkForm from './NewLinkForm';
import NewWithdrawalForm from './NewWithdrawalForm';


const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<JournalistDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('press-releases');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getJournalistDashboard();
        setDashboard(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
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
            <h1 className="text-2xl  text-gray-800">Welcome, {dashboard.journalist.name || 'Journalist'}</h1>
            <p className="text-slate-500">{dashboard.journalist.media_house}</p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="mr-6">
                <p className="text-sm text-gray-600">Available Points</p>
                <p className="text-xl font-bold text-blue-600">{dashboard.total_points}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Value in KSH</p>
                <p className="text-xl font-bold text-green-600">{dashboard.points_in_ksh} KSH</p>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>

      {/* Tabs */}
      <div className="bg-light-400 mt-5 p-1 rounded-lg">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="flex border-b">
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
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'published-links'
                ? 'border-b-2 border-violet-500 text-violet-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('published-links')}
          >
            Published Links
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'withdrawal-requests'
                ? 'border-b-2 border-violet-500 text-violet-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('withdrawal-requests')}
          >
            Withdrawals
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'press-releases' && (
            <PressReleaseList 
              pressReleases={dashboard.press_releases} 
              onAddLink={(pressReleaseId) => {
                setActiveTab('new-link');
                // Store the selected press release ID in session storage
                sessionStorage.setItem('selectedPressReleaseId', pressReleaseId.toString());
              }}
            />
          )}
          
          {activeTab === 'published-links' && (
            <PublishedLinkList 
              publishedLinks={dashboard.published_links} 
              onAddLink={() => setActiveTab('new-link')}
            />
          )}
          
          {activeTab === 'withdrawal-requests' && (
            <WithdrawalRequestList 
              withdrawalRequests={dashboard.withdrawal_requests}
              onNewWithdrawal={() => setActiveTab('new-withdrawal')}
            />
          )}
          
          {activeTab === 'new-link' && (
            <NewLinkForm 
              pressReleases={dashboard.press_releases}
              selectedPressReleaseId={
                sessionStorage.getItem('selectedPressReleaseId') 
                  ? (sessionStorage.getItem('selectedPressReleaseId')!)
                  : ""
              }
              onCancel={() => setActiveTab('published-links')}
              onSuccess={() => {
                // Refresh dashboard data and go back to published links
                router.refresh();
              }}
            />
          )}
          
          {activeTab === 'new-withdrawal' && (
            <NewWithdrawalForm 
              availablePoints={dashboard.total_points}
              onCancel={() => setActiveTab('withdrawal-requests')}
              onSuccess={() => {
                // Refresh dashboard data and go back to withdrawal requests
                router.refresh();
              }}
            />
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;