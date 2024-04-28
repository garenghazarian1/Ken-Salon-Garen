"use client"
import Link from "next/link";

export default function Home() {
  
  return (
    <>
    <div className="relative w-full">
          <video src="/hero.mp4" alt="Salon Video" autoPlay muted loop style={{ height: "700px", width: '100%', objectFit: "cover" }}/>
          <div className="absolute inset-0">
          <div className="h-full w-full absolute bg-gradient-to-t from-black  to-transparent flex justify-end items-center">
            <div>
              <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                Adv
                <span className="bg-clip-text text-transparent bg-green-500">
                  anced
                </span>
                <br></br>Beauty Solutions
              </h1>
              <p className=" text-sx text-white  mb-8 mr-6 text-center md:text-left">
              Visit our luxurious salon in the heart of the UAE<br/> to discover a world where brilliance and beauty meet.
              </p>
                <div className="flex justify-center w-full">
                  <Link href="/stores">
                    <span className="inline-block cursor-pointer text-center mx-auto lg:mx-0 hover:underline bg-green-500 text-white font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                      Book Now
                    </span>
                  </Link>
                </div>
            </div>
          </div>
        </div>
    </div>

    
    <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mt-10 ">
      <div className="flex flex-col ml-6 ">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-500">
          Elegance <span className="text-white">Redefined:</span> <br/> <span className="text-4xl md:text-5xl lg:text-6xl text-white ml-8">Your Beauty <span className="text-green-500">Haven</span></span>
        </h1>
      <div className="w-2/3 ml-4">
        <p className="mt-8 text-sm md:text-md text-gray-300 leading-relaxed">
          Visit our luxurious salon in the heart of the UAE to discover a world where brilliance and beauty meet. Our team of specialists is committed to providing a wide range of services, including hair styling and transformation for both men and women, nails, facials, and solarium treatments. We stand out as the top beauty salon in the United Arab Emirates because of our dedication to quality, professionalism, and customer satisfaction. Embrace the pleasure that you deserve and love an unforgettable experience that will leave you feeling healthy and brilliant.
        </p>
      </div>
    </div>
    <img
          src="/ken.jpg"
          alt="logo"
          className="object-cover  rounded-full"
          width={500}
          height={500}
        />
    </div>
   
  
    </>
  );
}
