"use client"
import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext'; 


const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";
const button = " flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:bg-gray-400"

const UnavailabilityManager = () => {
  const { unavailabilities, addUnavailability, updateUnavailability, deleteUnavailability, selectedEmployeeId
  } = useEmployee();
  const [editingUnavailability, setEditingUnavailability] = useState(null);
  const [type, setType] = useState('');
  const [reason, setReason] = useState('');
  const [dates, setDates] = useState('');

  useEffect(() => {
    if (editingUnavailability) {
      setType(editingUnavailability.type);
      setReason(editingUnavailability.reason);
      setDates(editingUnavailability.unavailableDates.join(', '));
    } else {
      resetForm();
    }
  }, [editingUnavailability]);

  const resetForm = () => {
    setType('');
    setReason('');
    setDates('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unavailabilityDetails = {
      type,
      reason,
      unavailableDates: dates.split(',').map(date => new Date(date.trim())),
    };

    if (editingUnavailability) {
      await updateUnavailability(editingUnavailability._id, unavailabilityDetails);
    } else {
      await addUnavailability(unavailabilityDetails);
    }
    setEditingUnavailability(null);
    resetForm();
  };

  const handleEdit = (unavailability) => {
    setEditingUnavailability(unavailability);
  };

  const handleDelete = async (unavailabilityId) => {
    await deleteUnavailability(unavailabilityId);
  };

  return (
    <div>
      <h2>Manage Unavailabilities</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Type:
            <select className={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="vacation">Vacation</option>
              <option value="illness">Illness</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Reason:
            <input className={inputStyle} type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Dates (comma-separated):
            <input className={inputStyle} type="date" value={dates} onChange={(e) => setDates(e.target.value)} />
          </label>
        </div>
        <button className={button} type="submit">Save</button>
        {editingUnavailability && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <div className="max-w-4xl mx-auto px-4 py-6">
  {unavailabilities.map((unavailability) => (
    <div key={unavailability._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="font-semibold text-lg text-indigo-600">Type: {unavailability.type}</div>
      <div className="text-gray-700">Reason: {unavailability.reason}</div>
      <div className="text-gray-600 italic">Dates: {unavailability.unavailableDates.join(', ')}</div>
      <div className="flex justify-end space-x-2 mt-4">
        <button 
          onClick={() => handleEdit(unavailability)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Edit
        </button>
        <button 
          onClick={() => handleDelete(unavailability._id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default UnavailabilityManager;
