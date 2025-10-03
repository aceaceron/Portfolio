"use client";

interface Props {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
}

export default function ChatInput({ input, setInput, handleSend }: Props) {
  return (
    <div className="mt-4 w-full flex flex-col items-center">
      <p className="text-gray-400 text-sm mb-2 text-center">
        Your messages and account details are securely encrypted and stored.
      </p>
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch w-full max-w-3xl px-2 sm:px-0 space-y-2 sm:space-y-0 sm:space-x-3">
        <input
          className="flex-1 min-w-[70vw] px-4 py-3 rounded-xl bg-gray-700/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow shadow-inner hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.2)] max-w-[75vw] sm:w-auto"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 font-semibold transition-all shadow-md hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed w-[75vw] sm:w-auto"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
