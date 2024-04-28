import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import ReactDatePicker from 'react-datepicker';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-datepicker/dist/react-datepicker.css';
import { useDate } from '@/context/DateContext'; // Ensure correct path
import styles from './HorizontalCalendar.module.css';

const HorizontalCalendar = ({ startDate, numberOfDays }) => {
  const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = useDate();

  const days = Array.from({ length: numberOfDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date); 
  };

  const handleTimeChange = (time) => {
    if (time) {
      setSelectedTime(time); 
    }
  };

  return (
    <div className={styles.container}>
      <Swiper
        slidesPerView={6}
        spaceBetween={5}
        navigation
        pagination={{ clickable: true }}
        className={styles.swiper}
        breakpoints={{ 0: { slidesPerView: 4, }, 768: {slidesPerView: 6,}, 1024: { slidesPerView: 8, },  1280: { slidesPerView: 10, }, 1536: { slidesPerView: 12, }, }}
      >
        {days.map((day, index) => (
          <SwiperSlide key={index} onClick={() => handleDateClick(day)}>
            <div className={styles.slide}>
              {formatDate(day)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedDate && (
        <div className={styles.datePickerContainer}>
          <span className='mr-4 text-center'>Choose a time</span>
          <ReactDatePicker
            selected={selectedTime}
            onChange={handleTimeChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            className={styles.input}
          />
        </div>
      )}
    </div>
  );
}

export default HorizontalCalendar;
