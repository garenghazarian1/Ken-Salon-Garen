"use client"
import Image from "next/image";
import styles from "./Portfolio.module.css";
import {gv, inter, bad, abril} from "@/app/ui/fonts"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import { EffectFlip, Pagination } from 'swiper/modules';


export default function Portfolio() {

  const handleScroll = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
    {/* PAGE01 */}
    <div className={styles.containerA}>
      <div className={styles.leftPaneA}>
        <Image src="/logo01.png" alt="Ken Salon Portfolio" width={350} height={350} className={styles.imageA} />
        <div className={styles.portfolioTextA}>PORTFOLIO</div> 
      </div>
      <div className={styles.rightPaneA}>
        <Image src="/ken.jpg" alt="Ken Salon Portfolio" width={500} height={500}  />
      </div>
    </div>


    {/* PAGE02 */}
    <div className={styles.containerB}>
      <div className={styles.containerBHeader}>
      <p className={`${styles.headerB} ${inter.className}`}>Table of 
        <div><span className={`${styles.headerBUnderline} ${gv.className}`}>Content</span></div></p>
        </div>
      <div className={styles.itemsB}>
      <div className={styles.itemB} onClick={() => handleScroll("whoWeAre")}>
            <p className={styles.numB}>01</p>
            <p className={styles.textB}>Who We Are</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>02</p>
        <p className={styles.textB}>Our Locations</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>03</p>
        <p className={styles.textB}>Social Media</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>04</p>
        <p className={styles.textB}>The Designer Behind Ken Salon</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>05</p>
        <p className={styles.textB}>Vision</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>06</p>
        <p className={styles.textB}>Mission</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>07</p>
        <p className={styles.textB}>Philosophy</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>08</p>
        <p className={styles.textB}>Core Values</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>09</p>
        <p className={styles.textB}> Services</p></div>
        <div className={styles.itemB}>
            <p className={styles.numB}>10</p>
        <p className={styles.textB}>Clients We Work With</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>11</p>
        <p className={styles.textB}>Community Engagement</p> </div>
        <div className={styles.itemB}>
            <p className={styles.numB}>12</p>
        <p className={styles.textB}>Press & Media Features</p> </div>
      </div>
    </div>

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

       {/* PAGE04  */}

      <div className={styles.containerD}>
      <div className={styles.leftPaneD}>
        <Image src="/logo01.png" alt="K Logo" className={styles.imageD} width={250} height={250} />
      </div>
      <div id="whoWeAre" className={styles.rightPaneD}>
        <p className={`${inter.className} ${styles.textNumDA}`}>01</p>
        <p className={`${inter.className} ${styles.textNumDB}`}>Who</p>
        <p className={`${styles.textNumDC} ${bad.className}`}>we are</p>
      </div>
    </div>

     {/* PAGE05  */}
    <div className={styles.containerE}>
        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
              <Image src="/portfolio/portfolioA001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/portfolio/portfolioA002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/portfolio/portfolioA003.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
            </SwiperSlide>
          </Swiper>
          </div>
          <div className={styles.rightPaneE}>
            <p className={`${styles.textE} ${bad.className}`}>Nestled within the vibrant heart of the UAE, Ken Salon stands as an ethereal oasis where beauty is elevated to an art form.</p>
          </div>
        </div>



        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <p className={`${styles.textE} ${bad.className}`}>As you step through the doors, a world of luxury and tranquility unfolds, enveloping you in an atmosphere that whispers of indulgence and rejuvenation.</p>
          </div>
          <div className={styles.rightPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
          <Image src="/portfolio/portfolioB001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioB002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioB003.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          </Swiper>
          </div>
          
        </div>



        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
          <Image src="/portfolio/portfolioC001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioC002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioC003.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioC004.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          </Swiper>
          </div>
          <div className={styles.rightPaneE}>
          <p className={`${styles.textE} ${bad.className}`}>Founded by the visionary Vicken Ghazarian, whose passion for hair and beauty transcends mere expertise, this sanctuary beckons those who seek to embrace their inner radiance and outer allure. </p>
          </div>
        </div>

        <div className={styles.subContainerE}>
          <div className={styles.leftPaneE}>
          <p className={`${styles.textE} ${bad.className}`}>With two premier locations in Abu Dhabi, Ken Salon offers an exclusive VIP experience where every moment is tailored to your unique desires.</p>
          </div>
          <div className={styles.rightPaneE}>
          <Swiper
            effect="flip"
            grabCursor={true}
            flipEffect={{ slideShadows: true }}
            pagination={{ clickable: true }}
            modules={[EffectFlip, Pagination]}
            className={styles.swiper}
          >
            <SwiperSlide>
          <Image src="/portfolio/portfolioD001.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          <SwiperSlide>
          <Image src="/portfolio/portfolioD002.jpg" alt="K Logo" className={styles.rightLeftImagesPageE} width={300} height={300} />
          </SwiperSlide>
          </Swiper>
          </div>
        </div>
    </div>
    </>
  );
}
