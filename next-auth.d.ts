import type { FavId } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      favIds: FavId[]
    } & DefaultSession["user"];
  }
  interface User {
    favIds: FavId[]
  }
}
