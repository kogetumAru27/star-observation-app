import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function requireUser(){
    const session = await auth();
    const id = session?.user?.id;
    if(!id){
        redirect("/login");
    }
    return {...session?.user,id}
}