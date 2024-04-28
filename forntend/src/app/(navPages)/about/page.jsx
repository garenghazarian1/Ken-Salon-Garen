import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import {headers} from "next/headers";


export default async function About() {
  const session = await getServerSession(options);
  const headersList = headers();
  const referer = headersList.get("referer") || "/";

  if (!session) {
    redirect("/login?callbackUrl=" + referer);
  }
  return (
    <div>About</div>
  )
}
