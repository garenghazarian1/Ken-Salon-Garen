// context/AppointmentContext.js
"use client"
import { createContext, useContext,  useCallback } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { baseUrl } from '@/api/ports';
import { DateTime } from 'luxon';

const AppointmentContext = createContext();

export const useAppointment = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const { data: session } = useSession();

  const bookAppointment = useCallback(async ({ currentStoreId, selectedServices, selectedEmployee, selectedDate, selectedTime }) => {
    const userId = session?.user?._id; 
    const serviceIds = Array.from(selectedServices);
    if (!selectedEmployee || serviceIds.length === 0 || !selectedDate || !selectedTime) {
      console.error('All fields must be selected.');
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

    const formattedDate = localDate.toISODate(); // Returns 'YYYY-MM-DD'
    const formattedStartTime = localDate.toFormat('HH:mm'); // Returns 'HH:MM'

    try {
      const response = await axios.post(`${baseUrl}/api/appointments`, {
        user: userId,
        storeId: currentStoreId,
        employee: selectedEmployee,
        services: serviceIds,
        date: formattedDate, 
        startTime: formattedStartTime 
      });
      console.log('Appointment booked successfully:', response.data);
    } catch (error) {
      console.error('Error booking appointment:', error.response ? error.response.data : error.message);
    }
  }, [session]);

  return (
    <AppointmentContext.Provider value={{ bookAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};
