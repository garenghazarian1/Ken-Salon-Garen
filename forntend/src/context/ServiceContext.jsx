// context/ServiceContext.js
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useStore } from "@/context/StoreContext";



const ServiceContext = createContext();

export const useService = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }) => {
  const { currentStoreId } = useStore();
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [services, setServices] = useState([]); 
  const [currentService, setCurrentService] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  

  useEffect(() => {
    const fetchServices = async () => {
      if (!currentStoreId) {
        setServices([]);
        setLoading(false);
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/services?storeId=${currentStoreId}`);
        setServices(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch services for store:", currentStoreId, err);
        setError(err);
      } finally {
        setLoading(false);
      } 
    };
  
    fetchServices();
  }, [currentStoreId]); // Rerun when currentStoreId changes

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!currentServiceId) {
        setCurrentService(null);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/services/${currentServiceId}`);
        setCurrentService(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch service details for:", currentServiceId, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [currentServiceId]); // Fetch service details whenever the currentServiceId changes

  

  const setServiceId = (serviceId) => {
    setCurrentServiceId(serviceId);
  };

  return (
    <ServiceContext.Provider value={{ currentServiceId, setServiceId, currentService, services, loading, error }}>
      {children}
    </ServiceContext.Provider>
  );
};
