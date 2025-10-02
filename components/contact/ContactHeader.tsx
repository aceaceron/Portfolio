"use client";

import { MessageCircle } from "lucide-react";

export default function ContactHeader() {
  return (
    <header className="mb-12 text-left">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-7 h-7 text-yellow-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
          Connect With Me
        </h1>
      </div>
      <p className="text-gray-400 text-lg sm:text-xl mx-auto md:mx-0">
        Find me across the web! Use the button below each card to visit my profile.
      </p>
    </header>
  );
}
