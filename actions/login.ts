"use server";
import { signIn,signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { loginSchema } from "@/lib/validation";
export async function loginAction(formData:FormData){
    const raw = {
        email:formData.get("email"),
        password:formData.get("password")
    }
    const parsed = loginSchema.safeParse(raw);
    if(!parsed.success){
        return {success:false,error:parsed.error.issues[0].message}
    }
    try{
        await signIn("credentials",{
            email:parsed.data.email,
            password:parsed.data.password,
            redirect:false
        })
        return {success:true}
    }catch(e){
        if(e instanceof AuthError){
            return {success:false,error:"メールアドレスまたはパスワードが間違っています"}
        }
        throw e;
    }

}
export async function googleAction(){
    console.log("googleが呼ばれた")
    await signIn("google",{redirectTo:"/"})
}

export async function  githubAction(){
    console.log("github呼ばれた")
    await signIn("github",{redirectTo:"/"})
}

export async function logOutAction(){
    await signOut({redirectTo:"/login"})
}