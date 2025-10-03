"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  name: string;
  placeholder: string;
  type?: string;
  value?: string;
  rows?: number;
  error?: string;
  onChange: () => void;
}

export default function InputField({ name, placeholder, type = "text", rows, error, onChange }: Props) {
  const isTextarea = type === "textarea";

  const commonClass = `w-full px-4 py-3 rounded-lg bg-gray-800/60 border transition resize-none focus:outline-none ${
    error ? "border-red-500 ring-2 ring-red-400 animate-pulse" : "border-gray-700 focus:ring-2 focus:ring-yellow-400"
  }`;

  return (
    <div className="relative w-full">
      {isTextarea ? (
        <textarea
          name={name}
          rows={rows || 6}
          placeholder={placeholder}
          className={commonClass}
          onChange={onChange}
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={commonClass}
          onChange={onChange}
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.span
            key={error}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-2 text-xs text-red-400 font-medium"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
