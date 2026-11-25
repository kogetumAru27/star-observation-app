"use server";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validation";

export  async function signupAction(formData:FormData){
    const raw = {
        name:formData.get("name"),
        email:formData.get("email"),
        password:formData.get("password"),
        confirmpassword:formData.get("confirmpassword")
    }
    const parsed = signupSchema.safeParse(raw);
    if(!parsed.success){
        return {success:false,error:parsed.error.issues[0].message}
    }
    const hashedPassword = await bcrypt.hash(parsed.data.password,10);
    try{
        const is_email = await prisma.user.findUnique({
            where:{email:parsed.data.email}
        });
        if(is_email){
            return {success:false,error:"このメールアドレスはすでに登録されています"}
        }
        await prisma.user.create({
            data:{
                email:parsed.data.email,
                name:parsed.data.name,
                password:hashedPassword
            }
        })
        await signIn("credentials",{
            email:parsed.data.email,
            password:parsed.data.password,
            redirect:false
        })
        return {success:true}

    }catch(e){
        console.log(e,"エラー確認用")
        return {success:false,error:"登録処理に失敗しました。もう一度お試しください"}
    }
}