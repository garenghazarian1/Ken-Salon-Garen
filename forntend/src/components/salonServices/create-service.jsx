"use client"
import { useState, useEffect  } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {baseUrl} from "@/api/ports";
import { useSession, signIn } from 'next-auth/react';
import { useStore } from "@/context/StoreContext"

const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
const button = " flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:bg-gray-400"

const CreateServicePage = () => {
  const [serviceData, setServiceData] = useState({ title: '', description: '', duration: 0, price: 0, category: '', section: '', isActive: true,});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data: session, status } = useSession();
  const { currentStoreId } = useStore();
  const router = useRouter();
  

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!session) {
      setError('You must be logged in to create a service.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      await axios.post(`${baseUrl}/api/services`, {
        ...serviceData,
        storeId: currentStoreId
      }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      router.push(`/stores/${currentStoreId}`); // Redirect on success
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <>
      <h1 className={button} onClick={toggleFormVisibility}>
        Create a New Service for Store
        </h1>
      {isFormVisible && (<form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto">

          <label htmlFor="section">Section</label>
          <input className={inputStyle} id="section" name="section" type="text" value={serviceData.section} onChange={handleChange} required />

          <label htmlFor="title">Title</label>
          <input className={inputStyle} id="title" name="title" type="text" value={serviceData.title} onChange={handleChange} required/>

          <label htmlFor="description">Description</label>
          <textarea className={inputStyle} id="description" name="description" value={serviceData.description} onChange={handleChange} />

          <label htmlFor="duration">Duration (in minutes)</label>
          <input className={inputStyle} id="duration" name="duration" type="number" value={serviceData.duration} onChange={handleChange} required />

          <label htmlFor="price">Price</label>
          <input className={inputStyle} id="price" name="price" type="number" value={serviceData.price} onChange={handleChange} required />

          <label htmlFor="category">Category</label>
          <input className={inputStyle} id="category" name="category" type="text" value={serviceData.category} onChange={handleChange} required  />

          <label htmlFor="isActive">Active</label>
          <input className={inputStyle} id="isActive" name="isActive" type="checkbox" checked={serviceData.isActive} onChange={handleChange}  />

        <button type="submit" disabled={isLoading} className={button}>
          {isLoading ? 'Creating...' : 'Create Service'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
)}
    </>
  );
};

export default CreateServicePage;
