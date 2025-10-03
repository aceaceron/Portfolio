"use client";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: any[];
  customSession: any;
  isLoading: boolean;
  onDelete: (id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({ messages, customSession, isLoading, onDelete, messagesEndRef, containerRef }: Props) {
  return (
    <div
      ref={containerRef}
      className="overflow-y-auto p-4 rounded-xl bg-gray-800/50 shadow-lg space-y-3 h-[70vh] sm:h-[60vh] md:h-[50vh] lg:h-[75vh] xl:h-[70vh] "
    >
      {isLoading ? (
        <p className="text-gray-400 text-center">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet. Start the conversation!</p>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isOwnMessage={customSession && msg.user_id === customSession.user?.id}
            customSession={customSession}
            onDelete={onDelete}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
