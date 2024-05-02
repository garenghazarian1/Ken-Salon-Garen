"use client";



const Contact = () => {


  return (
    <div>
      
      <div className="container mx-auto px-4 py-8">
        

        
        <div className="flex">
          {/* Address */}
          <div className="w-1/3 pr-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Address:</h2>
              <p>Marina Mall Ring Road,</p>
              <p>Al Marina,</p>
              <p>Abu Dhabi</p>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Ring us on</h2>
              <p>Mobile: +971 55 557 0029</p>
              <p>Phone: (02) 635 9993</p>
            </div>
          </div>
          {/* Google Map */}
          <div className="mb-8 w-2/3 rounded-lg overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=Marina%20Mall%20Ring%20Road,%20Al%20Marina,%20Abu%20Dhabi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>
        <div className="flex">
          {/* Address */}
          <div className="w-1/3 pr-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Address:</h2>
              <p>Galleria Mall,</p>
              <p>Al Wasl,</p>
              <p>Dubai</p>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Ring us on</h2>
              <p>Mobile: +971 55 557 0029</p>
              <p>Phone: (02) 635 9993</p>
            </div>
          </div>
          {/* Google Map */}
          <div className="mb-8 w-2/3 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115516.99580284648!2d55.171735594894194!3d25.206388317448948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f426ec6734479%3A0x8c298c0404e536b7!2sGalleria%20Mall%20Al%20Wasl!5e0!3m2!1sen!2sde!4v1713218517938!5m2!1sen!2sde" 
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
