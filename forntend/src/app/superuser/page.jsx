
// "use client"
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import CreateStore from "@/components/store/create-store/create-store"
import UpdateStoreForm from "@/components/store/UpdateStoreForm";
import CreateServicePage from "@/components/salonServices/create-service";
import UpdateServicePage from "@/components/salonServices/update-service";
import EmployeeList from "@/components/employee/EmployeeList";
import CreateEmployee from "@/components/employee/CreateEmployee";
import UpdateEmployee from "@/components/employee/UpdateEmployee";
import CreateStoreHoursForm from "@/components/store/CreateStoreHoursForm";
import UpdateStoreHour from "@/components/store/UpdateStoreHour";
import CreateStoreClosureForm from "@/components/store/CreateStoreClosureForm";
import UpdateStoreClosureForm from "@/components/store/UpdateStoreClosureForm";

export default async function Superuser() {
  const session = await getServerSession(options);

  if (!session || session.user.role !== 'owner') {
    
    redirect("/login");
  }

  return (
    <div className="m-20 text-white bg-gray-900 p-4 flex flex-col">
      <h1>Superuser Dashboard</h1> 
      <div >
      <CreateStore/>
      <UpdateStoreForm />
      <CreateStoreHoursForm/> 
      <UpdateStoreHour/>
      <CreateStoreClosureForm/>
      <UpdateStoreClosureForm/>
      </div>
      <div className="my-8 border-t border-white"></div>
      <CreateServicePage/>
      <UpdateServicePage/>
      <div className="my-8 border-t border-white"></div>
      <EmployeeList/>
      <CreateEmployee/>
      <UpdateEmployee/>
      </div> 
  );
}
