"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useSession } from 'next-auth/react';
import { useStore } from "@/context/StoreContext"
import Image from 'next/image';

const inputStyle = "text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
const button = " flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:bg-gray-400"

const UpdateStoreForm = () => {
  const [storeData, setStoreData] = useState({  name: '',  street: '',  city: '',  state: '',  zipCode: '',  country: '',  phone: '',  mobile: '',  email: '',  imageStore: '', });
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session, status } = useSession();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { currentStoreId } = useStore();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      //console.log("Current storeId from global state:", currentStoreId);
      try {
        const response = await axios.get(`${baseUrl}/api/stores/${currentStoreId}`);
        setStoreData(response.data);
        setPreviewUrl(response.data.imageStore);
      } catch (error) {
        console.error(error, 'Error fetching store data:' );
        setError('Failed to load store data.');
      }
    };
    if (currentStoreId) {
      fetchStoreData();
  }
}, [currentStoreId]);

const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === 'imageStore') {
    setNewImage(files[0]);
    const fileURL = URL.createObjectURL(files[0]);
    setPreviewUrl(fileURL); // Set the preview URL for the selected file
  } else {
    setStoreData({ ...storeData, [name]: value });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  const formData = new FormData();

  // Append existing store data to formData
  Object.keys(storeData).forEach(key => {
    if (key !== 'imageStore') { // Exclude the old imageStore field
      formData.append(key, storeData[key]);
    }
  });

  // Append new image under the 'imageStore' field if present
  if (newImage) {
    formData.append('imageStore', newImage);
  }

    try {
      await axios.put(`${baseUrl}/api/stores/${currentStoreId}`, formData, {
        headers: { 
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setError('');
    } catch (error) {
      console.error('Error updating store:', error);
      setError('Failed to update store.');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div >
      <h2 onClick={toggleFormVisibility} className={button}>Update Salon</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Store updated successfully!</p>}
      {isFormVisible && (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input  className={inputStyle}  type="text"  name="name"  placeholder="Store Name"  value={storeData.name}  onChange={handleChange} />
        <input  className={inputStyle}  type="text"  name="street"  placeholder="Street"  value={storeData.street}  onChange={handleChange}  />
        <input  className={inputStyle}  type="text"  name="city"  placeholder="City"  value={storeData.city}  onChange={handleChange}  require  />
        <input  className={inputStyle}  type="text"  name="state"  placeholder="State"  value={storeData.state}  onChange={handleChange}  />
        <input  className={inputStyle}  type="text"  name="zipCode"  placeholder="Zip Code"  value={storeData.zipCode}  onChange={handleChange} />
        <input  className={inputStyle}  type="text"  name="country"  placeholder="Country"  value={storeData.country}  onChange={handleChange} />
        <input  className={inputStyle}  type="text"  name="phone"  placeholder="Phone"  value={storeData.phone}  onChange={handleChange} />
        <input  className={inputStyle}  type="text"  name="mobile"  placeholder="Mobile"  value={storeData.mobile}  onChange={handleChange} />
        <input  className={inputStyle}  type="email"  name="email"  placeholder="Email"  value={storeData.email}  onChange={handleChange}  required/>
  
        <div className="flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700">
            Store Image
          </label>
          <input
            className="file:px-4 file:py-2 file:border file:border-gray-300 file:rounded file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-100 mt-1"
            type="file"
            name="imageStore"
            onChange={handleChange}
          />
          <div className="mt-4 w-24">
              {previewUrl && (
                <Image
                src={previewUrl}
                alt="Store Preview"
                width={50} height={50} style={{ width: 'auto', height: 'auto' }}
               
              />
              )}
            </div>
        </div>
  
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Update Store
        </button>
      </form>
      )}
    </div>
  );
  
};

export default UpdateStoreForm;
