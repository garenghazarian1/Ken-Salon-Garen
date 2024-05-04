"use client" // This directive indicates client-only usage in Next.js
import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import styles from './BookViewer.module.css';
import Image from 'next/image';
import Head from 'next/head'

const ImageBook = () => {
  // Create an array of image URLs
  const images = Array.from({ length: 14 }, (_, i) => `/aboutMe/am${i + 1}.jpg`);

  // State to track which image is clicked
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to handle click on image
  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  // Function to handle click on fullscreen image to close it
  const handleCloseFullscreen = () => {
    setSelectedImage(null);
  };

  return (
    <>
    <Head>
        <link
          rel="preload"
          href="/_next/image?url=%2FaboutMe%2Fam11.jpg&w=828&q=75"
          as="image"
        />
      </Head>
    <div className={styles.gallery}>
      {images.map((src, index) => (
        <div key={index} onClick={() => handleImageClick(index)}>
          <Tilt
            className={styles.imageWrapper}
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            glareEnable={true}
            glareMaxOpacity={0.5}
            scale={1.05}
          >
            <Image
              src={src}
              alt={`Gallery Image ${index + 1}`}
              className={styles.img}
              width={1000} height={1000} style={{ width: 'auto', height: 'auto' }}
            />
          </Tilt>
        </div>
      ))}
      {selectedImage !== null && (
        <div className={styles.fullscreen} onClick={handleCloseFullscreen}>
          <Image
            src={images[selectedImage]}
            alt={`Gallery Image ${selectedImage + 1}`}
            className={styles.fullscreenImg}
            width={1000} height={1000}
            
            priority 
          />
        </div>
      )}
    </div>
    </>
  );
};

export default ImageBook;