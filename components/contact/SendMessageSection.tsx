"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import GlowingCardWrapper from "./GlowingCardWrapper";
import SendEmailViaContactPage from "./SendEmailForm";

export default function SendMessageSection() {
  const [mailStatus, setMailStatus] = useState<"success" | "error" | null>(null);
  const [hasErrors, setHasErrors] = useState(false); 
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-7 h-7 text-yellow-400" />
        <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
          Send Me a Message
        </h2>
      </div>
      <p className="text-gray-400 text-lg sm:text-xl mb-6">
        Got a question, collaboration idea, or just want to say hi? Fill out the form below and I’ll get back to you.
      </p>
      <GlowingCardWrapper status={hasErrors ? "error" : mailStatus} className="p-8">
        <SendEmailViaContactPage setMailStatus={setMailStatus} setHasErrors={setHasErrors} />
      </GlowingCardWrapper>
    </section>
  );
}
