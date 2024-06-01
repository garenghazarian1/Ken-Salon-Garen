import Image from "next/image";
import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      
      <Image src="/logo01.png" alt="loading" width={100} height={100} priority={false} preload="auto" className={styles.logo} />
    </div>
  );
}
