"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRegister } from '../../../context/UserContext.jsx';
import { redirect, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import styles from "./RegisterPage.module.css";
import Image from 'next/image.js';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const RegisterPage = () => {
  const router = useRouter();
  const { register, error, setError } = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setError(''); // Clear the error when the component mounts
  }, [setError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhoneChange = (value, data) => {
    // value should already contain the full international phone number with country code
    setFormData(prevState => ({
      ...prevState,
      phoneNumber: value,
      country: data.countryCode // store the country code separately if needed
    }));
     
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        image: file
      }));
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.phoneNumber) {
      setError('Phone number is required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    formDataToSend.append('phoneNumber', formData.phoneNumber);

    if (formData.image) {
      formDataToSend.append('logo', formData.image);
    }

    const result = await register(formDataToSend);
    if (result.error) {
      console.error('Registration error in component:', result.error);
      return;
    }

    router.push("/login");
  };

  // const handleGoogleSignIn = () => {
  //   signIn('google', { callbackUrl: '/' });
  // };

  const { data: session } = useSession();
  if (session) {
    redirect("/");
  }

  const clearError = () => {
    setError('');
  };
  

  return (
    <div className={styles.container}>
      <video className={styles.videoStyle} autoPlay loop muted playsInline preload="auto" src="loginVideo1.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>

      <div className={styles.container1}>
        <div className={`${styles.circle} ${styles['circle-green']}`}></div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.heading}>Register</h2>
          {error && (
            <div className={styles.error}>
              {error}
              <button className={styles.closeButton} onClick={clearError}>&times;</button>
            </div>
          )}
          <div className={styles.field}>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className={styles.inputField}
              required
              placeholder='Name'
            />
          </div>

          <div className={styles.field}>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className={styles.inputField}
              required
              placeholder="Your email"
            />
          </div>

          {/* Password field with toggle */}
          <div className={styles.field1}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className={styles.inputField}
              required
              placeholder='Password - 6 characters at least'
            />
            <span onClick={togglePasswordVisibility} className={styles.passwordToggle}>
              {showPassword ? <span>Hide</span> : <span>Show</span>}
            </span>
          </div>

          {/* Confirm Password field with toggle */}
          <div className={styles.field1}>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
              value={formData.confirmPassword}
              className={styles.inputField}
              required
              placeholder='Confirm Password'
            />
            <span onClick={togglePasswordVisibility} className={styles.passwordToggle}>
              {showPassword ? <span>Hide</span> : <span>Show</span>}
            </span>
          </div>

          <div className={styles.field}>
            <PhoneInput
              country={'ae'}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%' }}
              inputClass={styles.inputField}
              required
              
              dropdownStyle={{
                backgroundColor: '#e4dede',
                border: '1px solid #ccc',
                color: '#042f2e'
              }}
              placeholder="Enter your phone number"
              isValid={(value) => {
                if (value) {
                  return true;
                } else {
                  return 'Phone number is required';
                }
              }}
            />
          </div>

          <div className={styles.field1}>
            {/* Image upload field */}
            <label htmlFor="imageUpload" className={styles.label}>Profile Image</label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              onChange={handleImageSelect}
              className={styles.fileInput}
            />
            <div className={styles.fileDisplayContainer}>
              <span>{formData.image ? formData.image.name : "Choose file..."}</span>
            </div>
            {formData.image && (
              <Image
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className={styles.imagePreview}
                width={100}
                height={100}
                objectFit="cover"
              />
            )}
          </div>

          {/* Submit button */}
          <button type="submit" className={styles.linkButton}>Register</button>
        </form>

        <div className="mt-4">
          <Link href="/login" className={styles.loginLink}>
            Already registered? Login here.
          </Link>
        </div>

        <div className="mt-2">
          <Link href="/" className={styles.loginLink}>
            Back to main page
          </Link>
        </div>
      </div>

      <video className={styles.videoStyle1} autoPlay loop muted playsInline preload="auto" src="loginVideo.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default RegisterPage;
