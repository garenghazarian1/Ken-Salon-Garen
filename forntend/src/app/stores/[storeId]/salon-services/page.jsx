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
import { useRouter } from "next/navigation"

const ServicesPage = () => {
  const { currentStoreId } = useStore();
  const { services, activeSection, selectedServices, handleServiceSelectionChange, loading: servicesLoading, error: servicesError } = useService()
  const [groupedServices, setGroupedServices] = useState({});
  const { data: session, status: sessionStatus  } = useSession();
  const router = useRouter();

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


// Loading and error handling
if (!currentStoreId) return <p>Please select a store to view its services.</p>;
if (sessionStatus === "loading") return <p>Loading session...</p>; // Handling session loading state
if (servicesError) return <p className="text-red-500">Error loading services: {servicesError.message}</p>;

const isServiceSelected = selectedServices.size > 0;

const handleNavigation = () => {
  if (isServiceSelected) {
      router.push(`/stores/${currentStoreId}/salon-services/booking-details`);
  } else {
      alert("Please select a service before proceeding to the next step.");
  }
};
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
                  <h4 className={styles.serviceTitle}>{service.title}</h4>
                  <p className={styles.serviceText}>{service.description}</p>
                  <p className={`${styles.serviceText} ${styles.serviceDetail}`}>Duration: {service.duration} minutes</p>
                  <p className={`${styles.serviceText} ${styles.serviceDetail}`}>Price:  {service.price} AED</p>
                    <button
                      className={`${styles.button} ${selectedServices.has(service._id) ? 'styles.selected' : 'styles.notSelected'}`}
                      onClick={() => handleServiceSelectionChange(service._id)}
                    >
                      {selectedServices.has(service._id) ? 'Deselect' : 'Select'}
                    </button>
                  </div>
                  <div className="mt-2">
                            <Link className={styles.button1} href={`/stores/${currentStoreId}/salon-services/${service._id}`}>
                              Learn more
                            </Link>
                          </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
      {!isServiceSelected && (
          <p className="text-black ml-8">Please select at least one service to proceed.</p>
        )}
        <div className={styles.linkDiv}>
        <button className={styles.linkButton} onClick={handleNavigation}>
            Next
        </button>
        </div>
    </div>
  </div>
);
  

};

export default ServicesPage;

