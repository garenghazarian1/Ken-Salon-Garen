"use client"
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useService } from "@/context/ServiceContext";
import { useSession } from 'next-auth/react';
import styles from './ServiceId.module.css';

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { currentService, error, loading, setServiceId } = useService(); 
  const { data: session } = useSession();

  useEffect(() => {
    const serviceId = params.serviceId;
    if (serviceId) {
      setServiceId(serviceId); 
    }
  }, [params.serviceId, setServiceId]);

  const isOwner = session?.user?.role === 'owner';

  // Handle loading state
  if (loading) return <p>Loading service details...</p>;
  // Handle error state
  if (error) return <p className="text-red-500">Failed to load service details.</p>;
  // Ensure service data is available
  if (!currentService) return <p>No service details available.</p>;

  const deleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      try {
        await axios.delete(`${baseUrl}/api/services/${serviceId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        alert('Service successfully deleted');
        router.push('/stores');
      } catch (error) {
        console.error(error, 'Failed to delete service:');
        alert('Failed to delete service');
      }
    }
  };

  return (
    <div className={styles.container}>
    <h1 className={styles.title}>{currentService.title}</h1>
    <h3 className={styles.description}>{currentService.description}</h3>
    {isOwner && (
      <>
        <button
          onClick={() => router.push(`/superuser`)}
          className={`${styles.buttonBase} ${styles.updateButton}`}
        >
          Update service
        </button>
        <button
          onClick={() => deleteService(params.serviceId)}
          className={`${styles.buttonBase} ${styles.deleteButton}`}
        >
          Delete service
        </button>
      </>
    )}
  </div>
);
};

export default ServiceDetailPage;
