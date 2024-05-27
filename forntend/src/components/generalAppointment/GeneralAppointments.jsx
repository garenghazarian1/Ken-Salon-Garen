"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { baseUrl } from '@/api/ports'; 
import { useSession } from 'next-auth/react';
import styles from "./GeneralAppointments.module.css"

export default function GeneralAppointments() {
    const { data: session, status } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [groupedAppointments, setGroupedAppointments] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAppointments = async () => {
            if (status === "authenticated") {
                if (session.user.role === "owner") {
                    try {
                        const response = await axios.get(`${baseUrl}/api/appointments/allAppointments/`, {
                            headers: {
                                Authorization: `Bearer ${session.accessToken}`
                            }
                        });
                        const appointments = response.data.allAppointments;
                        setAppointments(appointments);
                        groupAppointmentsByDateAndEmployee(appointments);
                    } catch (err) {
                        setError(err.response ? err.response.data.message : err.message);
                    }
                } else {
                    // Redirect to home page or another page if the user is not an owner
                    router.push('/');
                }
            }
        };

        const groupAppointmentsByDateAndEmployee = (appointments) => {
            const grouped = appointments.reduce((acc, appointment) => {
                const date = new Date(appointment.date).toLocaleDateString();
                const employee = appointment.employee.userInfo.name;
                if (!acc[date]) acc[date] = {};
                if (!acc[date][employee]) acc[date][employee] = [];
                acc[date][employee].push(appointment);
                return acc;
            }, {});
            setGroupedAppointments(grouped);
            const firstDate = Object.keys(grouped)[0];
            setSelectedDate(firstDate);
            if (grouped[firstDate]) {
                setSelectedEmployee(Object.keys(grouped[firstDate])[0]);
            }
        };

        fetchAppointments();
    }, [status, session]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Appointments</h1>
            <div className={styles.dateList}>
                {Object.keys(groupedAppointments).map(date => (
                    <div
                        key={date}
                        className={`${styles.dateItem} ${selectedDate === date ? styles.selectedDate : ''}`}
                        onClick={() => {
                            setSelectedDate(date);
                            setSelectedEmployee(Object.keys(groupedAppointments[date])[0]);
                        }}
                    >
                        {date}
                    </div>
                ))}
            </div>
            {selectedDate && (
                <div className={styles.employeeList}>
                    {Object.keys(groupedAppointments[selectedDate]).map(employee => (
                        <div
                            key={employee}
                            className={`${styles.employeeItem} ${selectedEmployee === employee ? styles.selectedEmployee : ''}`}
                            onClick={() => setSelectedEmployee(employee)}
                        >
                            {employee}
                        </div>
                    ))}
                </div>
            )}
            {selectedDate && selectedEmployee && (
                <ul className={styles.appointmentList}>
                    {groupedAppointments[selectedDate][selectedEmployee]?.map((appointment) => (
                        <li key={appointment._id} className={styles.appointmentItem}>
                            <p><strong>Employee:</strong> {appointment.employee.userInfo.name}</p>
                            <p><strong>User:</strong> {appointment.user.name}</p>
                            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                            <p><strong>Start Time:</strong> {appointment.startTime}</p>
                            <p><strong>End Time:</strong> {appointment.endTime}</p>
                            <p><strong>Services:</strong></p>
                            <ul className={styles.serviceList}>
                                {appointment.services.map(service => (
                                    <li key={service._id}>
                                        <p className={styles.serviceDetails}><strong>Section:</strong> {service.section}</p>
                                        <p className={styles.serviceDetails}><strong>Category:</strong> {service.category}</p>
                                        <p className={styles.serviceDetails}><strong>Title:</strong> {service.title}</p>
                                        <p className={styles.serviceDetails}><strong>Price:</strong> {service.price} AED</p>   
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}



// return (
//     <div className={styles.container}>
//     <h1 className={styles.header}>Appointments</h1>
//     <div className={styles.dateList}>
//             {Object.keys(groupedAppointments).map(date => (
//                 <div
//                     key={date}
//                     className={`${styles.dateItem} ${selectedDate === date ? styles.selectedDate : ''}`}
//                     onClick={() => setSelectedDate(date)}
//                 >
//                     {date}
//                 </div>
//             ))}
//         </div>
//         <ul className={styles.appointmentList}>
//             {groupedAppointments[selectedDate]?.map((appointment) => (
//                 <li key={appointment._id} className={styles.appointmentItem}>
//                 <p><strong>Employee:</strong> {appointment.employee.userInfo.name}</p>
//                 <p><strong>User:</strong> {appointment.user.name}</p>
//                 <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
//                 <p><strong>Start Time:</strong> {appointment.startTime}</p>
//                 <p><strong>End Time:</strong> {appointment.endTime}</p>
//                 {/* <p><strong>Status:</strong> {appointment.status}</p> */}
//                 <p><strong>Services:</strong></p>
//                 <ul className={styles.serviceList}>
//                     {appointment.services.map(service => (
//                         <li key={service._id}>
//                             <p className={styles.serviceDetails}><strong>Section:</strong> {service.section}</p>
//                             <p className={styles.serviceDetails}><strong>Category:</strong> {service.category}</p>
//                             <p className={styles.serviceDetails}><strong>Title:</strong> {service.title}</p>
//                             {/* <p className={styles.serviceDetails}><strong>Description:</strong> {service.description}</p> */}
//                             {/* <p className={styles.serviceDetails}><strong>Duration:</strong> {service.duration} minutes</p> */}
//                             <p className={styles.serviceDetails}><strong>Price:</strong> {service.price} AED</p>   
//                         </li>
//                     ))}
//                 </ul>
//             </li>
//         ))}
//     </ul>
// </div>
// );
// }
