"use client";
import { createContext, useContext, useState } from 'react';

const DateContext = createContext();

export const useDate = () => useContext(DateContext);

export const DateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());  // New state for time

  // Enhanced setDate function with logging
  const handleSetDate = (date) => {
    console.log("Date picked:", date.toLocaleDateString());
    setSelectedDate(date);
  };

  // New function to handle time selection
  const handleSetTime = (time) => {
    if (time) {
      console.log("Time picked:", time.toTimeString().substring(0, 5));
    }
    setSelectedTime(time);
  };

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate: handleSetDate, selectedTime, setSelectedTime: handleSetTime }}>
      {children}
    </DateContext.Provider>
  );
};
