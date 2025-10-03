"use client";
import { signIn, signOut } from "next-auth/react";
import { HiOutlineChat } from "react-icons/hi";

interface Props {
  customSession: any;
}

export default function ChatHeader({ customSession }: Props) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <HiOutlineChat className="w-7 h-7 text-yellow-400" />
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
          Chat Hub
        </h1>
      </div>
      <p className="mb-2 flex items-center gap-2">
        Feel free to drop any ideas, questions, errors, critique, or just say hi!
      </p>

      {customSession ? (
        <div className="text-gray-400">
          <p className="mb-2 flex items-center gap-2">
            Logged in as {customSession.user?.name}
            {customSession.user?.isAuthor && (
              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-600 text-black rounded-full flex items-center gap-1">
                Author
              </span>
            )}
          </p>
          <button
            onClick={() => signOut()}
            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-shadow shadow-md hover:shadow-lg"
          >
            Log Out
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Viewing as guest</p>
      )}
    </header>
  );
}
