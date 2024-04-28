// context/EmployeeContext.js
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useStore } from '@/context/StoreContext'; 
import { useSession} from 'next-auth/react';


const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const { currentStoreId } = useStore();
  const { data: session } = useSession();
  //console.log("🚀 ~ EmployeeProvider ~ currentStoreId:", currentStoreId)
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unavailabilities, setUnavailabilities] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!currentStoreId) return;
  
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/employees?storeId=${currentStoreId}`);
        setEmployees(response.data);
        //console.log("🚀 ~ fetchEmployees ~ response:", response)
        setError(null);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEmployees();
  }, [currentStoreId]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!selectedEmployeeId) return;
  
      try {
        const response = await axios.get(`${baseUrl}/api/availabilities?employee=${selectedEmployeeId}`);
        setAvailabilities(response.data);
        //console.log("🚀 ~ fetchAvailabilities ~ response:", response.data)
      } catch (err) {
        console.error('Failed to fetch availabilities:', err);
      }
    };
  
    fetchAvailabilities();
  }, [selectedEmployeeId]);

  const addAvailability = async (availabilityDetails) => {
    try {
      const newAvailability = { ...availabilityDetails, employee: selectedEmployeeId };
      const response = await axios.post(`${baseUrl}/api/availabilities`, newAvailability, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      setAvailabilities([...availabilities, response.data]);
    } catch (err) {
      setError('Failed to add availability');
    }
  };

  // Function to update an availability
  const updateAvailability = async (availabilityId, updatedAvailability) => {
    try {
      const response = await axios.put(`${baseUrl}/api/availabilities/${availabilityId}`, updatedAvailability, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      const updatedAvailabilities = availabilities.map(avail => avail._id === availabilityId ? response.data : avail);
      setAvailabilities(updatedAvailabilities);
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  // Function to delete an availability
  const deleteAvailability = async (availabilityId) => {
    try {
      await axios.delete(`${baseUrl}/api/availabilities/${availabilityId}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      const filteredAvailabilities = availabilities.filter(avail => avail._id !== availabilityId);
      setAvailabilities(filteredAvailabilities);
    } catch (err) {
      setError('Failed to delete availability');
    }
  };

// UNAVILABILITY****************************************************

useEffect(() => {
  const fetchUnavailabilities = async () => {
    if (!selectedEmployeeId) return;

    try {
      const response = await axios.get(`${baseUrl}/api/employee-unavailabilities?employeeId=${selectedEmployeeId}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`, // Use session.accessToken if your API requires authentication
        },
      });
      setUnavailabilities(response.data); // Update your state with the fetched unavailabilities
    } catch (err) {
      console.error('Failed to fetch unavailabilities:', err);
      // Optionally, update your component's state to reflect the error
    }
  };

  fetchUnavailabilities();
}, [selectedEmployeeId]); // Re-run this effect if selectedEmployeeId changes


const addUnavailability = async (unavailabilityDetails) => {
  try {
    const response = await axios.post(`${baseUrl}/api/employee-unavailabilities`, {
      ...unavailabilityDetails,
      employee: selectedEmployeeId,
    }, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    setUnavailabilities([...unavailabilities, response.data]);
  } catch (err) {
    console.error('Failed to add unavailability:', err);
    setError(err.message || 'Failed to add unavailability');
  }
};


const updateUnavailability = async (unavailabilityId, updatedDetails) => {
  try {
    const response = await axios.put(`${baseUrl}/api/employee-unavailabilities/${unavailabilityId}`, updatedDetails, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    const updatedUnavailabilities = unavailabilities.map(unavail => unavail._id === unavailabilityId ? response.data : unavail);
    setUnavailabilities(updatedUnavailabilities);
  } catch (err) {
    console.error('Failed to update unavailability:', err);
    setError(err.message || 'Failed to update unavailability');
  }
};

const deleteUnavailability = async (unavailabilityId) => {
  try {
    await axios.delete(`${baseUrl}/api/employee-unavailabilities/${unavailabilityId}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    const filteredUnavailabilities = unavailabilities.filter(unavail => unavail._id !== unavailabilityId);
    setUnavailabilities(filteredUnavailabilities);
  } catch (err) {
    console.error('Failed to delete unavailability:', err);
    setError(err.message || 'Failed to delete unavailability');
  }
};


  
  

  return (
    <EmployeeContext.Provider value={{
      employees, 
      selectedEmployeeId, 
      setSelectedEmployeeId, 
      availabilities, 
      setAvailabilities, 
      addAvailability, 
      updateAvailability, 
      deleteAvailability,
      unavailabilities,
      setUnavailabilities,
      addUnavailability,
      updateUnavailability,
      deleteUnavailability,
      loading, 
      error 
    }}>
      {children}
    </EmployeeContext.Provider>
    
  );
};

 
