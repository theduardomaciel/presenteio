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
                console.log(credentials, req)
                const { email, password } = credentials as Credentials;

                try {
                    const account = await prisma.account.findUnique({
                        where: {
                            email: email
                        }
                    })
                    if (!account) {
                        throw new Error("Não encontramos uma conta com esse e-mail.")
                    }

                    console.log(account.password, password)
                    if (account.password !== password) {
                        throw new Error("E-mail ou senha incorretos.")
                    }

                    return account;
                } catch (error) {
                    console.log(error)
                    throw new Error(error as string)
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            console.log(session, token, user)

            return session
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/error" // Error code passed in query string as ?error=
    }
}
export default NextAuth(authOptions)