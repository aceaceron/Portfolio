"use client";
import { FaCode } from "react-icons/fa";

export default function MessageAvatar({ msg, isAuthor }: { msg: any; isAuthor: boolean }) {
  const userImage = msg.users?.image;

  return (
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
  );
}
