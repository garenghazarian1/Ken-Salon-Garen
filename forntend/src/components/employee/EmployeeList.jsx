"use client"
// components/EmployeeList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEmployee } from '@/context/EmployeeContext';
import AvailabilityManager from '@/components/employee/AvailabilityManager';
import UnavailabilityManager from '@/components/employee/UnavailabilityManager';

const button = " flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:bg-gray-400"

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const { setEmployeeId, setSelectedEmployeeId } = useEmployee();
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedEmployeeForAvailability, setSelectedEmployeeForAvailability] = useState(null);
  const [selectedEmployeeForUnavailability, setSelectedEmployeeForUnavailability] = useState(null);
  

  useEffect(() => {
    const getEmployees = async () => {
      if (!session) {
        console.log("No session found. User might not be logged in.");
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/api/employees`, {
          headers: {
            
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        //console.log("🚀 ~ getEmployees ~ response:", response)
        setEmployees(response.data);
      } catch (err) {
        setError('Failed to fetch employees');
        console.error(err);
      }
    };

    if (session) {
      getEmployees();
    }
  }, [session]);


  const handleDeleteEmployee = async (employeeId) => {
    const confirmDelete = confirm('Are you sure you want to delete this employee? This action will revert their role back to user.');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseUrl}/api/employees/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      setEmployees(employees.filter(employee => employee._id !== employeeId));
      alert('Employee deleted successfully and their role reverted to user.');
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  };

  const handleUpdateEmployee = (employeeId) => {
    setEmployeeId(employeeId);
    router.push(`/superuser`);
  };

  const handleManageAvailabilities = (employeeId) => {
    setSelectedEmployeeId(employeeId); // Update selected employee ID in the context
    setSelectedEmployeeForAvailability(employeeId); // Update local state for UI control
  };

  const handleManageUnavailabilities = (employeeId) => {
    setSelectedEmployeeId(employeeId); // Update selected employee ID in the context for unavailabilities
    setSelectedEmployeeForUnavailability(employeeId); // Update local state for UI control
  };


  if (error) return <div>{error}</div>;

  // Function to toggle the visibility of the employee list
  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  return (
    <div>
     
      <h2 onClick={toggleListVisibility} className={button}>Employee List</h2>
      {isListVisible && (
        <ul>
          {employees.map((employee) => (
            <li key={employee._id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  {employee.userInfo ? (
                    <>
                      <span className="font-bold">{employee.userInfo.name}</span> - 
                      <span className="font-bold">{employee.store.name}</span> -
                      <span> {employee.sections?.join(', ') || 'No sections assigned'}</span>
                    </>
                  ) : 'User info not available'}
                </div>
                <div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpdateEmployee(employee._id); }} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Update
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(employee._id); }} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleManageAvailabilities(employee._id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Manage Availabilities
              </button>
              {selectedEmployeeForAvailability === employee._id && <AvailabilityManager />}
              <button
                onClick={() => handleManageUnavailabilities(employee._id)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Manage Unavailabilities
              </button>
              {/* Render UnavailabilityManager for the selected employee */}
              {selectedEmployeeForUnavailability === employee._id && <UnavailabilityManager />}
             
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
