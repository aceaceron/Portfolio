"use client";
import { motion } from "framer-motion";
import { FaCode, FaTrash } from "react-icons/fa";

interface Props {
  msg: any;
  isOwnMessage: boolean;
  customSession: any;
  onDelete: (id: string) => void;
}

export default function MessageBubble({ msg, isOwnMessage, customSession, onDelete }: Props) {
  const userImage = msg.users?.image;
  const isAuthor = msg.users?.is_author === true;

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
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
      <div
        className={`relative p-4 pr-4 rounded-xl max-w-xs break-words shadow-md transition-all
          ${isOwnMessage
            ? "bg-yellow-500/70 text-black hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.3)] ml-auto"
            : "bg-gray-700/50 text-white hover:shadow-[0_0_10px_4px_rgba(255,215,0,0.15)] mr-auto"}
        `}
      >
        {/* Pointer */}
        <div
          className={`absolute top-3 w-0 h-0 border-t-8 border-b-8 
            ${isOwnMessage
              ? "right-[-7px] border-l-8 border-l-yellow-500/70 border-t-transparent border-b-transparent"
              : "left-[-7px] border-r-8 border-r-gray-700/50 border-t-transparent border-b-transparent"}
          `}
        ></div>

        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold">{msg.user_name}</p>
          {isAuthor && (
            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-600 text-black rounded-full flex items-center gap-1">
              Author
            </span>
          )}
        </div>

        <p>{msg.text}</p>

        <div className="flex items-center justify-between mt-1">
          <p className="text-xs opacity-60">
            {new Date(msg.created_at).toLocaleTimeString()}
          </p>
          {customSession?.user?.isAuthor && (
            <button
              onClick={() => onDelete(msg.id)}
              className="text-white hover:text-red-600 ml-2"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
