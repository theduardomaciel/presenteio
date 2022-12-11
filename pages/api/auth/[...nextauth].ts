import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "../../../lib/prisma";

interface Credentials {
    email: string;
    password: string;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {},
            async authorize(credentials, req) {
                const { email, password } = credentials as Credentials;

                const account = await prisma.account.findUnique({
                    where: {
                        email: email
                    }
                })

                if (!account) {
                    throw new Error("No account found")
                }

                if (account.password !== password) {
                    throw new Error("E-mail or password is incorrect")
                }

                return account;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        error: "/error" // Error code passed in query string as ?error=
    }
}
export default NextAuth(authOptions)