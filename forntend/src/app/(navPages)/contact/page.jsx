"use client";
import { useStore } from '@/context/StoreContext'; 
import styles from './Contact.module.css';
import Tilt from 'react-parallax-tilt';

const Contact = () => {
  const { stores, loading, error } = useStore(); 

  if (error) return <p className={styles.error}>Error: {error}</p>; 
  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      {stores.map((store) => (
        <div key={store._id} className={styles.flex}>
          {/* Address and Contact Block for Each Store */}
          <Tilt
            className={styles.imageWrapper}
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            glareEnable={true}
            glareMaxOpacity={0.5}
            scale={1.05}
          >
          <div className={styles.section}>
            <h2 className={styles.sectionHeader}>{store.name}</h2>
            <div>
              <p className={styles.p} >{store.street}</p>
              <p className={styles.p} >{store.city}, {store.state} {store.zipCode}</p>
              <p className={styles.p} >{store.country}</p>
            </div>
            <div style={{ marginTop: '32px' }}>
              
              <p className={styles.p}>Phone: <a className={styles.a} href={`tel:${store.mobile}`}>{store.phone}</a></p>
              <p className={styles.p}>Mobile: <a className={styles.a} href={`tel:${store.mobile}`}>{store.mobile}</a></p>
              <p className={styles.p}>Barber Mobile:: <a className={styles.a} href={`tel:${store.mobile}`}>{store.mobileOne}</a></p>
              <p className={styles.p}>Email: <a className={styles.a} href={`mailto:${store.email}`}>{store.email}</a></p>
            </div>
            <div className={styles.mapContainer}>
            <iframe
              className={styles.map}
              src={`https://www.google.com/maps?q=${encodeURIComponent(store.street + ', ' + store.city + ', ' + store.state + ', ' + store.zipCode)}&output=embed`}
              allowFullScreen=""
              loading="lazy"
              title={`${store.name} Location`}
            ></iframe>
          </div>
          </div>
          </Tilt>
        </div>
      ))}
    </div>
  );
};

export default Contact;
