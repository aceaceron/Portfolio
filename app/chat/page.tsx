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
  reply_to_message_id?: string;
  reply_count?: number;
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

  const handleReply = (msgId: string, userName: string) => {
    const messageToReply = messages.find(m => m.id === msgId);
    if (messageToReply) {
      setReplyToMessage(messageToReply);
      // Only prepend @ if replying to another user
      if (messageToReply.user_id !== customSession?.user?.id) {
        setInput(`@${userName} `);
      } else {
        setInput(""); // do not prepend @ for self
      }
    }
  };


  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  const handleMentionScroll = (userName: string) => {
    const lastMessage = messages
      .filter(msg => msg.user_name === userName)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    if (lastMessage) {
      setHighlightedMessageId(lastMessage.id);
      const targetElement = document.getElementById(`message-${lastMessage.id}`);
      
      if (targetElement && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: targetElement.offsetTop - messagesContainerRef.current.offsetTop,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

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

  const encryptMessage = async (userName: string, text: string) => {
    const response = await fetch("/api/auth/encrypt-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, text }),
    });
    if (!response.ok) throw new Error("Encryption failed");
    return response.json();
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        users:user_id (
          image,
          is_author
        )
      `)
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
          reply_count: d.reply_count,
          users: d.users || null,
        }))
      );
      setMessages(decrypted);
    }
    setIsLoading(false);
  };

  const handleDelete = async (messageId: string) => {
    if (!customSession?.user?.isAuthor) return;
    
    // Database trigger will automatically decrement reply_count of parent message
    const { error } = await supabase.from("messages").delete().eq("id", messageId);
    if (!error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !customSession?.user) return;
    try {
      const { encryptedUserName, encryptedText } = await encryptMessage(
        customSession.user.name || "Anonymous",
        input.trim()
      );
      
      // Insert message with user relationship for Author badge
      const { data: insertedData, error: insertError } = await supabase
        .from("messages")
        .insert({
          user_id: customSession.user.id,
          user_name: encryptedUserName,
          text: encryptedText,
          reply_to_message_id: replyToMessage?.id || null,
        })
        .select(`
          *,
          users:user_id (
            image,
            is_author
          )
        `)
        .single();

      if (insertError || !insertedData) {
        console.error(insertError);
        return;
      }

      const [decryptedMessage] = await decryptMessages([insertedData]);
      setMessages(prev => [...prev, decryptedMessage]);

      // ✅ Database trigger automatically handles reply_count increment
      // No manual increment needed!

      setInput("");
      setReplyToMessage(null);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchMessages();
    };
    fetch();

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
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updatedMsg = payload.new as Message;
          if (!updatedMsg) return;
          
          // reply_count is NOT encrypted, use directly
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updatedMsg.id
                ? { ...m, reply_count: updatedMsg.reply_count ?? 0 }
                : m
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const deletedMsg = payload.old as Message;
          if (!deletedMsg) return;
          
          // Remove from state (trigger already decremented parent's reply_count)
          setMessages((prev) => prev.filter((m) => m.id !== deletedMsg.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const chattingUsernames = useMemo(() => {
    const names = messages
      .map(msg => msg.user_name)
      .filter(name => name)
      .filter(name => name !== customSession?.user?.name);
    return Array.from(new Set(names));
  }, [messages, customSession?.user?.name]);

  return (
    <div className="min-h-screen pl-6 pr-6 md:ml-64 text-white font-inter">
      <ChatHeader customSession={customSession} />
      
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
        replyCounts={Object.fromEntries(messages.map(m => [m.id, m.reply_count || 0]))}
        onMentionClick={(userName) => {}}
        highlightedMessageId={highlightedMessageId}
        onReply={(msgId, userName) => handleReply(msgId, userName)}
      />
      
      {customSession ? (
        <ChatInput 
          ref={inputRef}
          input={input} 
          setInput={setInput} 
          handleSend={handleSend} 
          chattingUsernames={chattingUsernames}
          onUsernameSelect={(name) => {
            handleMentionScroll(name);
          }}
          replyToMessage={replyToMessage}
          onClearReply={() => setReplyToMessage(null)}
          currentUserId={customSession?.user?.id ?? ""} 
        />
      ) : (
        <AuthPrompt />
      )}
      
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