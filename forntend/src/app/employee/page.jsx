"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports'; 
import { useSession } from 'next-auth/react';
import styles from './EmployeeAppointments.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function EmployeeAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [groupingType, setGroupingType] = useState('day'); // can be 'day', 'week', 'month'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session,  status } = useSession();

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
          groupAppointments(sortedAppointments, groupingType);
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
  }, [status, session, groupingType]);

  // Function to group appointments
  const groupAppointments = (appointments, type) => {
    const groups = appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.date);
      let key;
      switch (type) {
        case 'week':
          const startOfWeek = date.getDate() - date.getDay();
          key = new Date(date.setDate(startOfWeek)).toDateString();
          break;
        case 'month':
          key = `${date.getMonth() + 1}-${date.getFullYear()}`;
          break;
        default:
          key = date.toDateString();
          break;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(appointment);
      return acc;
    }, {});

    setGroupedAppointments(groups);
  };

  // Function to handle group type change
  const handleGroupTypeChange = (type) => {
    setGroupingType(type);
    groupAppointments(appointments, type);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className={styles.buttonGroup}>
    <button onClick={() => handleGroupTypeChange('day')} className={styles.button}>Day</button>
    <button onClick={() => handleGroupTypeChange('week')} className={styles.button}>Week</button>
    <button onClick={() => handleGroupTypeChange('month')} className={styles.button}>Month</button>
</div>
<Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
      {Object.entries(groupedAppointments).map(([key, group]) => (
         <SwiperSlide key={key}>
        <div key={key} className={styles.table}>
          <h3>{key}</h3>
          <table className={styles.table}>
           
            <tbody>
              {group.map((appointment) => (
                <tr key={appointment._id} className={styles.tr}>
                  <td className={styles.td}> <span className={styles.span} >Date: </span>{appointment.date}</td>
                  <td className={styles.td}><span className={styles.span}>Time: </span>{appointment.startTime} - {appointment.endTime}</td>
                  <td className={styles.td}><span className={styles.span}>Client: </span>{appointment.user?.name}</td>
                  <td className={styles.td}><span className={styles.span}>Phone Number: </span>{appointment.user?.phoneNumber}</td>
                  <td className={styles.td}><span className={styles.span}>Services: </span>
                    {appointment.services.map(service => service.title).join(", ")}
                  </td>
                  <td className={styles.td}><span className={styles.span}>Price: </span>
                    {appointment.services.reduce((total, service) => total + service.price, 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </SwiperSlide>
      ))}
      </Swiper>
    </>
  );
}

export default EmployeeAppointments;
