"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase.client";

interface UserMeta {
  image: string | null;
  is_author: boolean | null;
}

export interface Message {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
  reply_to_message_id?: string;
  reply_count?: number;
  parentMessage?: Message | null;
  users?: UserMeta | null;
}

async function decryptMessages(encrypted: Message[]): Promise<Message[]> {
  try {
    const response = await fetch("/api/auth/decrypt-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: encrypted }),
    });
    if (!response.ok) return encrypted;
    const { decryptedMessages } = await response.json();
    return decryptedMessages;
  } catch {
    return encrypted;
  }
}

export default function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cache user metadata to avoid extra DB round-trips per real-time INSERT
  const userCache = useRef<Map<string, UserMeta>>(new Map());

  useEffect(() => {
    let cancelled = false;

    async function fetchMessages() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*, reply_count, users:user_id (image, is_author)")
        .order("created_at", { ascending: true });

      if (!error && data && !cancelled) {
        // Seed the user cache from the initial join result
        data.forEach((d: any) => {
          if (d.user_id && d.users) {
            userCache.current.set(d.user_id, d.users);
          }
        });

        const decrypted = await decryptMessages(
          data.map((d: any) => ({
            id: d.id,
            user_id: d.user_id,
            user_name: d.user_name,
            text: d.text,
            created_at: d.created_at,
            reply_to_message_id: d.reply_to_message_id,
            reply_count: d.reply_count,
            users: d.users || null,
          }))
        );
        if (!cancelled) setMessages(decrypted);
      }
      if (!cancelled) setIsLoading(false);
    }

    fetchMessages();

    const channel = supabase
      .channel("home-messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const newMsg = payload.new as Message;

          // Use cache first — only fetch from DB if this user is unseen
          let userMeta = userCache.current.get(newMsg.user_id) ?? null;
          if (!userMeta) {
            const { data: userData } = await supabase
              .from("users")
              .select("image, is_author")
              .eq("id", newMsg.user_id)
              .single();
            if (userData) {
              userMeta = { image: userData.image, is_author: userData.is_author };
              userCache.current.set(newMsg.user_id, userMeta);
            }
          }

          const enriched: Message = { ...newMsg, users: userMeta };
          const [decrypted] = await decryptMessages([enriched]);

          if (!cancelled) {
            setMessages((prev) =>
              prev.some((m) => m.id === decrypted.id) ? prev : [...prev, decrypted]
            );
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { messages, isLoading };
}