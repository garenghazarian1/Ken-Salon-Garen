"use client"
import React, { useEffect, useRef, useState } from 'react';
import styles from './BookViewer.module.css';  

const ImageBook = () => {
    const galleryRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const triggerHeight = windowHeight * 0.5;  // Trigger at 50% of the viewport height

      // Calculate the current index based on the scroll position
      const index = Math.floor((scrollY + triggerHeight) / windowHeight);
      setCurrentIndex(index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const images = Array.from({ length: 14 }, (_, i) => `/aboutMe/am${i + 1}.jpg`);
  return (
    <div ref={galleryRef} className={styles.gallery}>
      {images.map((src, index) => (
        <div key={index} className={`${styles.imageWrapper} ${index < currentIndex ? (index % 2 === 0 ? styles.slideLeft : styles.slideRight) : ''}`}>
          <img className={styles.img}
            src={src}
            alt={`Gallery Image ${index + 1}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageBook;
