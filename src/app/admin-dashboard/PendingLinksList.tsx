import React, { useEffect, useState } from 'react';
import { PublishedLink } from '../../../types/api';
import { getPublishedLinks, approvePublishedLink, rejectPublishedLink } from '../../../services/api';

interface PendingLinksListProps {
  onRefresh: () => void;
}

const PendingLinksList: React.FC<PendingLinksListProps> = ({ onRefresh }) => {
  const [links, setLinks] = useState<PublishedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<string>('');
  const [rejectionLinkId, setRejectionLinkId] = useState<string | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const data = await getPublishedLinks();
        console.log(data.re)
        // Filter only the pending links
        setLinks(data.results!);
        // setError(null);
      } catch (err) {
        console.log(error)
        setError('Failed to load pending links');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approvePublishedLink(id);
      // Remove the link from the list
      setLinks(links.filter(link => link.id !== id));
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to approve link');
    }
  };

  const openRejectionModal = (id: string) => {
    setRejectionLinkId(id);
    setRejectionNotes('');
    setShowRejectionModal(true);
  };

  const handleReject = async () => {
    if (!rejectionLinkId) return;
    
    try {
      await rejectPublishedLink(rejectionLinkId, rejectionNotes);
      // Remove the link from the list
      setLinks(links.filter(link => link.id !== rejectionLinkId));
      setShowRejectionModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to reject link');
    }
  };

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

  if (links.length === 0) {
    return (
      <div className="bg-gray-50 p-6 text-center rounded">
        <p className="text-gray-500">No pending links to review.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Links</h2>
      <div className="bg-white rounded-lg overflow-hidden">
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
                Press Release
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {truncateText(link.title, 20)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {link.url.length > 20 ? link.url.substring(0, 20) + '...' : link.url}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {link.journalist_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {truncateText(link.press_release_title, 20)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(link.publication_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleApprove(link.id)}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectionModal(link.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reject Link</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              className="w-full border border-slate-200 rounded-lg bg-light-300 resize-none focus:ring-0 focus:outline-none
              text-gray-900
              p-2 mb-4"
              rows={4}
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-900 text-white rounded-lg px-4 mr-2"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={handleReject}
                disabled={!rejectionNotes.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingLinksList;