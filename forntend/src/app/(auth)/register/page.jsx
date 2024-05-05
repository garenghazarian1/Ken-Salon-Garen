
"use client"
import{ useState } from 'react';
import Link from 'next/link';
import { useRegister } from '../../../context/UserContext.jsx';
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import styles from "./RegisterPage.module.css"
import Image from 'next/image.js';

const RegisterPage = () => {
 const router = useRouter();
  const { register, error } = useRegister();
  const [formData, setFormData] = useState({name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', image: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
      alert(error.message, 'Passwords do not match client side')
      console.log(error.message, 'Passwords do not match client side');
    }

     // Create a FormData instance
  const formDataToSend = new FormData();
  console.log("🚀 ~ handleSubmit ~ formDataToSend:", formDataToSend)
  formDataToSend.append('name', formData.name);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('password', formData.password);
  formDataToSend.append('confirmPassword', formData.confirmPassword);
  formDataToSend.append('phoneNumber', formData.phoneNumber);
  
  if (formData.image) {
    formDataToSend.append('logo', formData.image);
  }
    try {
      await register(formDataToSend);
      // router.push("/login", {replace: true});
    } catch (err) {
      console.log(err.message,'Error in signUp', );
      console.log(error,"error register",);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const { data: session, status } = useSession();
  if (session) {
    redirect ("/");
  }

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
            <video className={styles.videoStyle} autoPlay  loop  muted playsInline preload="auto"  src="loginVideo1.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
          </div>
          <div className={styles.container1}>
          <div className={styles.circle + ' ' + styles['circle-green']}></div>
          <div className={styles.circle + ' ' + styles['circle-gray']}></div>
      <form onSubmit={handleSubmit} className={styles.form} >
        <h2 className={styles.heading}>Register</h2>
        <div className={styles.filed}>
          <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} className={styles.inputField} required placeholder='Name' />
        </div>

        <div className={styles.filed}>
          <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} className={styles.inputField} required placeholder="Your email @ken.com" pattern=".+@ken\.com$"
  title="Email must be a @ken.com address." />
        </div>
         {/* Password field with toggle */}
         <div className={styles.filed1}>
          <input type={showPassword ? "text" : "password"} id="password" name="password" onChange={handleChange} value={formData.password} className={styles.inputField} required placeholder='Password - 6 characters at least ' />
          <span onClick={togglePasswordVisibility} className={styles.passwordToggle}>
            {showPassword ? <span >Hide</span> : <span  >Show</span>}
          </span>
        </div>
        {/* Confirm Password field with toggle */}
        <div className={styles.filed1}>
          <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} className={styles.inputField} required placeholder='Password - 6 characters at least ' />
          <span onClick={togglePasswordVisibility} className={styles.passwordToggle}>
            {showPassword ?  <span >Hide</span> : <span >Show</span> }
          </span>
        </div>

        <div className={styles.field}>
          <input type="tel" id="phoneNumber" name="phoneNumber" onChange={handleChange} value={formData.phoneNumber} className={styles.inputField} placeholder="Enter your phone number" pattern="^\+[1-9]\d{1,14}$" title="International phone number format, e.g., +1234567890" required />
        </div>
        
        <div className={styles.filed1}>
          {/* Image upload field */}
          <label htmlFor="imageUpload" className={styles.label}>Profile Image</label>
          <input type="file" id="imageUpload" name="image" onChange={handleImageSelect} className={styles.fileInput} />
          <div className={styles.fileDisplayContainer}>
            <span>{formData.image ? formData.image.name : "Choose file..."}</span>
          </div>
          {formData.image && <Image src={URL.createObjectURL(formData.image)} alt="Preview" className={styles.imagePreview} width={100} height={100} object-fit />}
        </div>

        {/* Submit button */}
        <button type="submit" className={styles.registerButton} >Register</button>
      </form>
      <div className="mt-4">
        <Link href="/login" className={styles.loginLink}>
          Already registered? Login here.
        </Link>
      </div>


 {/* Google Sign-in Button */}
 <button type="button" onClick={handleGoogleSignIn} className={styles.googleSignInButton}>
          Sign in with Google
        </button>

      <div className="mt-2">
        <Link href="/" className={styles.loginLink}>
          Back to main page
        </Link>
      </div>
      </div>
      <div className={styles.videoContainer}>
        <video className={styles.videoStyle1} autoPlay  loop  muted playsInline preload="auto"  src="loginVideo.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
      </div>
    </div>
  );
};

export default RegisterPage;
