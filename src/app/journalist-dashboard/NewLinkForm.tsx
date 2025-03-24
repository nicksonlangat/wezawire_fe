import React, { useState } from 'react';
import { PressRelease } from '../../../types/api';
import { createPublishedLink } from '../../../services/api';

interface NewLinkFormProps {
  pressReleases: PressRelease[];
  selectedPressReleaseId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const NewLinkForm: React.FC<NewLinkFormProps> = ({ 
  pressReleases, 
  selectedPressReleaseId, 
  onCancel, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    press_release: selectedPressReleaseId || '',
    url: '',
    title: '',
    publication_date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!formData.press_release) {
      setError('Please select a press release');
      return;
    }
    
    if (!formData.url) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setLoading(true);
      await createPublishedLink({
        press_release: formData.press_release,
        url: formData.url,
        title: formData.title,
        publication_date: formData.publication_date
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Submit Published Link</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="press_release">
            Press Release *
          </label>
          <select
            id="press_release"
            name="press_release"
            value={formData.press_release}
            onChange={handleChange}
            className="bg-light-300 border border-slate-200 rounded-lg w-full
             py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a press release</option>
            {pressReleases.map(pr => (
              <option key={pr.id} value={pr.id}>{pr.title}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
            URL *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="bg-light-300 border border-slate-200 rounded-lg w-full
             py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"   placeholder="https://example.com/article"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Article Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-light-300 border border-slate-200 rounded-lg w-full
            py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"   placeholder="Article title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publication_date">
            Publication Date
          </label>
          <input
            type="date"
            id="publication_date"
            name="publication_date"
            value={formData.publication_date}
            onChange={handleChange}
            className="bg-light-300 border border-slate-200 rounded-lg w-full
             py-2.5 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"   />
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-light-300 text-gray-800  py-2 px-4 rounded-lg mr-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-violet-500 hover:bg-violet-600 text-white  py-2 px-4 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Link'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewLinkForm;