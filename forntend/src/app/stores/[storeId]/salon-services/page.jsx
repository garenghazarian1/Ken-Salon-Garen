"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from "@/context/StoreContext";
import { useService } from "@/context/ServiceContext";
import { useSession } from 'next-auth/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styles from './ServicesPage.module.css';

const ServicesPage = () => {
  const { currentStoreId } = useStore();
  const { services, activeSection, loading: servicesLoading, error: servicesError } = useService();
  const [groupedServices, setGroupedServices] = useState({});
  const [selectedServices, setSelectedServices] = useState(new Set());
  const { data: session, status: sessionStatus  } = useSession();

  // Effect for grouping services by section and category
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



// Loading and error handling
if (!currentStoreId) return <p>Please select a store to view its services.</p>;
if (sessionStatus === "loading") return <p>Loading session...</p>; // Handling session loading state
if (servicesError) return <p className="text-red-500">Error loading services: {servicesError.message}</p>;

return (
  <div className={styles.container}>
    <h1 className={styles.title}>{activeSection}</h1>
    
    <div className={styles.section}>
      {Object.entries(groupedServices).map(([category, services]) => (
        <div key={category} className={styles.section}>
          <h2 className={styles.sectionTitle}>{category}</h2>
          <Swiper spaceBetween={10} slidesPerView={5}  pagination={{ clickable: true }} breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 5 },
                  660: { slidesPerView: 2, spaceBetween: 10 },
                  1024: { slidesPerView: 3, spaceBetween: 10 },
                  1440: { slidesPerView: 5, spaceBetween: 10 }
                }}
                >
            {services.map((service) => (
              <SwiperSlide key={service._id}>
                <div className={styles.serviceCard}>
                  <div>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                    <p>Duration: {service.duration} minutes</p>
                    <p>Price: AED {service.price}</p>
                    <button
                      className={`${styles.button} ${selectedServices.has(service._id) ? 'styles.selected' : 'styles.notSelected'}`}
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
      <Link className={styles.linkButton} href={`/stores/${currentStoreId}/salon-services/booking-details`}>
        Next
      </Link>
    </div>
  </div>
);
  

};

export default ServicesPage;

