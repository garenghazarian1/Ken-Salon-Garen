
"use client"
import{ useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/context/userContext';
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import styles from "@/app/(auth)/register/RegisterPage.module.css"


const RegisterPage = () => {
 const router = useRouter();
  const { register, error } = useRegister();
  const [formData, setFormData] = useState({name: '', email: '', password: '', confirmPassword: '', image: null,
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
      console.log(error.message, 'Passwords do not match client side');
    }

     // Create a FormData instance
  const formDataToSend = new FormData();
  formDataToSend.append('name', formData.name);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('password', formData.password);
  formDataToSend.append('confirmPassword', formData.confirmPassword);
  
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
            <video className={styles.videoStyle} autoPlay  loop  muted  src="loginVideo.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
          </div>
          <div className='flex flex-1 flex-col  items-center w-3/4 md:w-auto h-screen bg-green-300 bg-opacity-50  '>
          <div className={styles.circle + ' ' + styles['circle-green']}></div>
          <div className={styles.circle + ' ' + styles['circle-gray']}></div>
      <form onSubmit={handleSubmit} >
        <h2 className="text-2xl font-bold mb-4 mt-4 text-gray-100">Register</h2>
        {/* Name field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-100">Name</label>
          <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} className=" text-black mt-1 p-2 w-full border rounded-md" />
        </div>
        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email</label>
          <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} className="text-black mt-1 p-2 w-full border rounded-md" />
        </div>
         {/* Password field with toggle */}
         <div className="mb-4 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
          <input type={showPassword ? "text" : "password"} id="password" name="password" onChange={handleChange} value={formData.password} className="text-black mt-1 p-2 w-full border rounded-md" />
          <span onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-2 pt-5  flex items-center cursor-pointer text-gray-700">
            {showPassword ? <span className='text-sm'>Hide</span> : <span  className='text-sm'>Show</span>}
          </span>
        </div>
        {/* Confirm Password field with toggle */}
        <div className="mb-4 relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-100">Confirm Password</label>
          <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} className="text-black mt-1 p-2 w-full border rounded-md" />
          <span onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-2 pt-5  flex items-center cursor-pointer text-gray-700">
            {showPassword ?  <span className='text-sm'>Hide</span> : <span  className='text-sm'>Show</span> }
          </span>
        </div>
        
        <div className="mb-4 relative">
          {/* Image upload field */}
          <label htmlFor="imageUpload" className="block text-gray-300 text-sm font-bold mb-2">Profile Image</label>
          <input type="file" id="imageUpload" name="image" onChange={handleImageSelect} className="mt-1 p-2 w-full border rounded-md opacity-0 absolute inset-0 cursor-pointer" />
          <div className="p-2 w-full border rounded-md text-gray-300 flex justify-between items-center">
            <span>{formData.image ? formData.image.name : "Choose file..."}</span>
          </div>
          {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Preview" className="mt-2 max-w-xs max-h-32" />}
        </div>

        {/* Submit button */}
        <button type="submit" className=" flex justify-center text-sm cursor-pointer text-gray-100 p-4 rounded-lg  transition duration-300 ease-in-out   hover:text-green-500 hover:bg-gray-200" >Register</button>
      </form>
      <div className="mt-4">
        <Link href="/login" className="text-white hover:underline">
          Already registered? Login here.
        </Link>
      </div>


 {/* Google Sign-in Button */}
 <button type="button" onClick={handleGoogleSignIn} className="mt-2 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 text-white font-semibold py-2 px-4 rounded block text-center transition-all duration-700 ease-in-out">
          Sign in with Google
        </button>

      <div className="mt-2">
        <Link href="/" className="text-white hover:underline">
          Back to main page
        </Link>
      </div>
      </div>
      <div className={styles.videoContainer}>
        <video className={styles.videoStyle1} autoPlay  loop  muted  src="loginVideo1.mp4" type="video/mp4"> Your browser does not support the video tag.</video>
      </div>
    </div>
  );
};

export default RegisterPage;
