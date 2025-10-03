"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  status: "success" | "error" | null;
}

export default function StatusMessage({ status }: Props) {
  if (!status) return null;

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`px-4 py-2 rounded-md text-sm font-medium text-center ${
            status === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          } shadow-md`}
        >
          {status === "success"
            ? "Message sent successfully!"
            : "Failed to send message. Try again later."}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
