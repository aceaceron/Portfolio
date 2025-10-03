import NextAuth from "next-auth/next";
import type {
  AuthOptions,
  SessionStrategy,
  User,
  Account,
} from "next-auth/core/types";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
import { createClient } from "@supabase/supabase-js";
import { encryptField, decryptField } from "@/lib/crypto-utils"; 

function CustomSupabaseAdapter(): Adapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  async function supabaseFetch(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        "Accept-Profile": "public",
        "Content-Profile": "public",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase error: ${error}`);
    }
    const data = await response.json();
    return data;
  }

  async function getUser(id: string): Promise<AdapterUser | null> {
    const users = await supabaseFetch(`users?id=eq.${id}&select=*`);
    if (!users || users.length === 0) return null;
    const user = users[0];
    return {
      id: user.id,
      email: decryptField(user.email),
      emailVerified: user.email_verified ? new Date(user.email_verified) : null,
      name: decryptField(user.name),
      image: user.image ? decryptField(user.image) : null,
    };
  }

  return {
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      // 🔑 ENCRYPT ALL FIELDS BEFORE STORING
      const [newUser] = await supabaseFetch("users", {
        method: "POST",
        body: JSON.stringify({
          email: encryptField(user.email),
          name: user.name ? encryptField(user.name) : null,
          image: user.image ? encryptField(user.image) : null,
          email_verified: user.emailVerified?.toISOString(),
        }),
      });
      return {
        id: newUser.id,
        email: decryptField(newUser.email),
        name: decryptField(newUser.name),
        emailVerified: newUser.email_verified
          ? new Date(newUser.email_verified)
          : null,
        image: newUser.image ? decryptField(newUser.image) : null,
      };
    },

    getUser,

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      // 🔑 ENCRYPT EMAIL FOR SEARCH
      const encryptedEmail = encryptField(email);
      const users = await supabaseFetch(
        `users?email=eq.${encodeURIComponent(encryptedEmail)}&select=*`
      );
      if (!users || users.length === 0) return null;
      const user = users[0];
      return {
        id: user.id,
        email: decryptField(user.email),
        name: decryptField(user.name),
        emailVerified: user.email_verified
          ? new Date(user.email_verified)
          : null,
        image: user.image ? decryptField(user.image) : null,
      };
    },

    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<AdapterUser | null> {
      const accounts = await supabaseFetch(
        `accounts?provider=eq.${provider}&provider_account_id=eq.${providerAccountId}&select=user_id`
      );
      if (!accounts || accounts.length === 0) return null;
      const userId = accounts[0].user_id;
      return getUser(userId);
    },

    async updateUser(
      user: Partial<AdapterUser> & Pick<AdapterUser, "id">
    ): Promise<AdapterUser> {
      const updates: any = {};
      // 🔑 ENCRYPT FIELDS IF THEY EXIST (handle null values)
      if (user.email !== undefined) 
        updates.email = user.email ? encryptField(user.email) : null;
      if (user.name !== undefined) 
        updates.name = user.name ? encryptField(user.name) : null;
      if (user.image !== undefined) 
        updates.image = user.image ? encryptField(user.image) : null;
      if (user.emailVerified !== undefined)
        updates.email_verified = user.emailVerified?.toISOString();

      const [updated] = await supabaseFetch(`users?id=eq.${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      return {
        id: updated.id,
        email: decryptField(updated.email),
        emailVerified: updated.email_verified
          ? new Date(updated.email_verified)
          : null,
        name: decryptField(updated.name),
        image: updated.image ? decryptField(updated.image) : null,
      };
    },

    async deleteUser(userId: string): Promise<void> {
      await supabaseFetch(`users?id=eq.${userId}`, { method: "DELETE" });
    },

    async linkAccount(
      account: AdapterAccount
    ): Promise<AdapterAccount | null | undefined> {
      await supabaseFetch("accounts", {
        method: "POST",
        body: JSON.stringify({
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        }),
      });
      return account;
    },

    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<void> {
      await supabaseFetch(
        `accounts?provider=eq.${provider}&provider_account_id=eq.${providerAccountId}`,
        { method: "DELETE" }
      );
    },
  };
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: "public" },
  }
);

const authOptions: AuthOptions = {
  adapter: CustomSupabaseAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async session({ session, token }: { session: any; token: JWT }) {
      session.supabaseAccessToken = token.supabaseAccessToken;
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.isAuthor = token.isAuthor || false;
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.sub = user.id;
      }
      if (token.sub) {
        const { data: userData } = await supabaseAdmin
          .from("users")
          .select("is_author")
          .eq("id", token.sub)
          .single();
        token.isAuthor = userData?.is_author || false;
      }
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret && token.sub) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          sub: token.sub,
          email: token.email,
          role: "authenticated",
        };
        token.supabaseAccessToken = "";
      }
      return token;
    },
  },
  pages: {
    signIn: "/chat",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };