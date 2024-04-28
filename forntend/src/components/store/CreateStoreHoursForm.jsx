"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '@/context/StoreContext';
import { baseUrl } from '@/api/ports'; // Ensure this points to the correct file where baseUrl is defined
import { useSession } from 'next-auth/react';

const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";
const button = " flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:bg-gray-400"

const CreateStoreHoursForm = () => {
  const { data: session } = useSession();
  const { currentStoreId } = useStore();
  const [day, setDay] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!day || !openTime || !closeTime) {
      setError('Please fill in all fields.');
      return;
    }

    // Ensure session token exists
    if (!session || !session.accessToken) {
      setError('You must be logged in to perform this action.');
      return;
    }
    try {
        const config = {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
          };
      await axios.post(`${baseUrl}/api/storehours`, {
        store: currentStoreId,
        day,
        openTime,
        closeTime,
      }, config);

      setSuccess('Store hours added successfully!');
      // Clear the form fields after successful submission
      setDay('');
      setOpenTime('');
      setCloseTime('');
    } catch (error) {
      console.error('Failed to create store hours:', error);
      setError(error.response && error.response.data.message ? error.response.data.message : 'Failed to add store hours. Please try again.');
    }
  };
      
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
    <h2 onClick={toggleFormVisibility} className={button}>create store open days hours</h2>
    {isFormVisible && (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <div>
        <label htmlFor="day" className="block text-sm font-medium text-gray-200">Day</label>
            <select  id="day"  value={day}  onChange={(e) => setDay(e.target.value)}  className={inputStyle}  > 
                <option value="">Select a day</option> <option value="Monday">Monday</option> <option value="Tuesday">Tuesday</option> <option value="Wednesday">Wednesday</option> <option value="Thursday">Thursday</option> <option value="Friday">Friday</option> <option value="Saturday">Saturday</option> <option value="Sunday">Sunday</option>
            </select>
       </div>
      <div>
        <label htmlFor="openTime" className="block text-sm font-medium text-gray-200">Open Time</label>
        <input type="time" id="openTime" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className={inputStyle}/>
      </div>
      <div>
        <label htmlFor="closeTime" className="block text-sm font-medium text-gray-200">Close Time</label>
        <input type="time" id="closeTime" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className={inputStyle}/>
      </div>
      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Store Hours</button>
    </form>
    )}
    </>
  );
};

export default CreateStoreHoursForm;
