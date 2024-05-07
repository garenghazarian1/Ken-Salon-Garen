import{ useEffect } from 'react';
import styles from './UserCard.module.css';
import { useAppointment } from '@/context/AppointmentContext'; 
import Image from 'next/image';

const UserCard = ({ session }) => {
    const { appointments, fetchUserAppointments,deleteAppointment, isLoading } = useAppointment();

    useEffect(() => {
        if (session?.user) {
            fetchUserAppointments(); 
        }
    }, [session, fetchUserAppointments]);

    if (!session) return <p>Please log in to continue.</p>;
    if (isLoading) return <p>Loading appointments...</p>;

    const handleDelete = (appointmentId) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            deleteAppointment(appointmentId);
        }
    };

    return (
        <div className={styles.card}>
            <Image src={session.user.image || '/default-profile.png'} alt={session.user.name} width={50} height={50} style={{ width: 'auto', height: 'auto' , borderRadius: "50%" }} />
            <div className={styles.userInfo}>
                <h3 className={styles.userName}>Welcome, {session.user.name}</h3>
                <ul className={styles.appointmentList}>
                    <h2>Your Appointments</h2>
                    {appointments.length > 0 ? (
                        appointments.map((appt, index) => (
                            <li key={index} className={styles.appointmentItem}>
                                Date: {appt.date} <br />
                                Time: {appt.startTime} - {appt.endTime} <br />
                                Employee: {appt.employee ? appt?.employee?.userInfo?.name : 'No Employee Assigned'} <br />
                                Services: {appt.services.map(service => `${service.title} : ${service.description} ${service.price} AED ${service.category}`).join(', ')} <br />
                                <button onClick={() => handleDelete(appt._id)} className={styles.deleteButton}>
                                   <span className={styles.deleteButtonText}>Delete Appointment</span> 
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className={styles.appointmentItem}>No appointments available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UserCard;
