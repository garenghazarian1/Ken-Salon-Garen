"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [currentStoreHourId, setCurrentStoreHourId] = useState(null);
  const [currentStoreClosureId, setCurrentStoreClosureId] = useState(null);
  const [storeHours, setStoreHours] = useState([]);
  const [storeClosures, setStoreClosures] = useState([]);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
 
  const setStoreId = (storeId) => setCurrentStoreId(storeId);
  const setStoreHourId = (storeHourId) => setCurrentStoreHourId(storeHourId);
  const setStoreClosureId = (storeClosureId) => setCurrentStoreClosureId(storeClosureId);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/stores`);
        setStores(response.data);
      } catch (error) {
        setError('Failed to load stores. Please try again later.');
        console.error('Error fetching stores:', error);
       }
    };
    fetchStores();
    return () => {
      //console.log('Cleanup if needed');
    };
  }, []);

  useEffect(() => {
    const fetchStoreHours = async () => {
      if (!currentStoreId) return;
      try {
        const response = await axios.get(`${baseUrl}/api/storehours/by-store/${currentStoreId}`);
        setStoreHours(response.data);
        //console.log("🚀STORE HOURS", response.data)
      } catch (error) {
        setStoreHours([]);
        console.error('Error fetching store hours:', error);
      } 
    };
    fetchStoreHours();
  }, [currentStoreId]);

  useEffect(() => {
    const fetchStoreClosures = async () => {
      if (!currentStoreId) return;
      try {
        const response = await axios.get(`${baseUrl}/api/storeclosures?store=${currentStoreId}`);
        setStoreClosures(response.data );
       // console.log("🚀storeclosures", response.data)
      } catch (error) {
        setStoreClosures([])
        console.error('Error fetching store closures:', error);
      }
    };

    fetchStoreClosures();
  }, [currentStoreId]);

  return (
    <StoreContext.Provider value={{ currentStoreId, setStoreId, currentStoreHourId, setStoreHourId, currentStoreClosureId, setStoreClosureId, storeHours, setStoreHours, storeClosures, setStoreClosures, stores }}>
      {children}
    </StoreContext.Provider>
  );
};
