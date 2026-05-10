import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciais inválidas");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    // Crie um usuário admin se nenhum usuário existir
                    const userCount = await prisma.user.count();
                    if (userCount === 0 && credentials.email === "admin@stockmaster.com") {
                        const hashedPassword = await bcrypt.hash(credentials.password, 10);
                        const newUser = await prisma.user.create({
                            data: {
                                email: credentials.email,
                                password: hashedPassword,
                                name: "Admin",
                            }
                        });
                        return { id: newUser.id, email: newUser.email, name: newUser.name };
                    }
                    throw new Error("Usuário não encontrado");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Senha incorreta");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecretkey123",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
