"use client";
import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { FaCode, FaTrash, FaReply } from "react-icons/fa";

interface Message {
  id: string;
  user_name: string;
  text: string;
}

interface Props {
  msg: any;
  isOwnMessage: boolean;
  customSession: any;
  onDelete: (id: string) => void;
  onMentionClick?: (userName: string) => void;
  isHighlighted?: boolean;
  onReply: (messageId: string, userName: string) => void;
  replyCount: number;
  parentMessage?: Message | null;
}

const MENTION_REGEX = /@([A-Za-z0-9_-]+(?:\s[A-Za-z0-9_-]+)?)/g;

export default function MessageBubble({
  msg,
  isOwnMessage,
  customSession,
  onDelete,
  onMentionClick,
  isHighlighted,
  onReply,
  replyCount,
  parentMessage,
}: Props) {
  const userImage = msg.users?.image;
  const isAuthor = msg.users?.is_author === true;
  const isAuthorMessage = isOwnMessage || isAuthor;

  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 150;

  const handleDelete = () => onDelete(msg.id);
  const handleReply = () => {
    const userName = isOwnMessage ? "themselves" : msg.user_name;
    onReply(msg.id, userName);
  };

  const isLongMessage = msg.text.length > MAX_LENGTH;
  const rawText =
    expanded || !isLongMessage
      ? msg.text
      : msg.text.slice(0, MAX_LENGTH) + "...";

  const formatMessageText = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    text.replace(MENTION_REGEX, (match, username, index) => {
      if (index > lastIndex) parts.push(text.substring(lastIndex, index));
      parts.push(
        <span
          key={index}
          className="text-blue-400 font-semibold hover:underline cursor-pointer transition-colors"
          onClick={() => onMentionClick?.(username)}
        >
          {match}
        </span>
      );
      lastIndex = index + match.length;
      return match;
    });

    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return <>{parts}</>;
  };

  const highlightBubbleClasses = isHighlighted
    ? "ring-4 ring-yellow-400/80 shadow-2xl"
    : "";

  const bubbleClasses = `relative p-4 pr-4 rounded-xl max-w-xs break-words shadow-md transition-all duration-500 ease-out flex flex-col
    ${isAuthorMessage
      ? "bg-yellow-500/70 text-white hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.3)] ml-auto"
      : "bg-gray-700/50 text-white hover:shadow-[0_0_10px_4px_rgba(255,215,0,0.15)] mr-auto"} ${highlightBubbleClasses}`;

  const pointerClasses = isAuthorMessage
    ? "right-[-7px] border-l-8 border-l-yellow-500/70 border-t-transparent border-b-transparent"
    : "left-[-7px] border-r-8 border-r-gray-700/50 border-t-transparent border-b-transparent";

  const headerNameClass = `text-sm font-semibold ${isAuthorMessage ? "text-white" : ""}`;
  const badgeClass = `px-2 py-0.5 text-xs font-bold rounded-full flex items-center gap-1 ${
    isAuthorMessage ? "bg-white text-black" : "bg-gradient-to-r from-yellow-400 to-amber-600 text-black"
  }`;
  const messageTextClass = `text-sm ${isAuthorMessage ? "text-white" : ""}`;
  const replyCountClass = `text-xs opacity-90 font-medium ${isAuthorMessage ? "text-white" : "text-yellow-500"}`;
  const timestampClass = `text-xs opacity-60 flex items-center gap-1 ${isAuthorMessage ? "text-white" : ""}`;

  return (
    <motion.div
      key={msg.id}
      id={`message-${msg.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isAuthorMessage ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 relative">
        {userImage ? (
          <img
            src={userImage}
            alt={msg.user_name}
            className="w-10 h-10 rounded-full border-2 border-gray-600"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
            {msg.user_name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        {isAuthor && (
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full p-1 flex items-center justify-center">
            <FaCode className="w-3 h-3 text-black" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={bubbleClasses}>
        {/* Pointer */}
        <div className={`absolute top-3 w-0 h-0 border-t-8 border-b-8 ${pointerClasses}`} />

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <p className={headerNameClass}>{msg.user_name}</p>
          {isAuthor && <span className={badgeClass}>Author</span>}
        </div>

        {/* Reply branch */}
        {parentMessage && (
          <div
            onClick={() => {
              const el = document.getElementById(`message-${parentMessage.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

              if (typeof window !== "undefined") {
                const highlightEvent = new CustomEvent("highlightMessage", { detail: parentMessage.id });
                window.dispatchEvent(highlightEvent);
              }
            }}
            className={`flex flex-col border-l-2 pl-2 mb-2 pt-1 pb-1 text-xs cursor-pointer hover:bg-gray-700/30 max-w-xs ${
              isAuthorMessage ? "border-black/50 text-white/80" : "border-gray-500 text-gray-400 max-w-xs"
            }`}
          >
            <p className="font-medium">
              {parentMessage.user_name === msg.user_name ? (
                <>Replying to themselves</>
              ) : (
                <>
                  Replying to{""}
                  <span
                    className={`${
                      isAuthorMessage ? "text-white" : "text-yellow-300"
                    } font-semibold ml-1`}
                  >
                    {parentMessage.user_name}
                  </span>
                </>
              )}
            </p>
            <p className="truncate max-w-[150px] opacity-75">
              "{parentMessage.text.substring(0, 40)}
              {parentMessage.text.length > 40 ? "..." : ""}"
            </p>
          </div>
        )}

        {/* Message text */}
        <p className={messageTextClass}>{formatMessageText(rawText)}</p>
        {isLongMessage && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-blue-400 hover:underline mt-1">
            {expanded ? "Show less" : "Show more"}
          </button>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-1 mt-1 pt-1 border-gray-600/50">
          {replyCount > 0 && <div className={replyCountClass}>{replyCount} {replyCount === 1 ? "Reply" : "Replies"} 💬</div>}
          <div className="flex items-center justify-between">
            <p className={timestampClass}>
              {new Date(msg.created_at).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "numeric" })}
              <span className={`text-gray-400 ${isAuthorMessage ? "text-white" : ""}`}>●</span>
              {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
            <div className="flex gap-2">
              {customSession && (
                <button
                  onClick={handleReply}
                  className="text-white hover:text-yellow-500 transition-colors"
                  title={`Reply to ${isOwnMessage ? "themselves" : msg.user_name}`}
                >
                  <FaReply className="h-4" />
                </button>
              )}
              {customSession?.user?.isAuthor && (
                <button
                  onClick={handleDelete}
                  className="text-white hover:text-red-600 transition-colors"
                  title="Delete Message"
                >
                  <FaTrash className="h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
