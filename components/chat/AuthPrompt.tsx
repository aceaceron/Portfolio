"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner2 } from "react-icons/im"; // spinner icon

export default function AuthPrompt() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google"); 
    // Redirect happens, no need to reset
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl space-y-2">
      <p className="text-gray-400 text-center">
        Sign in to chat and join the conversation. <br />
        Don&apos;t worry, your data is encrypted and safe with us.
      </p>
      <button
        onClick={handleSignIn}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-3 rounded-full font-semibold shadow-lg transition-all
          ${loading 
            ? "bg-gray-200 cursor-not-allowed animate-pulse scale-105" 
            : "bg-white hover:bg-gray-100 hover:scale-105"
          }`}
      >
        {loading ? (
          <ImSpinner2 className="w-6 h-6 animate-spin text-gray-600" />
        ) : (
          <FcGoogle className="w-6 h-6" />
        )}
        <span className="text-gray-800">
          {loading ? "Signing in..." : "Sign in with Google"}
        </span>
      </button>
    </div>
  );
}
