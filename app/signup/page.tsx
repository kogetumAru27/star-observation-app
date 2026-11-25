"use client";
import { useActionState,useState,useEffect } from "react";
import { signupAction } from "@/actions/signup";
import { useRouter } from "next/navigation";
import { Eye,EyeOff } from "lucide-react";
type State = {success?:boolean,error?:string}
export default function SignupPage(){
    const [state,formaction] = useActionState(
        async(_:State | null,formData:FormData) => {
            return await signupAction(formData)
        },null
    );
    const [showpass,setShowpass] = useState(false);
    const [confirm_showpass,setconfirm_showpass] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if(state?.success){
            router.push("/")
        }
    },[state,router]);
    return(
        <div className="max-w-md mx-auto mt-12 p-6">
        <h1 className="text-2xl font-bold mb-8 text-center">新規登録</h1>
        <form action={formaction} className="flex flex-col gap-4">
            <label htmlFor="name">ユーザー名</label>
            <input type="text" id="name" name="name" placeholder="例)太郎" className="w-full border rounded px-4 py-3 text-base"/>
            <label htmlFor="email">メールアドレス</label>
            <input type="email" placeholder="example@gmail.com" id="email" name="email" className="w-full border rounded px-4 py-3 text-base"/>
            <label htmlFor="password">パスワード</label>
            <div className="relative">
            <input type={showpass?"text":"password"} placeholder="8文字以上の英数字" id="password" name="password" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-green-600"/>
            <button type="button" onClick={() => setShowpass(!showpass)} className="absolute right-2 top-1/2 -translate-y-1/2">{showpass?<Eye size={18}/>:<EyeOff size={18}/>}</button>
            </div>
            <label htmlFor="confirmpassword">確認用パスワード</label>
            <div className="relative">
            <input type={confirm_showpass?"text":"password"} placeholder="8文字以上の英数字" id="confirmpassword" name="confirmpassword" className="w-full border rounded px-3 py-2 pr-10"/>
            <button type="button" onClick={() => setconfirm_showpass(!confirm_showpass)} className="absolute right-2 top-1/2 -translate-y-1/2">{confirm_showpass?<Eye size={18}/>:<EyeOff size={18}/>}</button>
            </div>
            {state?.success && <p className="text-sm text-green-600">登録完了しました</p>}
            {state?.error && <p className="text-sm  text-red-500">{state.error}</p>}
            <button type="submit" className="w-full py-3 bg-green-600 text-white rounded font-semibold text-base">登録</button>
        </form>
    </div>
    )
}