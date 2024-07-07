"use client"
import { useEffect } from 'react';
import styles from "./Portfolio.module.css";

import PageOne from "./aPageOne/PageOne";
import PageTwo from "./bPageTwo/PageTwo";
import PageThree from "./cPageThree/PageThree";
import PageFour from "./dPageFour/PageFour";
import PageFive from "./ePageFive/PageFive"
import PageSix from "./fPageSix/PageSix";
import PageSeven from "./gPageSeven/PageSeven";
import PageEight from "./hPageEight/PageEight";
import PageNine from "./iPageNine/PageNine";
import PageTen from "./jPageTen/PageTen";
import PageEleven from "./kPageEleven/PageEleven";
import PageTwelve from "./lPageTwelve/PageTwelve";
import PageThirteen from './mPageThirteen/PageThirteen';
import PageFourteen from './nPageFourteen/PageFourteen';
import PageFifteen from './oPageFifteen/PageFifteen';
import PageSixteen from './pPageSixteen/PageSixteen';
import PageSeventeen from './qPageSeventeen/PageSeventeen';

export default function Portfolio() {

  useEffect(() => {
    const handleScroll = () => {
      const button = document.getElementById('backToTop');
      if (window.scrollY > 300) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <PageOne/>
    <PageTwo/>
    <PageThree/>
    <PageFour/>
    <PageFive/>
    <PageSix/>
    <PageSeven/>
    <PageEight/>
    <PageNine/>
    <PageTen/>
    <PageEleven/>
    <PageTwelve/>
    <PageThirteen/>
    <PageFourteen/>
    <PageFifteen/>
    <PageSixteen/>
    <PageSeventeen/>
    <button onClick={scrollToTop} id="backToTop" className={styles.backToTop}>
        ↑ Top
      </button>
    </>
  );
}
