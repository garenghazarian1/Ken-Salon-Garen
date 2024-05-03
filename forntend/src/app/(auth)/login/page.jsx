"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {redirect, useSearchParams  } from 'next/navigation';
import { useRegister } from '@/context/userContext';
import { signIn, useSession } from "next-auth/react";
import styles from "@/app/(auth)/login/LoginPage.module.css"




const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error } = useRegister();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && session.user.role === 'owner') {
      // If the session exists and the user is an owner, redirect to the Superuser page
      redirect("/superuser");
    } else if (session) {
      // For any other authenticated user, redirect to the callback URL or homepage
      redirect(callbackUrl);
    }
  }, [session, status]);

   const togglePasswordVisibility = () => {setShowPassword(!showPassword);};

  const handleSubmit = async (e) => {e.preventDefault();
    try {
     // await signIn(email, password, rememberMe);
     const res= await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
        rememberMe
      })
      if (!res?.error) {
        redirect(callbackUrl);
      } else {
        alert("Invalid email or password");
      }

    } catch (error) {
      console.log(error.message || 'Login failed due to an unexpected error' );
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google');
  };

  return (
    <div className={styles.container}>
          <div className={styles.videoContainer}>
            <video className={styles.videoStyle} autoPlay  loop  muted  src="loginVideo2.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
          </div>
      <div className={styles.circle + ' ' + styles['circle-green']}></div>
      {/* <div className={styles.circle + ' ' + styles['circle-blue']}></div> */}
      <div className={styles.circle + ' ' + styles['circle-gray']}></div>
      {/* <div className={styles.circle + ' ' + styles['circle-yellow']}></div> */}

      <div className='flex flex-1 flex-col justify-center items-center w-3/4 md:w-auto h-screen bg-green-300 bg-opacity-50  '>
        <form onSubmit={handleSubmit} className="w-3/4 max-w-md p-4  shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Login</h2>
        {/* Email field */}
        <div className="mb-4 ">
          <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black mt-1 p-2 w-full border rounded-md" />
        </div>
        {/* Password field with toggle */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
          <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-black mt-1 p-2 w-full border rounded-md pr-10" />
          <span onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center cursor-pointer text-black">
            {showPassword ? <span className='text-sm'>Hide</span> : <span  className='text-sm'>Show</span>}
          </span>
        </div>
        {/* Remember Me Checkbox */}
        <div className="mb-4">
          <label htmlFor="rememberMe" className="block text-sm font-medium text-gray-100">
            <input type="checkbox" id="rememberMe" name="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
            Remember Me
          </label>
        </div>
        {/* Error Message Display */}
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {/* Submit Button */}
        <button type="submit" className=" flex justify-center text-sm cursor-pointer text-gray-100 p-6 rounded-lg  transition duration-300 ease-in-out   hover:text-green-500 hover:bg-gray-200">Login</button>
      </form>
      {/* Google Sign-in Button */}
      <button type="button" onClick={handleGoogleSignIn} className="mt-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 text-white font-semibold py-2 px-4 rounded block text-center transition-all duration-700 ease-in-out">
          Sign in with Google
        </button>
      <div className="mt-2">
        <Link href="/" className="text-white hover:underline">Back to main page</Link>
      </div>
      </div>
      <div className={styles.videoContainer}>
        <video className={styles.videoStyle1} autoPlay  loop  muted  src="loginVideo3.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
      </div>
    </div>
  );
};

export default LoginPage;
