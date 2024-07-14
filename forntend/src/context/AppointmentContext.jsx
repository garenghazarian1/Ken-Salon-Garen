"use client"
import { createContext, useContext, useState, useCallback,  } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { baseUrl } from '@/api/ports';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AppointmentContext = createContext();

export const useAppointment = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
    const { data: session } = useSession();
    const [bookingStatus, setBookingStatus] = useState({ error: '', success: '' });
    const [appointments, setAppointments] = useState([]);
    const router = useRouter();

    const fetchAppointments = useCallback(async () => {
        if (!session?.user) {
            setBookingStatus({ error: 'Not authenticated', success: '' });
            return;
        }
        try {
            const response = await axios.get(`${baseUrl}/api/appointments/allAppointments`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            });
            //console.log("Fetched All Appointments:", response.data.allAppointments);
            if (response.data.success) {
                setAppointments(response.data.allAppointments);
            } else {
                throw new Error(response.data.message);
            }
    
        } catch (error) {
            console.error('Failed to fetch all appointments:', error);
            setBookingStatus({ error: error.response ? error.response.data.message : error.message, success: '' });
        }
    }, [session]);

    const bookAppointment = useCallback(async ({ currentStoreId, selectedServices, selectedEmployee, selectedDate, selectedTime, phoneNumber, comment  }) => {
        const userId = session?.user?._id;
        const serviceIds = Array.from(selectedServices);
        if (!selectedEmployee || serviceIds.length === 0 || !selectedDate || !selectedTime) {
            const errorMessage = 'All fields must be selected.';
            //console.error(errorMessage);  // Log error to console
            setBookingStatus({ error: errorMessage, success: '' });
            return;
        }
        
        const localDate = DateTime.fromJSDate(new Date(selectedDate))
            .setZone('Asia/Dubai')
            .set({
                hour: selectedTime.getHours(),
                minute: selectedTime.getMinutes(),
                second: 0,
                millisecond: 0
            });

        const formattedDate = localDate.toISODate();  // Returns 'YYYY-MM-DD'
        const formattedStartTime = localDate.toFormat('HH:mm');  // Returns 'HH:MM'

        try {
            const response = await axios.post(`${baseUrl}/api/appointments`, {
                user: userId,
                storeId: currentStoreId,
                employee: selectedEmployee,
                services: serviceIds,
                date: formattedDate,
                startTime: formattedStartTime,
                phoneNumber,  // Include phoneNumber in the request body
                comment      // Include comment in the request body
            });

            if (response.data.success) {
                //console.log('Appointment booked successfully:', response.data); 
                fetchAppointments();
                setBookingStatus({ success: response.data.message, error: '' });
                toast.success("Congratulations! Appointment booked successfully.");
                router.push('/user');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error booking appointment:', error.response ? error.response.data.message : error.message);  // Log error to console
            setBookingStatus({ error: error.response ? error.response.data.message : error.message, success: '' });
        }
    }, [session, fetchAppointments, router]);


    


    const fetchUserAppointments = useCallback(async () => {
        if (!session?.user) {
            setBookingStatus({ error: 'Not authenticated', success: '' });
            return;
        }
    
        try {
            const response = await axios.get(`${baseUrl}/api/appointments/myAppointments`, {
                headers: {
                    
                    Authorization: `Bearer ${session.accessToken}` 
                }
            });
            //console.log("🚀 ~ fetchUserAppointments ~ response:", response.data)
            if (response.data.success) {
                setAppointments(response.data.appointments); 
            } else {
                throw new Error(response.data.message);
            }
            
        } catch (error) {
            console.error('Failed to fetch user appointments:', error);
            setBookingStatus({ error: error.response ? error.response.data.message : error.message, success: '' });
        }
    }, [session]);


    const deleteAppointment = useCallback(async (appointmentId) => {
        try {
            const response = await axios.delete(`${baseUrl}/api/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${session.accessToken}` }
            });
            if (response.data.success) {
                setAppointments(prevAppointments => prevAppointments.filter(appt => appt._id !== appointmentId));
                alert("Appointment deleted successfully");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Failed to delete the appointment:', error);
            alert("Failed to delete the appointment");
        }
    }, [session]);
      

    

    return (
        <AppointmentContext.Provider value={{ bookAppointment, fetchAppointments, fetchUserAppointments, bookingStatus, appointments, setAppointments, deleteAppointment,   }}>
            {children}
            <ToastContainer />
        </AppointmentContext.Provider>
    );
    
};
