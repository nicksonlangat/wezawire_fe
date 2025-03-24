import React, { useState } from 'react';
import { createWithdrawalRequest } from '../../../services/api';

interface NewWithdrawalFormProps {
  availablePoints: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const NewWithdrawalForm: React.FC<NewWithdrawalFormProps> = ({ 
  availablePoints, 
  onCancel, 
  onSuccess 
}) => {
//   const [formData, setFormData] = useState({
//     points: '',
//     payment_method: 'M-Pesa',
    
//     payment_details: {
//       phone_number: '',
//       name: '',
//       account_number: "",
//       bank_name: "",
//       account_name: ""
//     }
//   });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  type FormDataType = {
    points: string;
    payment_method: string;
    payment_details: {
      phone_number: string;
      name: string;
      account_number: string;
      bank_name: string;
      account_name: string;
    };
  };
  
  const [formData, setFormData] = React.useState<FormDataType>({
    points: '',
    payment_method: 'M-Pesa',
    payment_details: {
      phone_number: '',
      name: '',
      account_number: '',
      bank_name: '',
      account_name: '',
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.') as [keyof FormDataType, string];
  
        if (parent in prev && typeof prev[parent] === 'object') {
          return {
            ...prev,
            [parent]: {
              ...(prev[parent] as Record<string, unknown>), // Explicitly cast as object
              [child]: value
            }
          };
        }
      } 
      return { ...prev, [name]: value };
    });
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    const pointsToWithdraw = Number(formData.points);
    
    if (!pointsToWithdraw || pointsToWithdraw <= 0) {
      setError('Please enter a valid number of points to withdraw');
      return;
    }
    
    if (pointsToWithdraw > availablePoints) {
      setError(`You can't withdraw more than your available points (${availablePoints})`);
      return;
    }
    
    if (pointsToWithdraw % 5 !== 0) {
      setError('Points must be in multiples of 5');
      return;
    }
    
    if (formData.payment_method === 'M-Pesa' && !formData.payment_details.phone_number) {
      setError('Please enter a phone number for M-Pesa withdrawal');
      return;
    }
    
    try {
      setLoading(true);
      await createWithdrawalRequest({
        points: pointsToWithdraw,
        payment_method: formData.payment_method,
        payment_details: formData.payment_details
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create withdrawal request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pointsToKsh = (points: number) => {
    return (points / 5) * 100;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Withdrawal</h2>
      
      <div className="bg-blue-50 p-4 rounded mb-6">
        <p className="text-sm text-gray-600">Available Points: <span className="font-bold">{availablePoints}</span></p>
        <p className="text-sm text-gray-600">Equivalent in KSH: <span className="font-bold">{pointsToKsh(availablePoints).toFixed(2)} KSH</span></p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="points">
            Points to Withdraw *
          </label>
          <input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="bg-light-300 border border-slate-200 rounded-lg w-full
            py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" 
             placeholder="Enter points (multiples of 5)"
            step="5"
            min="5"
            max={availablePoints}
            required
          />
          {formData.points && (
            <p className="text-sm text-gray-600 mt-1">
              You will receive: {pointsToKsh(Number(formData.points)).toFixed(2)} KSH
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_method">
            Payment Method *
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="bg-light-300 border border-slate-200 rounded-lg w-full
            py-2.5 px-3 text-gray-500 focus:outline-none focus:shadow-outline"  
               required
          >
            <option value="M-Pesa">M-Pesa</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        
        {formData.payment_method === 'M-Pesa' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_details.phone_number">
                Phone Number *
              </label>
              <input
                type="text"
                id="payment_details.phone_number"
                name="payment_details.phone_number"
                value={formData.payment_details.phone_number}
                onChange={handleChange}
                className="bg-light-300 border border-slate-200 rounded-lg w-full
                py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"    
                  placeholder="e.g. 07xxxxxxxx"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_details.name">
                Name on M-Pesa
              </label>
              <input
                type="text"
                id="payment_details.name"
                name="payment_details.name"
                value={formData.payment_details.name}
                onChange={handleChange}
                className="bg-light-300 border border-slate-200 rounded-lg w-full
                py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"      placeholder="Name registered with M-Pesa"
              />
            </div>
          </>
        )}
        
        {formData.payment_method === 'Bank Transfer' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_details.account_number">
                Account Number *
              </label>
              <input
                type="text"
                id="payment_details.account_number"
                name="payment_details.account_number"
                value={formData.payment_details.account_number || ''}
                onChange={handleChange}
                className="bg-light-300 border border-slate-200 rounded-lg w-full
                py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"      placeholder="Bank account number"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_details.bank_name">
                Bank Name *
              </label>
              <input
                type="text"
                id="payment_details.bank_name"
                name="payment_details.bank_name"
                value={formData.payment_details.bank_name || ''}
                onChange={handleChange}
                className="bg-light-300 border border-slate-200 rounded-lg w-full
                py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"       placeholder="Bank name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_details.account_name">
                Account Name *
              </label>
              <input
                type="text"
                id="payment_details.account_name"
                name="payment_details.account_name"
                value={formData.payment_details.account_name || ''}
                onChange={handleChange}
                className="bg-light-300 border border-slate-200 rounded-lg w-full
                py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"     placeholder="Name on bank account"
                required
              />
            </div>
          </>
        )}
        
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-900 text-white py-2 px-4 rounded-lg mr-2"
            disabled={loading}
          >
            Cancel Request
          </button>
          <button
            type="submit"
            className="bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWithdrawalForm;