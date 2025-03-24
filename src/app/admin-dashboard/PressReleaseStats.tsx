import React, { useEffect, useState } from 'react';
import { PressRelease, PressReleaseStats as PressReleaseStatsType } from '../../../types/api';
import { getPublishedLinks, getPressReleaseStats } from '../../../services/api';

const PressReleaseStats: React.FC = () => {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [selectedPressReleaseId, setSelectedPressReleaseId] = useState<string | null>(null);
  const [stats, setStats] = useState<PressReleaseStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPressReleases = async () => {
      try {
        setLoading(true);
        const data = await getPublishedLinks();
        // Extract unique press releases from the links
        const uniquePressReleases = Array.from(
          new Map(
            data.map((link: any) => [
              link.press_release, 
              { 
                id: link.press_release, 
                title: link.press_release_title 
              }
            ])
          ).values()
        ) as PressRelease[];
        
        setPressReleases(uniquePressReleases);
        setError(null);
      } catch (err) {
        setError('Failed to load press releases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPressReleases();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedPressReleaseId) {
        setStats(null);
        return;
      }
      
      try {
        setStatsLoading(true);
        const statsData = await getPressReleaseStats(selectedPressReleaseId);
        setStats(statsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load press release statistics');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [selectedPressReleaseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (pressReleases.length === 0) {
    return (
      <div className="bg-gray-50 p-6 text-center rounded">
        <p className="text-gray-500">No press releases found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Press Release Statistics</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Press Release
        </label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={selectedPressReleaseId || ''}
          onChange={(e) => setSelectedPressReleaseId(e.target.value || null)}
        >
          <option value="">-- Select a press release --</option>
          {pressReleases.map((pr) => (
            <option key={pr.id} value={pr.id}>
              {pr.title}
            </option>
          ))}
        </select>
      </div>
      
      {statsLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {!statsLoading && stats && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">{stats.press_release.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Published by</p>
                <p className="text-xl font-bold text-blue-600">{stats.press_release.author_name}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Client</p>
                <p className="text-xl font-bold text-green-600">{stats.press_release.client}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Country</p>
                <p className="text-xl font-bold text-purple-600">{stats.press_release.country}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Published Date</p>
                <p className="text-xl font-bold text-yellow-600">
                  {new Date(stats.press_release.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Journalists Shared With</p>
                <p className="text-xl font-bold text-blue-600">{stats.journalists_shared}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Journalists Published</p>
                <p className="text-xl font-bold text-green-600">{stats.journalists_published}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-xl font-bold text-indigo-600">{(stats.engagement_rate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Link Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.links_stats.map((linkStat, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${
                    linkStat.status === 'approved' ? 'bg-green-50' :
                    linkStat.status === 'pending' ? 'bg-yellow-50' :
                    'bg-red-50'
                  }`}
                >
                  <p className="text-sm text-gray-600">
                    {linkStat.status.charAt(0).toUpperCase() + linkStat.status.slice(1)}
                  </p>
                  <p className={`text-xl font-bold ${
                    linkStat.status === 'approved' ? 'text-green-600' :
                    linkStat.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {linkStat.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {stats.press_release.published_links && stats.press_release.published_links.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Published Links</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Journalist
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.press_release.published_links.map((link) => (
                      <tr key={link.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {link.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {link.journalist_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            link.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            link.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(link.publication_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!statsLoading && !stats && selectedPressReleaseId && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load statistics for this press release</p>
        </div>
      )}
      
      {!statsLoading && !stats && !selectedPressReleaseId && (
        <div className="bg-gray-50 p-6 text-center rounded">
          <p className="text-gray-500">Select a press release to view statistics</p>
        </div>
      )}
    </div>
  );
};

export default PressReleaseStats;