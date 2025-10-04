"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase as supabaseClient } from "../lib/supabase.client";

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
  reply_to_message_id?: string;
  reply_count?: number;
  parentMessage?: Message | null; 
  users?: {
    image: string | null;
    is_author: boolean | null;
  } | null;
}


export default function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => supabaseClient, []);

  const decryptMessages = async (encrypted: Message[]): Promise<Message[]> => {
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
  };

  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select(
          `*, reply_count, users:user_id (image, is_author)`
        )
        .order("created_at", { ascending: true });

      if (!error && data) {
        const decrypted = await decryptMessages(
          data.map((d: any) => ({
            id: d.id,
            user_id: d.user_id,
            user_name: d.user_name,
            text: d.text,
            created_at: d.created_at,
            reply_to_message_id: d.reply_to_message_id,
            users: d.users || null,
          }))
        );
        setMessages(decrypted);
      }
      setIsLoading(false);
    }

    fetchMessages();

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data: userData } = await supabase
            .from("users")
            .select("image, is_author")
            .eq("id", payload.new.user_id)
            .single();

          const newMessage: Message = {
            ...(payload.new as Message),
            users: userData
              ? { image: userData.image, is_author: userData.is_author }
              : null,
          };

          const [decrypted] = await decryptMessages([newMessage]);
          setMessages((prev) =>
            prev.some((m) => m.id === decrypted.id) ? prev : [...prev, decrypted]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { messages, isLoading };
}
