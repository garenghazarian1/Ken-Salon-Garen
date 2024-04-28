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
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ServicesPage = () => {
   // Use context to get store, services, and employees
  const { currentStoreId } = useStore();
  const { services, loading: servicesLoading, error: servicesError } = useService();
  const { employees, loading: employeesLoading, error: employeesError } = useEmployee();
  // State for handling selections and grouping
  const { selectedDate, setSelectedDate: handleSetDate, selectedTime, setSelectedTime: handleSetTime } = useDate();
  const { bookAppointment } = useAppointment();
  const [groupedServices, setGroupedServices] = useState({});
  const [sectionEmployees, setSectionEmployees] = useState({});
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { data: session, status: sessionStatus  } = useSession();

  // Effect for grouping services by section and category
  useEffect(() => {
    const grouped = services.reduce((acc, service) => {
      const section = service.section || 'Other';
      acc[section] = acc[section] || {};
      const category = service.category || 'Other';
      acc[section][category] = acc[section][category] || [];
      acc[section][category].push(service);
      return acc;
    }, {});
    setGroupedServices(grouped);
  }, [services]);

  // Effect for grouping employees by section
  useEffect(() => {
    const employeesBySection = employees.reduce((acc, employee) => {
      employee.sections.forEach(section => {
        acc[section] = acc[section] || [];
        acc[section].push(employee);
      });
      return acc;
    }, {});
    setSectionEmployees(employeesBySection);
  }, [employees]);

 // Handlers for selecting and deselecting services
  const handleServiceSelectionChange = (serviceId) => {
    const updatedSelection = new Set(selectedServices);
    if (updatedSelection.has(serviceId)) {
      updatedSelection.delete(serviceId);
    } else {
      updatedSelection.add(serviceId);
    }
    setSelectedServices(updatedSelection);
    console.log("Updated Selection:", Array.from(updatedSelection));
    // Added session check to safely log user ID and email
    if (session) {  
      console.log("User ID:", session?.user?._id , "User:", session.user.email, "Selected Services:", Array.from(updatedSelection));
    }
  };

  const handleBooking = () => {
    bookAppointment({
      currentStoreId,
      selectedServices,
      selectedEmployee,
      selectedDate,
      selectedTime
    });
  };

  // Loading and error handling
  if (!currentStoreId) return <p>Please select a store to view its services.</p>;
  if (sessionStatus === "loading") return <p>Loading session...</p>; // Handling session loading state
  //if (!session) return <p>Please log in to manage services.</p>; // Ensure the user is logged in
  if (servicesLoading || employeesLoading) return <p>Loading...</p>;
  if (servicesError) return <p className="text-red-500">Error loading services: {servicesError.message}</p>;
  if (employeesError) return <p className="text-red-500">Error loading employees: {employeesError.message}</p>;

  const removeServiceFromBasket = (serviceId) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(serviceId);
      return newSelection;
    });
  };

  const handleEmployeeSelection = (employeeId) => {
    console.log("Employee picked:", employeeId);  // Log the employee ID
    setSelectedEmployee(employeeId);  // Update state
  };

 // Function to handle section toggle
 const toggleSection = (section) => {
  setActiveSection(prevSection => prevSection === section ? null : section);
};

return (
  <div className="mt-4 flex flex-col items-start justify-start w-full border rounded-lg">
    <h1 className="text-3xl font-bold ml-8 mt-4 text-green-600">Our Services</h1>
    <div className='flex flex-col justify-between items-start w-full'>
      {Object.entries(groupedServices).map(([section, categories]) => (
        <div key={section} className="flex flex-col items-start justify-start ml-8 mt-4 w-full">
          
          
            <h2 className="kaushan-script-regular text-xl font-bold mb-4 cursor-pointer hover:text-green-500 hover:scale-150 duration-300 ease-in-out" onClick={() => toggleSection(section)}>
              {section}
            </h2>
                     
          {activeSection === section && (
            <>
              <div className="flex flex-row flex-wrap justify-start items-start">
                {sectionEmployees[section]?.map((employee) => (
                  <div
                    key={employee._id}
                    className={`flex items-center p-1 rounded-lg cursor-pointer ${selectedEmployee === employee._id ? 'bg-green-500 text-white' : ' hover:bg-gray-400'}`}
                    onClick={() => handleEmployeeSelection(employee._id)}
                    style={{ transition: 'background-color 0.3s ease-in-out' }}
                  >
                    <img src={employee.userInfo.image} alt={employee.userInfo.name} style={{ width: 50, height: 50, borderRadius: '50%' }} />
                    <div className="ml-4">
                      <p className="font-bold">{employee.userInfo.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(categories).map((category) => (
                <div key={category} className="mb-8 w-full">
                  <h3 className="text-lg font-semibold mb-4">{category}</h3>
                  <Swiper spaceBetween={10} slidesPerView={5} navigation pagination={{ clickable: true }} breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 5 },
                    660: { slidesPerView: 2, spaceBetween: 10 },
                    1024: { slidesPerView: 3, spaceBetween: 10 },
                    1440: { slidesPerView: 5, spaceBetween: 10 }
                  }}
                  >
                    {categories[category].map((service) => (
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
                          <div className="mt-2">
                            <Link className="text-blue-500 hover:underline" href={`/stores/${currentStoreId}/salon-services/${service._id}`}>
                              Learn more
                            </Link>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
      <HorizontalCalendar startDate={new Date()} numberOfDays={30} />
      <div>
        <Basket selectedServices={selectedServices} services={services} onRemoveService={removeServiceFromBasket} />
      </div>
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

