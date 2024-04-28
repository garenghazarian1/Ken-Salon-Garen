"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useSession } from 'next-auth/react';
import { useService } from '@/context/ServiceContext';

const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
const button = " flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:bg-gray-400"

const UpdateServicePage = () => {
  const [serviceData, setServiceData] = useState({ title: '', description: '', duration: 0, price: 0, category: '', section: '', isActive: true });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { currentServiceId } = useService();

  useEffect(() => {
    if (currentServiceId) {
      const fetchServiceDetails = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/services/${currentServiceId}`);
          setServiceData(response.data);
          setIsFormVisible(true);
        } catch (error) {
          console.error(error);
          setError('Failed to load service details.');
        }
      };

      fetchServiceDetails();
    }
  }, [currentServiceId]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    
  if (!currentServiceId) {
    console.error("Service ID is undefined.");
    setError("Service ID is missing.");
    setIsLoading(false);
    return;
  }

    try {
      await axios.put(`${baseUrl}/api/services/${currentServiceId}`, serviceData, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      alert('Service updated successfully');
      router.push(`/stores`);
    } catch (error) {
      console.error(error);
      setError('Failed to update service.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
  <div className="flex flex-col ">
    <h2 onClick={toggleFormVisibility} className={button}>Update Service</h2>
    {isFormVisible && (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
       <input className={inputStyle} id="section" name="section" type="text" placeholder="Section" value={serviceData.section} onChange={handleChange} required />
          <input className={inputStyle} id="title" name="title" type="text" placeholder="Title" value={serviceData.title} onChange={handleChange} required />
          <textarea className={inputStyle} id="description" name="description" placeholder="Description" value={serviceData.description} onChange={handleChange} />
          <input className={inputStyle} id="duration" name="duration" type="number" placeholder="Duration (in minutes)" value={serviceData.duration} onChange={handleChange} required />
          <input className={inputStyle} id="price" name="price" type="number" placeholder="Price" value={serviceData.price} onChange={handleChange} required />
          <input className={inputStyle} id="category" name="category" type="text" placeholder="Category" value={serviceData.category} onChange={handleChange} required />
        <div className="flex items-center">
          <label htmlFor="isActive" className="mr-2">Active</label>
          <input className={inputStyle} id="isActive" name="isActive" type="checkbox" checked={serviceData.isActive} onChange={handleChange} />
        </div>

  <button type="submit" disabled={isLoading} className={button}>
    {isLoading ? 'Updating...' : 'Update Service'}
  </button>
  {error && <p className="error">{error}</p>}
</form>
 )}

    </div>
  );
};

export default UpdateServicePage;
