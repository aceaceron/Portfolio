"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase.client"; // use shared singleton client
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import AuthPrompt from "@/components/chat/AuthPrompt";
import ConfirmDeleteModal from "@/components/chat/ConfirmDeleteModal";

export interface Message {
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

// ---------------------------------------------------------------------------
// Helpers (module-level so they are not re-created on every render)
// ---------------------------------------------------------------------------
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

async function encryptMessage(userName: string, text: string) {
  const response = await fetch("/api/auth/encrypt-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, text }),
  });
  if (!response.ok) throw new Error("Encryption failed");
  return response.json();
}

// ---------------------------------------------------------------------------
export default function ChatPage() {
  const { data: session } = useSession();
  const customSession = session as CustomSession | null;

  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Cache user metadata keyed by user_id to avoid a DB round-trip per new message
  const userCache = useRef<Map<string, { image: string | null; is_author: boolean | null }>>(
    new Map()
  );

  // -------------------------------------------------------------------------
  // Fetch messages (single query with join)
  // -------------------------------------------------------------------------
  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*, users:user_id (image, is_author)")
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Seed cache from join result so real-time handlers rarely need a DB call
      data.forEach((d: any) => {
        if (d.user_id && d.users) userCache.current.set(d.user_id, d.users);
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
      setMessages(decrypted);
    }
    setIsLoading(false);
  };

  // -------------------------------------------------------------------------
  // Real-time subscription
  // -------------------------------------------------------------------------
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("chat-messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const newMsg = payload.new as Message;

          // Resolve user metadata from cache; only hit DB for unseen users
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
          setMessages((prev) =>
            prev.some((m) => m.id === decrypted.id) ? prev : [...prev, decrypted]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updated = payload.new as Message;
          if (!updated) return;
          // reply_count is not encrypted — apply directly without a decrypt round-trip
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updated.id ? { ...m, reply_count: updated.reply_count ?? 0 } : m
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const deleted = payload.old as Message;
          if (!deleted) return;
          setMessages((prev) => prev.filter((m) => m.id !== deleted.id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const handleReply = (msgId: string, userName: string) => {
    const target = messages.find((m) => m.id === msgId);
    if (!target) return;
    setReplyToMessage(target);
    setInput(target.user_id !== customSession?.user?.id ? `@${userName} ` : "");
  };

  const handleMentionScroll = (userName: string) => {
    const lastMsg = messages
      .filter((m) => m.user_name === userName)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (!lastMsg) return;
    setHighlightedMessageId(lastMsg.id);

    const el = document.getElementById(`message-${lastMsg.id}`);
    if (el && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: el.offsetTop - messagesContainerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
    setTimeout(() => setHighlightedMessageId(null), 2000);
  };

  const handleSend = async () => {
    if (!input.trim() || !customSession?.user) return;
    try {
      const { encryptedUserName, encryptedText } = await encryptMessage(
        customSession.user.name || "Anonymous",
        input.trim()
      );

      const { data: inserted, error: insertError } = await supabase
        .from("messages")
        .insert({
          user_id: customSession.user.id,
          user_name: encryptedUserName,
          text: encryptedText,
          reply_to_message_id: replyToMessage?.id || null,
        })
        .select("*, users:user_id (image, is_author)")
        .single();

      if (insertError || !inserted) { console.error(insertError); return; }

      // Cache user metadata for the sender (likely already cached but safe to set)
      if (inserted.users) userCache.current.set(customSession.user.id, inserted.users);

      const [decrypted] = await decryptMessages([inserted]);
      setMessages((prev) => [...prev, decrypted]);
      setInput("");
      setReplyToMessage(null);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!customSession?.user?.isAuthor) return;
    const { error } = await supabase.from("messages").delete().eq("id", messageId);
    if (!error) setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  // -------------------------------------------------------------------------
  // Derived state
  // -------------------------------------------------------------------------
  const chattingUsernames = useMemo(() => {
    const seen = new Set<string>();
    return messages
      .map((m) => m.user_name)
      .filter((n) => n && n !== customSession?.user?.name && !seen.has(n) && seen.add(n) as unknown as boolean);
  }, [messages, customSession?.user?.name]);

  const replyCounts = useMemo(
    () => Object.fromEntries(messages.map((m) => [m.id, m.reply_count || 0])),
    [messages]
  );

  return (
    <div className="min-h-screen pl-6 pr-6 md:ml-64 text-white font-inter">
      <ChatHeader customSession={customSession} />

      <ChatMessages
        messages={messages}
        customSession={customSession}
        isLoading={isLoading}
        onDelete={(id) => { setMessageToDelete(id); setShowConfirmModal(true); }}
        messagesEndRef={messagesEndRef}
        containerRef={messagesContainerRef}
        replyCounts={replyCounts}
        onMentionClick={() => {}}
        highlightedMessageId={highlightedMessageId}
        onReply={handleReply}
      />

      {customSession ? (
        <ChatInput
          ref={inputRef}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          chattingUsernames={chattingUsernames}
          onUsernameSelect={handleMentionScroll}
          replyToMessage={replyToMessage}
          onClearReply={() => setReplyToMessage(null)}
          currentUserId={customSession.user.id}
        />
      ) : (
        <AuthPrompt />
      )}

      {showConfirmModal && (
        <ConfirmDeleteModal
          onCancel={() => { setShowConfirmModal(false); setMessageToDelete(null); }}
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