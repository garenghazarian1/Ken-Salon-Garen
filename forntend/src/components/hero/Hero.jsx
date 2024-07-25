"use client";

import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <>
      <div className={styles.relative}>
        <video
          src="/hero.mp4"
          alt="Salon Video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={styles.video}
        />
        <div className={styles.absolute}>
          <div className={styles.gradient}>
            <div className={styles.gradientA}>
              <h1 className={styles.title}>
                Adv
                <span className={styles.green}>anced</span>
                <br />
                Beauty Solutions
              </h1>
              <p className={styles.subtitle}>
                Visit our luxurious salon in the heart of the UAE
                <br /> to discover a world where brilliance and beauty meet.
              </p>
              <div className={styles.buttonContainer}>
                <Link href="/stores">
                  <span className={styles.button}>Book Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.flexContainer}>
        <div className={styles.flexContainer1}>
          <div className={styles.smallSlideShow} />
          <div className={styles.imageContent}>
            <h1 className={styles.mainTitle}>
              <span className={styles.subTitle}>
                Your Beauty <span className={styles.endTitle}>Haven</span>
              </span>
            </h1>
            <div className={styles.paragraph}>
              <p>
                Visit our luxurious salon in the heart of the UAE to discover a
                world where brilliance and beauty meet. Our team of specialists
                is committed to providing a wide range of services, including
                hair styling and transformation for both men and women, nails,
                facials, and solarium treatments. We stand out as the top beauty
                salon in the United Arab Emirates because of our dedication to
                quality, professionalism, and customer satisfaction. Embrace the
                pleasure that you deserve and love an unforgettable experience
                that will leave you feeling healthy and brilliant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
