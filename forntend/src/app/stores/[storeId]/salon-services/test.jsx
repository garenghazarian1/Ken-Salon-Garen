"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from "@/context/StoreContext";
import { useService } from "@/context/ServiceContext";
import { useEmployee } from "@/context/EmployeeContext";
import { useSession } from 'next-auth/react';
import { useDate } from '@/context/DateContext';
import { useAppointment } from '@/context/AppointmentContext';
import Basket from "@/components/basket/Basket";
import HorizontalCalendar from '@/components/Calender/HorizontalCalendar';
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ServicesPage = () => {
  const { currentStoreId } = useStore();
  const { services, activeSection, loading: servicesLoading, error: servicesError } = useService();
  const { employees, loading: employeesLoading, error: employeesError } = useEmployee();
  const { selectedDate, selectedTime } = useDate();
  const { bookAppointment } = useAppointment();
  const [groupedServices, setGroupedServices] = useState({});
  const [sectionEmployees, setSectionEmployees] = useState({});
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { data: session, status: sessionStatus } = useSession();

  // Grouping services by section and category
  useEffect(() => {
    if (activeSection) {
      const grouped = services.reduce((acc, service) => {
        if (service.section === activeSection) { // Filter services by active section
          const category = service.category || 'Other';
          acc[category] = acc[category] || [];
          acc[category].push(service);
        }
        return acc;
      }, {});
      setGroupedServices(grouped);
    } else {
      setGroupedServices({});
    }
  }, [services, activeSection]);

  // Grouping employees by section
  useEffect(() => {
    if (activeSection) {
      const filteredEmployees = employees.filter(employee => employee.sections.includes(activeSection));
      setSectionEmployees({ [activeSection]: filteredEmployees });
    } else {
      setSectionEmployees({});
    }
  }, [employees, activeSection]);

  // Handle service selection changes
  const handleServiceSelectionChange = (serviceId) => {
    const updatedSelection = new Set(selectedServices);
    if (updatedSelection.has(serviceId)) {
      updatedSelection.delete(serviceId);
    } else {
      updatedSelection.add(serviceId);
    }
    setSelectedServices(updatedSelection);
  };


  // Handle booking an appointment
  const handleBooking = () => {
    bookAppointment({
      currentStoreId,
      selectedServices,
      selectedEmployee,
      selectedDate,
      selectedTime
    });
   
  };

  // Remove service from the basket
  const removeServiceFromBasket = (serviceId) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(serviceId);
      return newSelection;
    });
  };

  // // Handle employee selection
  // const handleEmployeeSelection = (employeeId) => {
  //   setSelectedEmployee(employeeId);
  // };

  // Handle loading and error states
  if (!currentStoreId) return <p>Please select a store to view its services.</p>;
  if (sessionStatus === "loading") return <p>Loading session...</p>;
  if (servicesLoading || employeesLoading) return <p>Loading...</p>;
  if (servicesError) return <p className="text-red-500">Error loading services: {servicesError.message}</p>;
  if (employeesError) return <p className="text-red-500">Error loading employees: {employeesError.message}</p>;

  return (
    <div className="mt-4 flex flex-col items-start justify-start w-full border rounded-lg">
      <h1 className="text-3xl font-bold ml-8 mt-4 text-green-600">Our Services</h1>
      
      <div className='flex flex-col justify-between items-start w-full'>
        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category} className=" ml-8 mt-4 w-full">
            <h2 className="text-lg font-semibold mb-4">{category}</h2>
            <Swiper spaceBetween={10} slidesPerView={5} navigation pagination={{ clickable: true }} breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 5 },
                    660: { slidesPerView: 2, spaceBetween: 10 },
                    1024: { slidesPerView: 3, spaceBetween: 10 },
                    1440: { slidesPerView: 5, spaceBetween: 10 }
                  }}
                  >
              {services.map((service) => (
                <SwiperSlide key={service._id}>
                  <div className="bg-gray-900 hover:scale-105 duration-300 ease-in-out p-2 rounded-lg relative min-w-[300px] h-auto m-4">
                    <div className="cursor-pointer w-full">
                      <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                      <p className="mb-2">{service.description}</p>
                      <p className="mb-2">Duration: {service.duration} minutes</p>
                      <p className="mb-2">Price: AED {service.price}</p>
                      <button
                        className={`p-3 text-sm font-semibold tracking-wider uppercase shadow-lg transition-all duration-300 ease-linear
                        ${selectedServices.has(service._id) ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}
                        rounded-full focus:outline-none focus:ring-4 focus:ring-offset-2
                        ${selectedServices.has(service._id) ? 'focus:ring-red-300' : 'focus:ring-green-300'} 
                        transform hover:scale-105`}
                        onClick={() => handleServiceSelectionChange(service._id)}
                      >
                        {selectedServices.has(service._id) ? 'Deselect' : 'Select'}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
        <HorizontalCalendar startDate={new Date()} numberOfDays={30} />
        <Basket selectedServices={selectedServices} services={services} onRemoveService={removeServiceFromBasket} />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto my-4"
          onClick={handleBooking}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default ServicesPage;
