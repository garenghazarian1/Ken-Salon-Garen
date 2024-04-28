"use client"
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useService } from "@/context/ServiceContext";
import { useSession } from 'next-auth/react';

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
    <div className="p-4">
      <h1 className="text-2xl font-bold">{currentService.title}</h1>
      {isOwner && (
        <>
          <button
            onClick={() => router.push(`/superuser`)} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Update service
          </button>
          <button
            onClick={() => deleteService(params.serviceId)}
            className="mt-4 ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
          >
            Delete service
          </button>
        </>
      )}
    </div>
  );
};

export default ServiceDetailPage;
