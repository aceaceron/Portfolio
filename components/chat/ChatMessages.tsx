"use client";
import { useRef, useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
  reply_to_message_id?: string;
  reply_count?: number; // ✅ add this
  users?: {
    image: string | null;
    is_author: boolean | null;
  } | null;
}


interface Props {
  messages: Message[];
  customSession: any;
  isLoading: boolean;
  onDelete: (id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onMentionClick: (userName: string) => void; 
  highlightedMessageId: string | null; 
  onReply: (messageId: string, userName: string) => void; 
  replyCounts?: { [key: string]: number };
}

export default function ChatMessages({
  messages,
  customSession,
  isLoading,
  onDelete,
  messagesEndRef,
  containerRef,
  onMentionClick,
  highlightedMessageId,
  onReply,
  replyCounts
}: Props) {
  const [highlightedMessage, setHighlightedMessage] = useState<string | null>(highlightedMessageId);

  // Listen for external highlight events
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setHighlightedMessage(e.detail);
      setTimeout(() => setHighlightedMessage(null), 2000);
    };
    window.addEventListener("highlightMessage", handler as EventListener);
    return () => window.removeEventListener("highlightMessage", handler as EventListener);
  }, []);

  // Attach parent messages for replies
  const messagesWithParents = messages.map(msg => ({
    ...msg,
    parentMessage: msg.reply_to_message_id
      ? messages.find(m => m.id === msg.reply_to_message_id) || null
      : null,
  }));

  const inputRef = useRef<{ focusInput: () => void }>(null);

  // Reply handler: scroll & highlight parent if exists
  const handleReply = (msgId: string, userName: string, parentId?: string) => {
    const highlightId = parentId || msgId;
    setHighlightedMessage(highlightId);

    const targetElement = document.getElementById(`message-${highlightId}`);
    if (targetElement && containerRef.current) {
      containerRef.current.scrollTo({
        top: targetElement.offsetTop - containerRef.current.offsetTop,
        behavior: "smooth",
      });
    }

    setTimeout(() => setHighlightedMessage(null), 2000);
    onReply(msgId, userName);
    inputRef.current?.focusInput();
  };

  // Mention handler: scroll to last message from user and highlight
  const handleMention = (userName: string) => {
    const lastMessage = messages
      .filter(msg => msg.user_name === userName)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (lastMessage) {
      setHighlightedMessage(lastMessage.id);

      const targetElement = document.getElementById(`message-${lastMessage.id}`);
      if (targetElement && containerRef.current) {
        containerRef.current.scrollTo({
          top: targetElement.offsetTop - containerRef.current.offsetTop,
          behavior: "smooth",
        });
      }

      setTimeout(() => setHighlightedMessage(null), 2000);
    }

    onMentionClick(userName);
  };

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto p-4 rounded-xl bg-gray-800/50 shadow-lg space-y-3 h-[70vh] sm:h-[60vh] md:h-[50vh] lg:h-[75vh] xl:h-[70vh]"
    >
      {isLoading ? (
        <p className="text-gray-400 text-center">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet. Start the conversation!</p>
      ) : (
        messagesWithParents.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isOwnMessage={customSession && msg.user_id === customSession.user?.id}
            customSession={customSession}
            onDelete={onDelete}
            onMentionClick={handleMention} // use internal highlight logic
            isHighlighted={msg.id === highlightedMessage}
            onReply={(msgId, userName) => handleReply(msgId, userName, msg.parentMessage?.id)}
            replyCount={replyCounts?.[msg.id] || 0} // fetch from DB
            parentMessage={msg.parentMessage}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
