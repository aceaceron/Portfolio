"use client";

import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";

import { trackUmamiEvent } from "@/lib/umami";

export default function SendEmailViaContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [mailStatus, setMailStatus] = useState<"success" | "error" | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "service_kx0u17g", // ✅ Service ID
        "template_q9t90hj", // ✅ Template ID
        formRef.current,
        "bJKBHq_7YneDaBZjh" // ✅ Public Key
      )
      .then(
        (result) => {
          console.log("Message sent!", result.text);
          setMailStatus("success");
          trackUmamiEvent("Sent_Message", {
            service: "EmailJS",
            status: "success",
          });

          formRef.current?.reset();
        },
        (error) => {
          console.error("Failed...", error.text);
          setMailStatus("error");
        }
      );
  };

  return (
    <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="from_name"
          placeholder="Your Name"
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700"
        />
        <input
          type="email"
          name="from_email"
          placeholder="Your Email"
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700"
        />
      </div>
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        required
        className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700"
      />
      <textarea
        name="message"
        rows={6}
        placeholder="Your Message"
        required
        className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 resize-none"
      ></textarea>

      <div className="flex flex-col items-start gap-2">
        <button
          type="submit"
          className="px-8 py-3 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
        >
          Send Message
        </button>

        {mailStatus && (
          <motion.span
            key={mailStatus}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className={`text-sm ${
              mailStatus === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {mailStatus === "success"
              ? "Message sent successfully!"
              : "Failed to send message. Try again later."}
          </motion.span>
        )}
      </div>
    </form>
  );
}
