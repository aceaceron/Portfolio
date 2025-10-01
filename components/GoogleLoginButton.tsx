"use client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||"", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"");

export default function GoogleLoginButton(){
  async function signIn(){
    if(!process.env.NEXT_PUBLIC_SUPABASE_URL) return alert("Supabase not configured");
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  return <button onClick={signIn} className="px-3 py-2 border rounded">Login with Google</button>;
}
