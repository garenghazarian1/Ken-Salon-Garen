"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from "@/context/StoreContext";
import { useService } from "@/context/ServiceContext";
import { useSession } from 'next-auth/react';
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
useEffect(() => {
  if (!currentStoreId) {
    router.push('/stores');
  }
}, [currentStoreId, router]); 

if (sessionStatus === "loading") return <p>Loading session...</p>; // Handling session loading state
if (servicesError) return <p className={styles.error}>Error loading services: {servicesError.message}</p>;

const handleNavigation = () => {
  // Check if any services are selected and the count does not exceed six
  if (selectedServices.size > 0 && selectedServices.size <= 6) {
    router.push(`/stores/${currentStoreId}/salon-services/booking-details`);
  } else if (selectedServices.size === 0) {
    // No services selected
    alert("Please select at least one service before proceeding to the next step.");
  } 
};

// const isServiceSelected = selectedServices.size > 0;

// const handleNavigation = () => {
//   if (isServiceSelected) {
//       router.push(`/stores/${currentStoreId}/salon-services/booking-details`);
//   } else {
//       alert("Please select a service before proceeding to the next step.");
//   }
// };
return (
  <>
  <div className={styles.headerOverAll}></div>
  <div className={styles.container}>
          {/* Navigation Links for Categories */}
          <div className={styles.categoryNavigation}>
        {Object.keys(groupedServices).map(category => (
          <a href={`#${category.replace(/\s+/g, '-')}`} key={category} className={styles.categoryNavigationA}>{category}</a>
        ))}
                
        <button className={styles.button1} onClick={handleNavigation}>
            Next
        </button>
        
      </div>
      <h1 className={styles.title}>{activeSection}</h1>
    <div className={styles.section}>
      {Object.entries(groupedServices).map(([category, services]) => (
        <div key={category} className={styles.section} id={category.replace(/\s+/g, '-')}>
          <h2 className={styles.sectionTitle}>{category}</h2>
         
            {services.map((service) => (
             
                <div key={service._id} className={styles.serviceCard}>
                  <div className={styles.flex}>
                  <h4 className={styles.serviceTitle}>{service.title}</h4>
                  <p className={styles.serviceText}>Duration: {service.duration} min</p>
                  <p className={styles.serviceText}>Price: {service.price} AED</p>
                  </div>
                  <div className={styles.flex}>
                    <button
                      className={`${styles.button} ${selectedServices.has(service._id) ? 'styles.selected' : 'styles.notSelected'}`}
                      onClick={() => handleServiceSelectionChange(service._id)}
                    >
                      {selectedServices.has(service._id) ? '-' : '+'}
                    </button>
                 
                  
                         <button className={styles.button}>  <Link  href={`/stores/${currentStoreId}/salon-services/${service._id}`}>
                              ...
                            </Link></button> 
                          </div>
                </div>
             
            ))}
          
        </div>
      ))}
      {!selectedServices ? (
        <p className={styles.selected}>Please select at least one service to proceed.</p>
      ) : (
        <p className={styles.notSelected}>Service selected, you can proceed.</p>
      )}
        <div className={styles.linkDiv}>
        <button className={styles.linkButton} onClick={handleNavigation}>
            Next
        </button>
        </div>
    </div>
  </div>
  </>
);
  

};

export default ServicesPage;

