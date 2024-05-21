
// "use client"
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import CreateStore from "@/components/store/create-store/create-store"
import UpdateStoreForm from "@/components/store/update-store/UpdateStoreForm";
import CreateServicePage from "@/components/salonServices/createServices/CreateServices";
import UpdateServicePage from "@/components/salonServices/updateServices/UpdateServices";
import EmployeeList from "@/components/employee/employeeList/EmployeeList";
import CreateEmployee from "@/components/employee/createEmployee/CreateEmployee";
import UpdateEmployee from "@/components/employee/UpdateEmployee";
import CreateStoreHoursForm from "@/components/store/createStoreHoursForm/CreateStoreHoursForm";
import UpdateStoreHour from "@/components/store/updateStoreHour/UpdateStoreHour";
import CreateStoreClosureForm from "@/components/store/createStoreClosureForm/CreateStoreClosureForm";
import UpdateStoreClosureForm from "@/components/store/updateStoreClosureForm/UpdateStoreClosureForm";

export default async function Superuser() {
  const session = await getServerSession(options);

  if (!session || session.user.role !== 'owner') {
    
    redirect("/login");
  }

  return (
    <div className=" text-white bg-gray-900 p-4 flex flex-col">
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
