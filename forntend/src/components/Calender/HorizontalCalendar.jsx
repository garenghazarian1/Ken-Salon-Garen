"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import ReactDatePicker from 'react-datepicker';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-datepicker/dist/react-datepicker.css';
import { useDate } from '@/context/DateContext'; 
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

  const isSelectedDay = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className={styles.container}>
      <h2 className='mr-4 text-center'>Select day</h2>
      <Swiper
        slidesPerView={6}
        spaceBetween={5}
        pagination={{ clickable: true }}
        className={styles.swiper}
        breakpoints={{
          0: { slidesPerView: 4 },
          768: { slidesPerView: 6 },
          1024: { slidesPerView: 8 },
          1280: { slidesPerView: 10 },
          1536: { slidesPerView: 12 },
        }}
      >
        
        {days.map((day, index) => (
          <SwiperSlide key={index} onClick={() => handleDateClick(day)}>
            <div className={`${styles.slide} ${isSelectedDay(day) ? styles.selected : ''}`}>
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
            onChange={(date) => setSelectedTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
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
