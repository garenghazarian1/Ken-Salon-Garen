
import { Inter, Kalam} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { UserProvider } from "@/context/userContext";
import AuthProvider from "@/context/auth";
import { CalendarProvider } from '@/context/CalendarContext';
import { StoreProvider } from '@/context/StoreContext';
import { ServiceProvider } from '@/context/ServiceContext';
import { EmployeeProvider } from "@/context/EmployeeContext";
import { DateProvider } from "@/context/DateContext";
import { AppointmentProvider } from "@/context/AppointmentContext"


const inter = Inter({ subsets: ["latin"] });
const arapeyStatic = Kalam ({
  weight: '400',  
  display: 'swap',
  subsets: ['latin']
});

export const metadata = {
  title: "KEN BEAUTY CENTER",
  description: "BEAUTY CENTER",
 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className}, ${arapeyStatic.className} `}>
    
      <body >
        <div className="flex flex-col min-h-screen">
          <AuthProvider>
              <UserProvider>
               <StoreProvider>
                <ServiceProvider>
                 <CalendarProvider> 
                  <EmployeeProvider>
                  <DateProvider>
                  <AppointmentProvider>
                    <Navbar />
                    
                      <div className="mt-20 flex-grow">
                        {children}
                      </div>
                     
                    <Footer />
                    </AppointmentProvider>
                    </DateProvider>
                  </EmployeeProvider>  
                </CalendarProvider> 
                </ServiceProvider>
                </StoreProvider>
            </UserProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
