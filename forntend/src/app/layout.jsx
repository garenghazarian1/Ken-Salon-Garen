// import { Inter, Lora} from "next/font/google";
import { lora, inter } from "@/app/ui/fonts";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { UserProvider } from "../context/UserContext.jsx";
import AuthProvider from "@/context/auth";
import { CalendarProvider } from "@/context/CalendarContext";
import { StoreProvider } from "@/context/StoreContext";
import { ServiceProvider } from "@/context/ServiceContext";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { DateProvider } from "@/context/DateContext";
import { AppointmentProvider } from "@/context/AppointmentContext";
import styles from "./Layout.module.css";

// const inter = Inter({ subsets: ["latin"] });
// const arapeyStatic = Lora ({
//   weight: '400',
//   display: 'swap',
//   subsets: ['latin']
// });

export const metadata = {
  title: "KEN BEAUTY CENTER",
  description: "BEAUTY CENTER",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className}, ${lora.className} `}>
      <body>
        <div className={styles.layoutContainer}>
          <AuthProvider>
            <UserProvider>
              <StoreProvider>
                <ServiceProvider>
                  <CalendarProvider>
                    <EmployeeProvider>
                      <DateProvider>
                        <AppointmentProvider>
                          <Navbar />

                          <div className={styles.childrenContainer}>
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
        <script
          src="//code.tidio.co/wuxjaut5j0iru5lnq6efealcjpqmlyhw.js"
          async
        ></script>
      </body>
    </html>
  );
}
