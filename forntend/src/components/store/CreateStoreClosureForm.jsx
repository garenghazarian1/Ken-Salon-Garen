"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '@/context/StoreContext';
import { baseUrl } from '@/api/ports';
import { useSession } from 'next-auth/react';

const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";
const buttonStyle = "flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-400";

const CreateStoreClosureForm = () => {
  const { data: session } = useSession();
  const { currentStoreId } = useStore();
  const [closureDate, setClosureDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true); // Start loading

    if (!closureDate || !reason) {
      setError('Please fill in all fields.');
      setIsLoading(false); // Stop loading
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (closureDate < today) {
      setError('Closure date cannot be in the past.');
      setIsLoading(false); // Stop loading
      return;
    }

    if (!session || !session.accessToken) {
      setError('You must be logged in to perform this action.');
      setIsLoading(false); // Stop loading
      return;
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      };
      await axios.post(`${baseUrl}/api/storeclosures`, {
        store: currentStoreId,
        closureDate,
        reason,
      }, config);

      setSuccess(`Store closure for ${closureDate} added successfully!`);
      setClosureDate('');
      setReason('');
      setIsFormVisible(false); // Optionally hide the form on success
    } catch (error) {
      console.error('Failed to create store closure:', error);
      setError(error.response && error.response.data.message ? error.response.data.message : 'Failed to add store closure. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    // Clear form and messages when toggling visibility
    setError('');
    setSuccess('');
    setClosureDate('');
    setReason('');
  };

  return (
    <>
      <h2 onClick={toggleFormVisibility} className={buttonStyle}>Create Store Closure</h2>
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <div>
            <label htmlFor="closureDate" className="block text-sm font-medium text-gray-200">Closure Date</label>
            <input type="date" id="closureDate" value={closureDate} onChange={(e) => setClosureDate(e.target.value)} className={inputStyle}/>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-200">Reason</label>
            <input type="text" id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className={inputStyle}/>
          </div>
          <button type="submit" disabled={isLoading} className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
            {isLoading ? 'Adding...' : 'Add Closure'}
          </button>
        </form>
      )}
    </>
  );
};

export default CreateStoreClosureForm;
