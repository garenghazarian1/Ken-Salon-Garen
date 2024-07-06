"use client"
import styles from "./Portfolio.module.css";

import PageOne from "./aPageOne/PageOne";
import PageTwo from "./bPageTwo/PageTwo";
import PageThree from "./cPageThree/PageThree";
import PageFour from "./dPageFour/PageFour";
import PageFive from "./ePageFive/PageFive"
import PageSix from "./fPageSix/PageSix";
import PageSeven from "./gPageSeven/PageSeven";

export default function Portfolio() {

  return (
    <>
    <PageOne/>
    <PageTwo/>
    <PageThree/>
    <PageFour/>
    <PageFive/>
    <PageSix/>
    <PageSeven/>
    </>
  );
}
