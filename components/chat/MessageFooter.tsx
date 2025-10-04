"use client";
import { FaTrash, FaReply } from "react-icons/fa";

interface Props {
  msg: { id: string; user_name: string; created_at: string };
  isAuthorMessage: boolean;
  replyCount: number;
  customSession: any;
  isOwnMessage: boolean;
  onReply: () => void;
  onDelete: () => void;
}

export default function MessageFooter({
  msg,
  isAuthorMessage,
  replyCount,
  customSession,
  isOwnMessage,
  onReply,
  onDelete,
}: Props) {
  const replyCountClass = `text-xs opacity-90 font-medium ${
    isAuthorMessage ? "text-white" : "text-yellow-500"
  }`;
  const timestampClass = `text-xs opacity-60 flex items-center gap-1 ${
    isAuthorMessage ? "text-white" : ""
  }`;

  return (
    <div className="flex flex-col gap-1 mt-1 pt-1 border-gray-600/50">
      {replyCount > 0 && (
        <div className={replyCountClass}>
          {replyCount} {replyCount === 1 ? "Reply" : "Replies"} 💬
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className={timestampClass}>
          {new Date(msg.created_at).toLocaleDateString(undefined, {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
          <span className={`text-gray-400 ${isAuthorMessage ? "text-white" : ""}`}>
            ●
          </span>
          {new Date(msg.created_at).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
        <div className="flex gap-2">
          {customSession && (
            <button
              onClick={onReply}
              className="text-white hover:text-yellow-500 transition-colors"
              title={`Reply to ${isOwnMessage ? "themselves" : msg.user_name}`}
            >
              <FaReply className="h-4" />
            </button>
          )}
          {customSession?.user?.isAuthor && (
            <button
              onClick={onDelete}
              className="text-white hover:text-red-600 transition-colors"
              title="Delete Message"
            >
              <FaTrash className="h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
