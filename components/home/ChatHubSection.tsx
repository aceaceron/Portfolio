"use client";

import { motion } from "framer-motion";
import { HiOutlineChat } from "react-icons/hi";
import { useRouter } from "next/navigation";
import GlowingCardWrapper from "../GlowingCardWrapper";
import ChatMessages from "../chat/ChatMessages";

interface Props {
  messages: any[];
  customSession: any;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

export default function ChatHubSection({
  messages,
  customSession,
  isLoading,
  messagesEndRef,
  containerRef,
}: Props) {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      custom={3}
      viewport={{ once: true, amount: 0.2 }}
      className="mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <HiOutlineChat size={24} className="text-[#FFD700]" /> Chat Hub
      </h2>
      <p className="text-gray-300 mb-4">
        Share your thoughts on my portfolio and hop into the chat hub!
      </p>
      <GlowingCardWrapper onClick={() => router.push("/chat")}>
        <ChatMessages
          messages={messages}
          customSession={customSession}
          isLoading={isLoading}
          onDelete={() => {}}
          messagesEndRef={messagesEndRef}
          containerRef={containerRef}
          replyCounts={Object.fromEntries(
            messages.map((m) => [m.id, m.reply_count || 0])
          )}
          onMentionClick={() => {}}
          highlightedMessageId={null}
          onReply={() => {}}
        />
      </GlowingCardWrapper>

      <hr className="mt-6 border-[#FFD700]" />
    </motion.section>
  );
}
