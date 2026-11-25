import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
export const {handlers,signIn,signOut,auth} = NextAuth({
    adapter:PrismaAdapter(prisma),
    providers:[Github,Google,
        Credentials({
            credentials:{
                email:{},
                password:{}
            },
            authorize:async(credentials) => {
                const email = credentials.email as string;
                const password = credentials.password as string;
                const user = await prisma.user.findUnique({
                    where:{email}
                });
                if(!user || !user.password){
                    return null
                }
                const isValid = await bcrypt.compare(password,user.password);
                if(!isValid){
                    return null
                }
                return user
            }
        })
    ],
    session:{strategy:"jwt"},
    callbacks:{
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
            }
            if (token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string }
                });
                if (dbUser) {
                    token.name = dbUser.name;
                    // 他に、tokenに反映したい最新情報があればここに追加
                }
            }
            return token;
        }
    }
})