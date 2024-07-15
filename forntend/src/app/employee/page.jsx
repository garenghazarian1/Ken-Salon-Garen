"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports'; 
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './EmployeeAppointments.module.css';

function EmployeeAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      const fetchAppointments = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/appointments/employeeAppointments`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });

          const sortedAppointments = response.data.appointments.sort((a, b) => {
            const dateDiff = new Date(a.date) - new Date(b.date);
            if (dateDiff === 0) {
              return a.startTime.localeCompare(b.startTime);
            }
            return dateDiff;
          });

          setAppointments(sortedAppointments);
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
  }, [status, session]);

  const onChangeDate = (date) => {
    setSelectedDate(date);
  };

  const filteredAppointments = appointments.filter(appointment => 
    new Date(appointment.date).toDateString() === selectedDate.toDateString()
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Calendar onChange={onChangeDate} value={selectedDate} className={styles.calendar} />
      {filteredAppointments.length === 0 ? (
        <p>No appointments for the selected date.</p>
      ) : (
        filteredAppointments.map((appointment) => (
          <div key={appointment._id} className={styles.appointment}>
            <p><span className={styles.span}>Date: </span>{appointment.date}</p>
            <p><span className={styles.span}>Time: </span>{appointment.startTime} - {appointment.endTime}</p>
            <p><span className={styles.span}>Client: </span>{appointment.user?.name}</p>
            <p><span className={styles.span}>Phone Number: </span>{appointment.user?.phoneNumber}</p>
            <p><span className={styles.span}>Services: </span>
              {appointment.services.map(service => service.title).join(", ")}
            </p>
            <p><span className={styles.span}>Price: </span>
              {appointment.services.reduce((total, service) => total + service.price, 0).toFixed(2)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeAppointments;
