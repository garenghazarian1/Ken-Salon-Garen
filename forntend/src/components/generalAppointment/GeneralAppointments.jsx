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
                        setAppointments(response.data.allAppointments);
                    } catch (err) {
                        setError(err.response ? err.response.data.message : err.message);
                    }
                } else {
                    // Redirect to home page or another page if the user is not an owner
                    router.push('/unauthorized');
                }
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            <ul className={styles.appointmentList}>
                {appointments.map((appointment) => (
                    <li key={appointment._id} className="mb-2 p-2 border-b">
                        <p><strong>User:</strong> {appointment.user.name}</p>
                        <p><strong>Employee:</strong> {appointment.employee.userInfo.name}</p>
                        <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Start Time:</strong> {appointment.startTime}</p>
                        <p><strong>End Time:</strong> {appointment.endTime}</p>
                        <p><strong>Status:</strong> {appointment.status}</p>
                        <p><strong>Services:</strong></p>
                        <ul className="ml-4 list-disc">
                            {appointment.services.map(service => (
                                <li key={service._id}>
                                    <p><strong>Title:</strong> {service.title}</p>
                                    <p><strong>Description:</strong> {service.description}</p>
                                    <p><strong>Duration:</strong> {service.duration} minutes</p>
                                    <p><strong>Price:</strong> {service.price} AED</p>
                                    <p><strong>Category:</strong> {service.category}</p>
                                    <p><strong>Section:</strong> {service.section}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
