import styles from "./PageTwelve.module.css"
import {inter, bad} from "@/app/ui/fonts"
export default function PageTwelve() {
  return (
    <>
     <div className={styles.container}>
      <div className={styles.header}>
      <h2 className={`${styles.headerH} ${bad.className}`}>Vicken Ghazarian</h2>
      </div>
        <div className={styles.content}>
        <video src="/portfolio/description01.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
        
        <p className={styles.headerP}>At the heart of Ken Salon&apos;s inception lies the talent and vision of its founder</p>
        </div>
        
      
      <div className={styles.content}>
        <p className={styles.headerP}>
        A maestro in hair artistry, his journey is one of relentless passion and pursuit of perfection. His hands,
          almost magical in their deftness, transform tresses into masterpieces, earning him legendary status and the
          prestigious role of Schwarzkopf Academy ambassador in the GCC.
        </p>
        <video src="/portfolio/description02.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
        </div>
        <div className={styles.content}>
        <video src="/portfolio/description03.mp4" alt="Salon Video" autoPlay muted loop playsInline preload="auto" className={styles.video}/>
        <p className={styles.headerP}>
          Vicken&apos;s magic extends beyond technical prowess; he sees the beauty within every soul. Ken Salon was born from
          his burning desire to create a sanctuary where this inner radiance could be celebrated.
        </p>
        
        </div>
     
    </div>
    </>
  )
}
