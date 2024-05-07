"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports'; 
import { useSession } from 'next-auth/react';

function EmployeeAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session,  status } = useSession();
  // console.log("🚀 ~ EmployeeAppointments ~ session:", session)

  useEffect(() => {
    if (status === "authenticated" && session) {
      const fetchAppointments = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/appointments/employeeAppointments`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });
          setAppointments(response.data.appointments);
          setIsLoading(false);
        } catch (err) {
          setError(err.response ? err.response.data.message : err.message);
          setIsLoading(false);
        }
      };
      fetchAppointments();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setError("Session not active. Please log in.");
    }
  }, [status, session]); // Ensure status and session are dependencies here
  

  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="p-4 border shadow rounded-lg">
          <h2 className="text-lg font-bold">Appointment with {appointment.user.name}</h2>
          <p>Date: {appointment.date}</p>
          <p>Time: {appointment.startTime} - {appointment.endTime}</p>
          <div className="mt-2">
            <h3 className="text-md font-semibold">Services:</h3>
            {appointment.services.map((service) => (
              <p key={service._id}>{service.title} - ${service.price}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmployeeAppointments;
