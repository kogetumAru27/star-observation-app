import { z }  from "zod";
export const loginSchema = z.object({
    email:z.email("正しいメールアドレスを入力してください"),
    password:z.string().min(1,"パスワードを入力してください")
});

export const signupSchema = z.object({
    name:z.string().min(1,"ユーザー名を入力してください"),
    email:z.email("正しいメールアドレスを入力してください"),
    password:z.string()
    .max(16,"パスワードは16文字以内にしてください")
    .min(8,"パスワードは8文字以内にしてください") ,
    confirmpassword:z.string()
}).superRefine((data,ctx) => {
    if(data.password !== data.confirmpassword){
        ctx.addIssue({
            path:["confirmpassword"],
            message:"パスワードが一致しません",
            code:"custom"
        })
    }
})

export const locationSchema = z.object({
    name: z.string().trim().min(1, "観測地の名前を入力してください").max(50, "50文字以内で入力してください"),
    lat: z.string().trim().min(1,"緯度を入力してください").transform(Number).pipe(z.number("緯度は数値で入力してください").min(-90,"緯度は-90〜90で入力してください").max(90,"緯度は-90〜90で入力してください")),
    lng: z.string().trim().min(1,"経度を入力してください").transform(Number).pipe(z.number("経度は数値で入力してください").min(-180,"経度は-180〜180で入力してください").max(180,"経度は-180〜180で入力してください")),
  });