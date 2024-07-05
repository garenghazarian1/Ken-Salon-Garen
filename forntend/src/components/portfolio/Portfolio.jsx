"use client"
import Image from "next/image";
import styles from "./Portfolio.module.css";
import {gv, inter, bad} from "@/app/ui/fonts"


export default function Portfolio() {

  const handleScroll = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
    {/* PAGE01 */}
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <Image src="/logo01.png" alt="Ken Salon Portfolio" width={250} height={250} />
        <div className={styles.portfolioText}>PORTFOLIO</div>
      </div>
      <div className={styles.rightPane}>
        <Image src="/ken.jpg" alt="Ken Salon Portfolio" layout="fill" objectFit="cover" />
      </div>
    </div>


    {/* PAGE02 */}
    <div className={styles.tableOfContents}>
      <div className={styles.tocHeaderContainer}>
      <p className={`${styles.tocHeader} ${inter.className}`}>Table of 
        <div><span className={`${styles.tocHeaderUnderline} ${gv.className}`}>Content</span></div></p>
        </div>
      <div className={styles.tocItems}>
      <div className={styles.tocItem} onClick={() => handleScroll("whoWeAre")}>
            <p className={styles.tocNum}>01</p>
            <p className={styles.tocText}>Who We Are</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>02</p>
        <p className={styles.tocText}>Our Locations</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>03</p>
        <p className={styles.tocText}>Social Media</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>04</p>
        <p className={styles.tocText}>The Designer Behind Ken Salon</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>05</p>
        <p className={styles.tocText}>Vision</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>06</p>
        <p className={styles.tocText}>Mission</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>07</p>
        <p className={styles.tocText}>Philosophy</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>08</p>
        <p className={styles.tocText}>Core Values</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>09</p>
        <p className={styles.tocText}> Services</p></div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>10</p>
        <p className={styles.tocText}>Clients We Work With</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>11</p>
        <p className={styles.tocText}>Community Engagement</p> </div>
        <div className={styles.tocItem}>
            <p className={styles.tocNum}>12</p>
        <p className={styles.tocText}>Press & Media Features</p> </div>
      </div>
    </div>
    {/* PAGE03 */}
    <div className={styles.containerA}>
        <div className={styles.leftPaneA}>
        <p className={`${styles.textA} ${styles.textAnimationA}`}>Where Beauty Blossoms</p>
        <p className={`${styles.textB} ${styles.textAnimationB}`}>and Confidence Reigns</p>
        </div>
        <div className={styles.rightPaneA}>
        <video className={styles.videoA} controls muted autoPlay loop>
            <source src="/PortfolioVideo01.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      {/* PAGE04 */}

      <div className={styles.containerB}>
      <div className={styles.leftPaneB}>
        <Image src="/logo01.png" alt="K Logo" className={styles.neonImage} width={250} height={250} />
      </div>
      <div id="whoWeAre" className={styles.rightPaneB}>
        <p className={`${inter.className} ${styles.textNumA}`}>01</p>
        <p className={`${inter.className} ${styles.textNumB}`}>Who</p>
        <p className={`${styles.textNumC} ${bad.className}`}>we are</p>
      </div>
    </div>
    </>
  );
}
