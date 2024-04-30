// context/ServiceContext.js
"use client"
import React, { createContext, useContext, useState, useEffect, useMemo  } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useStore } from "@/context/StoreContext";
import { useSession } from 'next-auth/react';

const ServiceContext = createContext();

export const useService = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }) => {
  const { currentStoreId } = useStore();
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [services, setServices] = useState([]); 
  const [currentService, setCurrentService] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [activeSection, setActiveSection] = useState(null);
  const [selectedServices, setSelectedServices] = useState(new Set());
  const { data: session, status: sessionStatus  } = useSession();
  

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

    // Group services by sections and categories
    const groupedServices = useMemo(() => {
      return services.reduce((acc, service) => {
        const section = service.section || 'Other';
        acc[section] = acc[section] || {};
        const category = service.category || 'Other';
        acc[section][category] = acc[section][category] || [];
        acc[section][category].push(service);
        return acc;
      }, {});
    }, [services]);

  const setServiceId = (serviceId) => {
    setCurrentServiceId(serviceId);
  };

   // Handlers for selecting and deselecting services
   const handleServiceSelectionChange = (serviceId) => {
    const updatedSelection = new Set(selectedServices);
    if (updatedSelection.has(serviceId)) {
      updatedSelection.delete(serviceId);
    } else {
      updatedSelection.add(serviceId);
    }
    setSelectedServices(updatedSelection);
    console.log("Updated Selection:", Array.from(updatedSelection));
    // Added session check to safely log user ID and email
    if (session) {  
      console.log("User ID:", session?.user?._id , "User:", session.user.email, "Selected Services:", Array.from(updatedSelection));
    }
  };

  return (
    <ServiceContext.Provider value={{selectedServices, setSelectedServices, handleServiceSelectionChange, currentServiceId, setServiceId,activeSection , setActiveSection, currentService, services, groupedServices, loading, error }}>
      {children}
    </ServiceContext.Provider>
  );
};
