import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface User {
    isAdmin: boolean;
  }
  interface Session {
    user: User & {
      isAdmin: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
};

export async function clearSession() {
  const cookieStore = cookies();
  
  // Delete all NextAuth.js related cookies
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("next-auth.csrf-token");
  cookieStore.delete("next-auth.callback-url");
  
  // Set an expired session cookie to ensure browser removes it
  cookieStore.set("next-auth.session-token", "", {
    expires: new Date(0),
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  });
  
  // Clear any other potential auth-related cookies
  cookieStore.getAll().forEach(cookie => {
    if (cookie.name.startsWith("next-auth")) {
      cookieStore.delete(cookie.name);
    }
  });
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    await clearSession();
    redirect("/");
  }

  return session;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    await clearSession();
    redirect("/auth/login");
  }

  return session;
} 