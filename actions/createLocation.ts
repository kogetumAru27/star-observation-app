"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/authcheck";
import { locationSchema } from "@/lib/validation";
export default async function createLocation(formData:FormData){
    // 1. ログイン確認
    const user =  await requireUser();
    
    // 2. formDataから name, lat, lng を取る
    const raw = {
        name:formData.get("name"),
        lng:formData.get("lng"),
        lat:formData.get("lat")
    }
    console.log(typeof raw.lat)
    console.log(raw)
    // 3. Zodで検証
    const parsed = locationSchema.safeParse(raw);
    if(!parsed.success){
        return {success:false,error:parsed.error.issues[0].message}
    }
    // 4. Prismaで保存(userId を入れる)
    try{
        await prisma.location.create({
            data:{
                name:parsed.data.name,
                lng:parsed.data.lng,
                lat:parsed.data.lat,
                userId:user.id
            }
        })
        revalidatePath("/locations")
        return{success:true}
    }catch(e){
        // 5. 結果を返す
        console.log(e,"ここが原因");
        return {success:false,error:"観測値の登録に失敗しました。"}
    }

}


