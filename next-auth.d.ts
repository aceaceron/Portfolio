// next-auth.d.ts
import { DefaultSession } from "next-auth";

// Augment the 'User' type to include the 'id' property
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // Add the 'id' property to the user object
      isAuthor?: boolean; // Add the 'isAuthor' property
    } & DefaultSession["user"];
    supabaseAccessToken?: string; // Keep your custom property if you need it
  }

  /**
   * The shape of the user object returned from a provider
   */
  interface User {
    id: string; // Ensure the User interface also has 'id'
  }
}

// Augment the 'JWT' type to include 'id' (from sub) and 'supabaseAccessToken'
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Mirror the user id for convenience, though 'sub' is used.
    supabaseAccessToken?: string;
    isAuthor?: boolean; // Add the 'isAuthor' property
  }
}