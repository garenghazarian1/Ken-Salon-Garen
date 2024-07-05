"use client"

import styles from "./PageThree.module.css";

export default function Portfolio() {

  return (
    <>
    {/* PAGE03 */}
    <div className={styles.containerC}>
        <div className={styles.leftPaneC}>
          <p className={`${styles.textCA} ${styles.textAnimationCA}`}>Where Beauty Blossoms</p>
          <p className={`${styles.textCB} ${styles.textAnimationCB}`}>and Confidence Reigns</p>
        </div>
        <div className={styles.rightPaneC}>
          <video className={styles.videoC} controls muted autoPlay loop>
              <source src="/PortfolioVideo01.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
      </div>
      </>
      );
    }