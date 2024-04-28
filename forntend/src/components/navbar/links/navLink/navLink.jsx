"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ item }) => {
  const pathName = usePathname();

  return (
    <Link
      href={item.path} 
      className={`text-sm cursor-pointer text-gray-100 p-4 rounded-full  transition duration-300 ease-in-out 
            ${pathName === item.path
              ? 'text-green-500'  
            : 'text-green-100 hover:bg-gray-600 hover:text-green-600' 
            }`}
    >
      {item.title}
    </Link>
  );
};

export default NavLink;
