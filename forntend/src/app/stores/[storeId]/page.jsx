// app/stores/[storeId]/page.jsx
"use client"
import { baseUrl } from '@/api/ports';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useStore } from "@/context/StoreContext"
 import ServicesPage from './salon-services/page';
import StoreHoursCalendar from "@/components/store/storeHoursCalendar/StoreHoursCalendar";
import StoreClosureDisplay from '@/components/store/StoreClosureForm';
import styles from './StorePage.module.css';


const StorePage = ({ params }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { storeId } = params;
  const { data: session} = useSession();
  const { setStoreId } = useStore();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/stores/${storeId}`);
        setStore(response.data);
        setStoreId(storeId);
        setError(null);
      } catch (error) {
        console.error(error, 'Failed to fetch store:' );
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStore();
    }
  }, [storeId, setStoreId]);

  const isOwner = session?.user?.role === 'owner';

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching store details</div>;

  const handleDeleteStore = async () => {
    if (window.confirm("Are you sure you want to delete this store? This action cannot be undone.")) {
      try {
        await axios.delete(`${baseUrl}/api/stores/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        alert('Store successfully deleted');
        router.push('/stores');
      } catch (error) {
        console.error( error,'Failed to delete store:');
        alert('Failed to delete store');
      }
    }
  };

 
  return (
    <div className={styles.container}>
      {store ? (
        <>
          <div className={`${styles.storeHeader} ${styles.flexRow}`}>
            <img
              src={store.imageStore}
              alt={`${store.name} Store Image`}
              width={50}
              height={50}
              className={styles.storeImage}
            />
            <div className={styles.flexCenter}>
              <h1 className="text-2xl">{store.name}</h1>
            </div>
          </div>
          <h2 onClick={toggleVisibility} className={styles.toggleVisibility}>...</h2>
          {isVisible && (
            <div className={`${styles.relative} ${styles.flexRow} mt-2`}>
              <StoreHoursCalendar />
              <StoreClosureDisplay />
            </div>
          )}
          {isOwner && (
            <>
              <button
                onClick={() => router.push(`/superuser`)}
                className={`${styles.actionButtons} ${styles.buttonUpdate}`}
              >
                Update Store
              </button>
              <button
                onClick={handleDeleteStore}
                className={`${styles.actionButtons} ${styles.buttonDelete} ml-4`}
              >
                Delete Store
              </button>
              <button
                onClick={() => router.push(`/superuser`)}
                className={`${styles.actionButtons} ${styles.buttonCreate} ml-4`}
              >
                Create Service
              </button>
            </>
          )}
        </>
      ) : (
        <div>Store not found</div>
      )}
      <ServicesPage/>
    </div>
    
  );
  
};

export default StorePage;
