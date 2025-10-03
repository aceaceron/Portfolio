"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import AuthPrompt from "@/components/chat/AuthPrompt";
import ConfirmDeleteModal from "@/components/chat/ConfirmDeleteModal";

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
  users?: {
    image: string | null;
    is_author: boolean | null;
  } | null;
}

interface CustomSession {
  supabaseAccessToken?: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAuthor?: boolean;
  };
}

export default function ChatPage() {
  const { data: session } = useSession();
  const customSession = session as CustomSession | null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  // 🔒 Decrypt messages from server
  const decryptMessages = async (encryptedMessages: Message[]): Promise<Message[]> => {
    try {
      const response = await fetch("/api/auth/decrypt-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: encryptedMessages }),
      });
      if (!response.ok) return encryptedMessages;
      const { decryptedMessages } = await response.json();
      return decryptedMessages;
    } catch (error) {
      console.error("Error decrypting:", error);
      return encryptedMessages;
    }
  };

  // 🔑 Encrypt before sending
  const encryptMessage = async (userName: string, text: string) => {
    const response = await fetch("/api/auth/encrypt-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, text }),
    });
    if (!response.ok) throw new Error("Encryption failed");
    return response.json();
  };

  // 📨 Fetch messages
  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        users:user_id (
          image,
          is_author
        )
      `
      )
      .order("created_at", { ascending: true });

    if (!error && data) {
      const decrypted = await decryptMessages(data);
      setMessages(decrypted);
    }
    setIsLoading(false);
  };

  // 🗑 Delete message
  const handleDelete = async (messageId: string) => {
    if (!customSession?.user?.isAuthor) return;
    const { error } = await supabase.from("messages").delete().eq("id", messageId);
    if (!error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }
  };

  // 📩 Send message
  const handleSend = async () => {
    if (!input.trim() || !customSession?.user) return;
    try {
      const { encryptedUserName, encryptedText } = await encryptMessage(
        customSession.user.name || "Anonymous",
        input.trim()
      );

      const { error } = await supabase.from("messages").insert({
        user_id: customSession.user.id,
        user_name: encryptedUserName,
        text: encryptedText,
      });

      if (!error) setInput("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // 🔔 Realtime subscription
  useEffect(() => {
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
              users: userData ? { image: userData.image, is_author: userData.is_author } : null,
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

  // 🔽 Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen p-4 pl-6 pr-6 md:ml-64 text-white font-inter">
      {/* Header */}
      <ChatHeader customSession={customSession} />

      {/* Messages */}
      <ChatMessages
        messages={messages}
        customSession={customSession}
        isLoading={isLoading}
        onDelete={(id) => {
          setMessageToDelete(id);
          setShowConfirmModal(true);
        }}
        messagesEndRef={messagesEndRef}
        containerRef={messagesContainerRef}
      />

      {/* Input / Auth */}
      {customSession ? (
        <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
      ) : (
        <AuthPrompt />
      )}

      {/* Confirm delete modal */}
      {showConfirmModal && (
        <ConfirmDeleteModal
          onCancel={() => {
            setShowConfirmModal(false);
            setMessageToDelete(null);
          }}
          onConfirm={async () => {
            if (messageToDelete) await handleDelete(messageToDelete);
            setShowConfirmModal(false);
            setMessageToDelete(null);
          }}
        />
      )}
    </div>
  );
}
