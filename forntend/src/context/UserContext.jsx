"use client"
//import { useRegister } from '../context/RegisterContext.jsx';
//const {} = useRegister();
import { createContext, useContext, useState } from 'react';
import {baseUrl} from "@/api/ports.js"
import axios from 'axios';
import { useRouter } from "next/navigation";

const userContext = createContext();

export const useRegister = () => useContext(userContext);

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [userReg, setUserReg] = useState(null);
  const [error, setError] = useState('');
      //console.log("base:url",baseUrl);

 const [userLog, setUserLog] = useState(() => {
  if (typeof window === "undefined") {
    // If we're on the server, return early with null or any initial value you prefer
    return null;
  }
  // If we're in the browser, it's safe to access localStorage
  const savedUserInfo = localStorage.getItem('allUserInfo');
  return savedUserInfo ? JSON.parse(savedUserInfo) : null;
});

  

  // REGISTER ****************************************
  const register = async (formData) => {
    setError(''); 
    try {
      const response = await axios.post(`${baseUrl}/api/users/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUserReg(response.data.userReg);
      localStorage.setItem('token', response.data.token);
      router.push('/login');
      return response.data;
    } catch (error) {
      const errorMessage = error.response && error.response.data.message ? error.response.data.message : 'Something went wrong frontend';
      console.error('Registration error:', errorMessage);
    }
  };

  // LOGIN ****************************************
  const login = async (email, password, rememberMe) => {
    try {
      const response = await axios.post(`${baseUrl}/api/users/login`, { email, password, rememberMe});

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.user.name);
      localStorage.setItem('allUserInfo', JSON.stringify(response.data.user));
      setUserLog(response.data.user); // Set user in context
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
      throw err; // Re-throw to allow for additional handling if needed
    }
  };
// LOGOUT ***************************************** 
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('allUserInfo');
    setUserLog(null); // Clear user in context
    router.push('/login', { replace: true });
  };

  return (
    <userContext.Provider value={{  userReg, error, register, setError, setUserLog, userLog, login, logout   }}>
      {children}
    </userContext.Provider>
  );
};
