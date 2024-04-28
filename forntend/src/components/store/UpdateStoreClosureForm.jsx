"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { baseUrl } from '@/api/ports';
import { useSession } from 'next-auth/react';

const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";
const buttonStyle = "flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-400";

const UpdateStoreClosureForm = () => {
  const router = useRouter();
  const { currentStoreClosureId } = useStore();
  const { data: session } = useSession();
  const [storeClosure, setStoreClosure] = useState({
    closureDate: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchStoreClosure = async () => {
      if (currentStoreClosureId) {
        try {
          const response = await axios.get(`${baseUrl}/api/storeclosures/${currentStoreClosureId}`, {
            headers: {
              'Authorization': `Bearer ${session?.accessToken}`,
            },
          });
          setStoreClosure({
            closureDate: response.data.closureDate.slice(0, 10), // Slice to get YYYY-MM-DD format
            reason: response.data.reason,
          });
        } catch (error) {
          console.error('Error fetching store closure:', error);
          setError('Failed to fetch store closure details.');
        }
      }
    };

    fetchStoreClosure();
  }, [currentStoreClosureId, session?.accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreClosure(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/api/storeclosures/${currentStoreClosureId}`, storeClosure, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      setSuccess('Store closure updated successfully');
      router.push('/stores'); // Adjust the redirection path as needed
    } catch (error) {
      console.error('Error updating store closure:', error);
      setError('Failed to update store closure.');
      setSuccess('');
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
      <h2 onClick={toggleFormVisibility} className={buttonStyle}>Update Store Closure</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      {isFormVisible && (
        <div className="update-store-closure-form">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="closureDate" className="block text-sm font-medium text-gray-200">Closure Date</label>
              <input type="date" id="closureDate" name="closureDate" value={storeClosure.closureDate || ''} onChange={handleChange} className={inputStyle}/>
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-200">Reason</label>
              <input type="text" id="reason" name="reason" value={storeClosure.reason || ''} onChange={handleChange} className={inputStyle}/>
            </div>
            <button type="submit" className={buttonStyle}>Update Closure</button>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateStoreClosureForm;
