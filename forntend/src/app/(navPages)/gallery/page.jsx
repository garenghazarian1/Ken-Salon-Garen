// pages/Gallery.js
import Head from 'next/head';
import InstagramFeed from "@/components/instagram/InstagramFeed";


export default function Gallery() {
  return (
    <>
     <Head>
        <title>Gallery | Our Site</title>
        <meta name="description" content="Explore our curated gallery featuring Instagram content." />
        {/* The async attribute is already set, but ensure that no "defer" or other attributes interfere */}
        <script src="https://cdn.lightwidget.com/widgets/lightwidget.js" async></script>
      </Head>
      <main className="min-h-screen bg-gray-200 p-5">
        <h1 className="text-center text-4xl font-bold my-8 text-gray-800">Welcome to Our Gallery</h1>
        <section>
          <InstagramFeed />
        </section>
      </main>
    </>
  );
}



