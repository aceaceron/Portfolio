"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ChatBox(){
  const [messages, setMessages] = useState<{id:string, user:string, text:string}[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // placeholder: fetch latest messages (requires table 'messages' in supabase)
    async function load(){
      if(!supabaseUrl || !supabaseKey) return;
      const { data } = await supabase.from("messages").select("*").order("created_at",{ascending:false}).limit(20);
      if(data) setMessages((data as any).reverse().map((m:any)=>({id:m.id,user:m.user_name,text:m.message})));
    }
    load();
  }, []);

  async function send(){
    if(!text) return;
    // requires Supabase auth & table - placeholder write
    try{
      await supabase.from("messages").insert([{ user_name: "Anon", message: text }]);
      setMessages(prev=>[...prev,{id:Date.now().toString(), user:"You", text}]);
      setText("");
    }catch(e){ console.error(e) }
  }

  return (
    <div className="border rounded p-3">
      <div className="h-48 overflow-auto space-y-2 mb-3">
        {messages.map(m => (
          <div key={m.id} className="text-sm"><strong>{m.user}:</strong> {m.text}</div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Log in with Google to chat (placeholder)" />
        <button onClick={send} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
      </div>
    </div>
  );
}
