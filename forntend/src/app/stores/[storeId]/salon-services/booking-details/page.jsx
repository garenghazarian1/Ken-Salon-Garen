"use client"
import { useState, useEffect, useRef  } from 'react';
import { useStore } from "@/context/StoreContext";
import { useService } from "@/context/ServiceContext";
import { useEmployee } from "@/context/EmployeeContext";
import { useSession } from 'next-auth/react';
import { useDate } from '@/context/DateContext';
import { useAppointment } from '@/context/AppointmentContext';
import Basket from "@/components/basket/Basket";
import HorizontalCalendar from '@/components/Calender/HorizontalCalendar';
import styles from './BookingPage.module.css';
import Image from 'next/image';
import Link from 'next/link';

const BookingPage = () => {
    const { currentStoreId } = useStore();
    const { services, selectedServices, setSelectedServices, activeSection } = useService();
    const { employees } = useEmployee();
    const { selectedDate, selectedTime } = useDate();
    const { bookAppointment, bookingStatus, fetchEmployeeAvailability } = useAppointment(); // Import fetchEmployeeAvailability
    const { data: session, status: sessionStatus } = useSession();
    const [sectionEmployees, setSectionEmployees] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeAvailability, setEmployeeAvailability] = useState({});
    const [formErrors, setFormErrors] = useState('');
    const confirmButtonRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comment, setComment] = useState(''); 
    
    

    useEffect(() => {
        if (activeSection) {
            const filteredEmployees = employees.filter(emp =>
                emp.sections.includes(activeSection)
            );
            setSectionEmployees({[activeSection]: filteredEmployees});
        } else {
            setSectionEmployees({});
        }
    }, [employees, activeSection]);



    const handleEmployeeSelection = (employeeId) => {
        setSelectedEmployee(employeeId);
        confirmButtonRef.current?.focus();
    };

    

    const handleBooking = () => {
        let errors = [];
    
        if (!currentStoreId) errors.push("Store is not selected.");
        if (selectedServices.size === 0) errors.push("No services selected.");
        if (!selectedEmployee) errors.push("Employee is not selected.");
        if (!selectedDate) errors.push("Date is not selected.");
        if (!selectedTime) errors.push("Time is not selected.");
    
        
        if (errors.length > 0) {
            setFormErrors(errors.join(" ")); // Joins all error messages into a single string
            return;
        }
    
        setFormErrors(''); // Clear previous errors
        bookAppointment({
            currentStoreId,
            selectedServices: Array.from(selectedServices),
            selectedEmployee,
            selectedDate,
            selectedTime,
            phoneNumber, // Include phoneNumber in booking data
            comment // Include comment in booking data
        });
    };

    const removeServiceFromBasket = (serviceId) => {
        setSelectedServices(prev => new Set([...prev].filter(id => id !== serviceId)));
    };

    if (sessionStatus === "loading") return <p>Loading session...</p>;
    if (!session) return <p className={styles.title}>Please log in to continue. <Link className={styles.linkButton} href="/login">Log in</Link></p>;
    if (!currentStoreId) return <p>Please select a store first.</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Booking Page</h1>
            <HorizontalCalendar startDate={new Date()} numberOfDays={30} />
            <div className={styles.employeeContainer}>
            <p className={styles.text}>Select Employee</p>
            {Object.entries(sectionEmployees).map(([section, sectionEmps]) => (
                <div key={section} className={styles.section}>
                    <div className={styles.flexContainer}>
                        {sectionEmps.map(employee => (
                            <div key={employee._id}
                                 className={`${styles.employee} ${selectedEmployee === employee._id ? styles.selected : ''}`}
                                 onClick={() => handleEmployeeSelection(employee._id)}>
                                <Image src={employee.userInfo.image} alt={employee.userInfo.name} width={100} height={100} style={{ width: 'auto', height: 'auto' }} className={styles.image} />
                                <p >{employee.userInfo.name}</p>
                                
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            </div>
            <Basket selectedServices={selectedServices} services={services} onRemoveService={removeServiceFromBasket} />
            <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input 
                    type="text" 
                    id="phoneNumber" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    placeholder='Add your phone number to get latest information about your services'
                    className={styles.inputField}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="comment">Comment</label>
                <textarea 
                    id="comment" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    className={styles.textareaField}
                />
            </div>
            <button ref={confirmButtonRef} onClick={handleBooking} className={styles.linkButton}>
                Confirm Booking
            </button>
            {formErrors && <div className={`${styles.alert} ${styles.alertDanger}`}>{formErrors}</div>}
            {bookingStatus.error && <div className={`${styles.alert} ${styles.alertDanger}`}>{bookingStatus.error}</div>}
            {bookingStatus.success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{bookingStatus.success} </div>}
        </div>
    );
};

export default BookingPage;
