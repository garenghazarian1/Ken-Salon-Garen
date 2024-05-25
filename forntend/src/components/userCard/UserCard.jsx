import { useEffect } from 'react';
import styles from './UserCard.module.css';
import { useAppointment } from '@/context/AppointmentContext'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';  // Corrected from 'next/navigation'
import LoadingSkeleton from '../loading/LoadingSkeleton';
import Link from 'next/link';

const UserCard = ({ session }) => {
    const { appointments, fetchUserAppointments, deleteAppointment, isLoading } = useAppointment();
    const router = useRouter();

    useEffect(() => {
    
        if (session?.user) {
            fetchUserAppointments(); 
        }
    }, [session, fetchUserAppointments]);

    useEffect(() => {
        // Redirect if not logged in
        if (!session) {
          router.push('/');
        }
    }, [session, router]);

    if (isLoading) return <LoadingSkeleton />;

    const handleDelete = (appointmentId) => {
        // Confirm before deleting an appointment
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            deleteAppointment(appointmentId);
        }
    };

    return (
        <div className={styles.card}>
            <Image 
                src={session?.user?.image || '/logo01.png'} 
                alt={session?.user?.name } 
                width={50} 
                height={50} 
                style={{ borderRadius: "50%" }} 
                layout="fixed"
            />
            <div className={styles.userInfo}>
                <h3 className={styles.userName}>Welcome, {session?.user?.name}</h3>
                {session?.user?.role === 'employee' && (
                    <Link href="/employee" className={styles.employeeLink}>
                        Employee Dashboard
                    </Link>
                )}
                {session?.user?.role === 'owner' && (
                    <Link href="/generalAppointmentControl" className={styles.ownerLink}>
                        General Appointment Control
                    </Link>
                )}
                <ul className={styles.appointmentList}>
                    <h2>Your Appointments</h2>
                    {appointments.length > 0 ? (
                        appointments.map((appt, index) => (
                            <li key={index} className={styles.appointmentItem}>
                                Date: {appt.date} <br />
                                Time: {appt.startTime} - {appt.endTime} <br />
                                Employee: {appt.employee ? appt?.employee?.userInfo?.name : 'No Employee Assigned'} <br />
                                Services: {appt.services.map(service => `${service.title}: ${service.description} ${service.price} AED, ${service.category}`).join(', ')} <br />
                                <button onClick={() => handleDelete(appt._id)} className={styles.deleteButton}>
                                    Delete Appointment
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>No appointments available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UserCard;
