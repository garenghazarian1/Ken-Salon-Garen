import Hero from "@/components/hero/Hero";
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo01.png" sizes="any" />
      </Head>
      <Hero />
    </>
  );
}
