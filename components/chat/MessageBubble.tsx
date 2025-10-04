"use client";
import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaReply } from "react-icons/fa";
import MessageAvatar from "./MessageAvatar";
import MessageHeader from "./MessageHeader";
import MessageReplyBranch from "./MessageReplyBranch";
import MessageText from "./MessageText";
import MessageFooter from "./MessageFooter";
import { Message } from "@/types/message"; // Import the shared Message type

interface Props {
  messages: Message; // Changed from 'msg' to match your usage
  isOwnMessage: boolean;
  customSession: any;
  onDelete: (id: string) => void;
  onMentionClick?: (userName: string) => void;
  isHighlighted?: boolean;
  onReply: (messageId: string, userName: string) => void;
  replyCount: number;
  parentMessage?: Message | null | undefined; // Match the type exactly
}

export default function MessageBubble({
  messages: msg, // Destructure with alias to keep your existing code
  isOwnMessage,
  customSession,
  onDelete,
  onMentionClick,
  isHighlighted,
  onReply,
  replyCount,
  parentMessage,
}: Props) {
  const isAuthor = msg.users?.is_author === true;
  const isAuthorMessage = isOwnMessage || isAuthor;

  const [expanded, setExpanded] = useState(false);

  const handleDelete = () => onDelete(msg.id);
  const handleReply = () => {
    const userName = isOwnMessage ? "themselves" : msg.user_name;
    onReply(msg.id, userName);
  };

  const highlightBubbleClasses = isHighlighted
    ? "ring-4 ring-yellow-400/80 shadow-2xl"
    : "";

  const bubbleClasses = `relative p-4 pr-4 rounded-xl max-w-xs break-words shadow-md transition-all duration-500 ease-out flex flex-col
    ${
      isAuthorMessage
        ? "bg-yellow-500/70 text-white hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.3)] ml-auto"
        : "bg-gray-700/50 text-white hover:shadow-[0_0_10px_4px_rgba(255,215,0,0.15)] mr-auto"
    } ${highlightBubbleClasses}`;

  const pointerClasses = isAuthorMessage
    ? "right-[-7px] border-l-8 border-l-yellow-500/70 border-t-transparent border-b-transparent"
    : "left-[-7px] border-r-8 border-r-gray-700/50 border-t-transparent border-b-transparent";

  return (
    <motion.div
      key={msg.id}
      id={`message-${msg.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${
        isAuthorMessage ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <MessageAvatar msg={msg} isAuthor={isAuthor} />

      {/* Bubble */}
      <div className={bubbleClasses}>
        {/* Pointer */}
        <div
          className={`absolute top-3 w-0 h-0 border-t-8 border-b-8 ${pointerClasses}`}
        />

        {/* Header */}
        <MessageHeader
          userName={msg.user_name}
          isAuthor={isAuthor}
          isAuthorMessage={isAuthorMessage}
        />

        {/* Reply branch */}
        {parentMessage && (
          <MessageReplyBranch
            parentMessage={parentMessage}
            msg={msg}
            isAuthorMessage={isAuthorMessage}
          />
        )}

        {/* Message text */}
        <MessageText
          text={msg.text}
          expanded={expanded}
          setExpanded={setExpanded}
          isAuthorMessage={isAuthorMessage}
          onMentionClick={onMentionClick}
        />

        {/* Footer */}
        <MessageFooter
          msg={msg}
          isAuthorMessage={isAuthorMessage}
          replyCount={replyCount}
          customSession={customSession}
          isOwnMessage={isOwnMessage}
          onReply={handleReply}
          onDelete={handleDelete}
        />
      </div>
    </motion.div>
  );
}