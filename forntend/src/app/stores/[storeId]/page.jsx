// app/stores/[storeId]/page.jsx
"use client"
import { baseUrl } from '@/api/ports';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {  useParams,useRouter } from 'next/navigation';
import { useStore } from "@/context/StoreContext"
import StoreHoursCalendar from "@/components/store/storeHoursCalendar/StoreHoursCalendar";
import StoreClosureDisplay from '@/components/store/storeClosureForm/StoreClosureForm';
import styles from './StorePage.module.css';
import { useService } from "@/context/ServiceContext";
import Link from 'next/link';
import Image from 'next/image';

const StorePage = ({ params }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { storeId } = params;
  const { data: session} = useSession();
  const { setStoreId, currentStoreId } = useStore();
  const router = useRouter();
  const routeParams = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const {groupedServices, setActiveSection  } = useService();
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  useEffect(() => {
    if (!storeId) return; // Early return if no storeId is available.
  
    const fetchStore = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/stores/${storeId}`);
        setStore(response.data);
        console.log("🚀 FETCHSTORE", response.data);
      } catch (error) {
        console.error(error, 'Failed to fetch store:');
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStore();
  }, [storeId]);
  
  useEffect(() => {
    // Separate effect to handle storeId setting which might depend on other logic
    if (storeId && storeId !== currentStoreId) {
      setStoreId(storeId);
    }
  }, [storeId, currentStoreId, setStoreId]);
  
  //console.log('Effect run:', { setStoreId, storeId });

  const isOwner = session?.user?.role === 'owner';


  // const handleDeleteStore = async () => {
  //   if (window.confirm("Are you sure you want to delete this store? This action cannot be undone.")) {
  //     try {
  //       await axios.delete(`${baseUrl}/api/stores/${storeId}`, {
  //         headers: {
  //           'Authorization': `Bearer ${session.accessToken}`,
  //         },
  //       });
  //       alert('Store successfully deleted');
  //       router.push('/stores');
  //     } catch (error) {
  //       console.error( error,'Failed to delete store:');
  //       alert('Failed to delete store');
  //     }
  //   }
  // };

  const handleSectionSelect = (section) => {
    console.log("🚀 ~ handleSectionSelect ~ section:", section)
    setActiveSection(section);  // Set the active section in context
    // Navigation is handled by Link
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching store details</div>;

  return (
    <div className={styles.container}>
      {store ? (
        <>
          <div className={styles.storeHeader} >
              <h1 className={styles.title}>{store.name}</h1>
            <Image src={store.imageStore} alt={`${store.name} Store Image`} width={50} height={50}  className={styles.storeImage}/>
          </div>
          {isOwner && (
            <>
            <div className={styles.flexRow}>
              <button onClick={() => router.push(`/superuser`)} className={styles.button}> Update Store </button>
              {/* <button onClick={handleDeleteStore} className={styles.button} >  Delete Store </button> */}
              <button onClick={() => router.push(`/superuser`)} className={styles.button} > Create Service </button>
            </div>  
             <div className={styles.flexRow}>
              <StoreHoursCalendar />
              <StoreClosureDisplay />
            </div>          
            </>        
          )}
        </>
      ) : (
        <div>Store not found</div>
      )}


<div className={styles.serviceSection}>
  <h2 className={styles.title}>Select the service section</h2>
  <div className={styles.serviceSectionLink}>
  {Object.entries(groupedServices).map(([section]) => (
    <div  key={section}>
    <Link 
      href={`/stores/${currentStoreId}/salon-services/`}
      className={styles.button1}
      onClick={() => handleSectionSelect(section)} 
      prefetch={false} 
    >
      {section}
    </Link>
    </div>
  ))}
  </div>
</div>

    </div>
    
  );
  
};

export default StorePage;
