import React, { useEffect, useState } from 'react';
import { WithdrawalRequest } from '../../../types/api';
import { getWithdrawalRequests, processWithdrawalRequest } from '../../../services/api';

interface WithdrawalRequestsListProps {
  onRefresh: () => void;
}

const WithdrawalRequestsList: React.FC<WithdrawalRequestsListProps> = ({ onRefresh }) => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [processRequestId, setProcessRequestId] = useState<string | null>(null);
  const [processAction, setProcessAction] = useState<'approve' | 'reject' | 'complete' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [transactionReference, setTransactionReference] = useState<string>('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getWithdrawalRequests();
        setRequests(data.results);
        setError(null);
      } catch (err) {
        setError('Failed to load withdrawal requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(request => request.status === filterStatus);

  const openProcessModal = (id: string, action: 'approve' | 'reject' | 'complete') => {
    setProcessRequestId(id);
    setProcessAction(action);
    setNotes('');
    setTransactionReference('');
    setShowModal(true);
  };

  const handleProcessRequest = async () => {
    if (!processRequestId || !processAction) return;
    
    try {
      let status: 'approved' | 'rejected' | 'completed';
      
      if (processAction === 'approve') status = 'approved';
      else if (processAction === 'reject') status = 'rejected';
      else status = 'completed';
      
      await processWithdrawalRequest(
        processRequestId, 
        status,
        notes || undefined,
        processAction === 'complete' ? transactionReference : undefined
      );
      
      // Update the request in the list
      setRequests(requests.map(req => 
        req.id === processRequestId ? { ...req, status } : req
      ));
      
      setShowModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to process withdrawal request');
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

  if (requests.length === 0) {
    return (
      <div className="bg-gray-50 p-6 text-center rounded">
        <p className="text-gray-500">No withdrawal requests found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Withdrawal Requests</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Filter:</span>
          <select
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Journalist
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (KSH)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.journalist_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.amount} KSH
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.payment_method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => openProcessModal(request.id, 'approve')}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openProcessModal(request.id, 'reject')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <button
                      onClick={() => openProcessModal(request.id, 'complete')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {(request.status === 'rejected' || request.status === 'completed') && (
                    <span className="text-gray-400">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Process Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {processAction === 'approve' ? 'Approve Withdrawal' :
               processAction === 'reject' ? 'Reject Withdrawal' :
               'Complete Withdrawal'}
            </h3>
            
            {processAction !== 'complete' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                   className="w-full text-gray-900 focus:outline-none focus:ring-0 border border-slate-200 resize-none rounded-lg bg-light-300  p-2"
                
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any notes..."
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Reference *
                </label>
                <input
                  type="text"
                  className="w-full border text-gray-900 focus:ring-0 focus:outline-none border-slate-200 resize-none rounded-lg bg-light-300  p-2"
                
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="Enter transaction reference..."
                  required
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                   className="w-full border text-gray-900 focus:ring-0 focus:outline-none border-slate-200 resize-none rounded-lg bg-light-300  p-2"
                   rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any notes..."
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                className="bg-gray-900  text-white py-2 px-4 rounded-lg mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`py-2 px-4 rounded-lg text-white ${
                  processAction === 'approve' ? 'bg-violet-500 hover:bg-violet-600' :
                  processAction === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-green-500 hover:bg-green-600'
                }`}
                onClick={handleProcessRequest}
                disabled={processAction === 'complete' && !transactionReference}
              >
                {processAction === 'approve' ? 'Approve' :
                 processAction === 'reject' ? 'Reject' :
                 'Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequestsList;