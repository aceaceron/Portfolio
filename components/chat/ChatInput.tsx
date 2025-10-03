"use client";

interface Props {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
}

export default function ChatInput({ input, setInput, handleSend }: Props) {
  return (
    <div className="mt-4">
      <p className="text-gray-400 text-sm mb-2 text-center">
        Your messages and account details are securely encrypted and stored.
      </p>
      <div className="flex items-center space-x-3">
        <input
          className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow shadow-inner hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.2)]"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 font-semibold transition-all shadow-md hover:shadow-[0_0_15px_4px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
