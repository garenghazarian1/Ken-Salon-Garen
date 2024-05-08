"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {redirect, useSearchParams  } from 'next/navigation';
import { useRegister } from '../../../context/UserContext.jsx';
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
  }, [session, status, callbackUrl]);

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

  // const handleGoogleSignIn = () => {
  //   signIn('google');
  // };

  return (
    <div className={styles.container}>
          
            <video className={styles.videoStyle} autoPlay  loop  muted playsInline preload="auto"  src="loginVideo.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
         
            <div className={styles.container1}> 
      <div className={styles.circle + ' ' + styles['circle-green']}></div>
      <div className={styles.circle + ' ' + styles['circle-gray']}></div>
      

    
        <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Login</h2>
        {/* Email field */}
        <div className={styles.field}>
          
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputField} required placeholder='E-mail' />
        </div>
        {/* Password field with toggle */}
        <div className={styles.field1}>     
          <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputField} required placeholder='Password' />
          <span onClick={togglePasswordVisibility} className={styles.passwordToggle}>
            {showPassword ? <span >Hide</span> : <span  >Show</span>}
          </span>
        </div>
        {/* Remember Me Checkbox */}
        <div className={styles.field}>
          <label htmlFor="rememberMe" className={styles.label}>
            <input type="checkbox" id="rememberMe" name="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className={styles.checkbox} />
            Remember Me
          </label>
        </div>
        {/* Error Message Display */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {/* Submit Button */}
        <button type="submit" className={styles.linkButton}>Login</button>
      </form>
      {/* Google Sign-in Button 
      <button type="button" onClick={handleGoogleSignIn} className={styles.googleSignInButton}>
          Sign in with Google
        </button>*/}
      <div className={styles.field}>
        <Link href="/" className={styles.loginLink}>Back to main page</Link>
      </div>
     </div>
      
        <video className={styles.videoStyle1} autoPlay  loop  muted playsInline preload="auto"  src="loginVideo1.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
      
    </div>
  );
};

export default LoginPage;
