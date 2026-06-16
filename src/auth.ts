import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) => {
        const password = credentials?.password;
        if (
          typeof password === "string" &&
          password.length > 0 &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Admin" };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
});

/** Redirects to the login page if there is no authenticated session. */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}
