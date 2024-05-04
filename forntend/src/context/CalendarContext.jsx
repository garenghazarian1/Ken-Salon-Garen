// import { useCalendar } from './path/to/CalendarContext';

// function SomeComponent() {
//   const { selectedDate, setSelectedDate, timeSlots, generateTimeSlots } = useCalendar();

"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
//import servicesForMen from '@/libServices/servicesForHim';

const CalendarContext = createContext();

export function useCalendar() {
  return useContext(CalendarContext);
}


export const CalendarProvider = ({ children }) => {
    
        const [selectedDate, setSelectedDate] = useState(null);
        const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
        const [timeSlots, setTimeSlots] = useState([]);
        const [selectedService, setSelectedService] = useState([]);
        const [bookedAppointments, setBookedAppointments] = useState([]);

//FETCH BOOKED APPOINTMENTS********************

        const fetchBookedAppointments = async (date) => {
            try {
              const formattedDate = date.toISOString().split('T')[0];
              // Update the URL to match the endpoint
              const response = await axios.get(`http://localhost:5000/api/appointments/byDate?date=${formattedDate}`);
              setBookedAppointments(response.data.appointments); // Adjust according to your response structure
            } catch (error) {
              console.error('Error fetching booked appointments:', error);
            }
          };

//GENERATE TIME SLOTS********************

          const generateTimeSlots = (date) => {
            const slots = [];
            const slotDuration = 60; // minutes, assuming each slot is 1 hour
            for (let hour = 10; hour < 22; hour++) {
              const startTime = new Date(date);
              startTime.setHours(hour, 0, 0, 0);
              const endTime = new Date(startTime.getTime() + slotDuration * 60000);
              const isReserved = bookedAppointments.some(appointment => {
                const appointmentTime = new Date(appointment.date + 'T' + appointment.slot); // Assuming the slot is stored in 'HH:MM' format
                return appointmentTime.getTime() === startTime.getTime();
              });
          
              slots.push({
                startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isReserved,
              });
            }
            setTimeSlots(slots);
          };

          useEffect(() => {
            if (selectedDate) {
              generateTimeSlots(selectedDate);
            }
          }, [selectedDate, generateTimeSlots]);

          return (
            <CalendarContext.Provider
              value={{
                selectedDate,
                setSelectedDate,
                selectedSlotIndex,
                setSelectedSlotIndex,
                timeSlots,
                setTimeSlots,
                selectedService,
                setSelectedService,
                bookedAppointments,
                setBookedAppointments,
               // servicesForMen, // Provided here for easy access, assuming it's static data
                fetchBookedAppointments,
                generateTimeSlots,
              }}
            >
              {children}
            </CalendarContext.Provider>
          );
        }
    
