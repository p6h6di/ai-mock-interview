import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
export default {
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;
