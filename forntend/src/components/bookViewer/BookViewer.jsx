"use client" // This directive indicates client-only usage in Next.js
import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import styles from './BookViewer.module.css';

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
            <img
              src={src}
              alt={`Gallery Image ${index + 1}`}
              className={styles.img}
            />
          </Tilt>
        </div>
      ))}
      {selectedImage !== null && (
        <div className={styles.fullscreen} onClick={handleCloseFullscreen}>
          <img
            src={images[selectedImage]}
            alt={`Gallery Image ${selectedImage + 1}`}
            className={styles.fullscreenImg}
          />
        </div>
      )}
    </div>
  );
};

export default ImageBook;