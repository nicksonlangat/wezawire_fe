import React from 'react';
import { PublishedLink } from '../../../types/api';


interface PublishedLinkListProps {
  publishedLinks: PublishedLink[];
  onAddLink: () => void;
}

const PublishedLinkList: React.FC<PublishedLinkListProps> = ({ publishedLinks, onAddLink }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Published Links</h2>
        <button 
          onClick={onAddLink}
          className="bg-violet-500 hover:bg-blviolete-600 text-white py-2 px-4 rounded-lg"
        >
          Add New Link
        </button>
      </div>
      
      {publishedLinks.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-gray-600">You haven't submitted any links yet.</p>
          <button 
            onClick={onAddLink}
            className="mt-2 bg-violet-500 hover:bg-violet-600 text-white py-1 px-3 rounded-lg"
          >
            Add Your First Link
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Press Release</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publishedLinks.map((link) => (
                <tr key={link.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{truncateText(link.press_release_title, 30)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                      {link.url.length > 30 ? `${link.url.substring(0, 30)}...` : link.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(link.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(link.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {link.notes || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublishedLinkList;