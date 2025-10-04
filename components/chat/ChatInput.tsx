"use client";

import {
  useState,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FaTimes } from "react-icons/fa";

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
}

interface Props {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  chattingUsernames: string[];
  onUsernameSelect?: (userName: string) => void;
  replyToMessage: Message | null;
  onClearReply: () => void;
  currentUserId: string;
}

const ChatInput = forwardRef(function ChatInput(
  {
    input,
    setInput,
    handleSend,
    chattingUsernames,
    onUsernameSelect,
    replyToMessage,
    onClearReply,
    currentUserId,
  }: Props,
  ref
) {
  const [isMentioning, setIsMentioning] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 👇 expose focus method so parent can call inputRef.current.focus()
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    },
  }));

  const handleInputChange = (value: string) => {
    setInput(value);

    const mentionIndex = value.lastIndexOf("@");
    const spaceIndex = value.lastIndexOf(" ");
    const isAtPresent = mentionIndex !== -1;
    const isAtLastInWord = isAtPresent && mentionIndex > spaceIndex;
    const isPrecededBySpaceOrStart =
      mentionIndex === 0 || value.charAt(mentionIndex - 1) === " ";

    if (isAtPresent && isAtLastInWord && isPrecededBySpaceOrStart) {
      const query = value.substring(mentionIndex + 1);
      setIsMentioning(true);
      setMentionQuery(query);
    } else {
      setIsMentioning(false);
      setMentionQuery("");
    }
  };

  const filteredUsernames = useMemo(() => {
    if (!isMentioning) return [];
    if (mentionQuery.trim() === "") return chattingUsernames.slice(0, 8);
    return chattingUsernames
      .filter((name) =>
        name.toLowerCase().includes(mentionQuery.toLowerCase())
      )
      .slice(0, 8);
  }, [isMentioning, mentionQuery, chattingUsernames]);

  const selectUsername = (name: string) => {
    const mentionIndex = input.lastIndexOf("@");
    const newText = input.substring(0, mentionIndex) + `@${name} `;
    setInput(newText);
    setIsMentioning(false);
    setMentionQuery("");
    onUsernameSelect?.(name);
    inputRef.current?.focus();
  };

  const handleCombinedSend = () => {
    if (!input.trim()) return;
    handleSend();
    if (replyToMessage) onClearReply();
  };

  return (
    <div className="mt-4 w-full flex flex-col items-center">
      <p className="text-gray-400 text-sm mb-3 text-center">
        Your messages and account details are securely encrypted.
      </p>

      <div className="relative w-full max-w-3xl px-2 sm:px-0">
        {/* Reply Context */}
        {replyToMessage && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/90 backdrop-blur-sm border border-gray-700 mb-2 shadow-md">
            <div className="text-sm flex-1 overflow-hidden">
              <p className="text-gray-300 font-medium">
                {replyToMessage.user_id === currentUserId ? (
                  <>Replying to yourself</>
                ) : (
                  <>
                    Replying to{" "}
                    <span className="text-yellow-400 font-semibold">
                      {replyToMessage.user_name}
                    </span>
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-full sm:max-w-md">
                "{replyToMessage.text.substring(0, 50)}
                {replyToMessage.text.length > 50 ? "..." : ""}"
              </p>
            </div>
            <button
              onClick={onClearReply}
              className="text-gray-400 hover:text-red-500 transition-colors ml-3"
              title="Cancel Reply"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Input + Send */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch w-full space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Mention Suggestions */}
          {isMentioning && filteredUsernames.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 w-full sm:max-w-md z-20">
              <ul className="bg-gray-800/95 backdrop-blur-sm border border-yellow-500/50 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
                {filteredUsernames.map((name) => (
                  <li
                    key={name}
                    className="px-4 py-2 text-white cursor-pointer hover:bg-yellow-500/30 transition-colors rounded-lg"
                    onClick={() => selectUsername(name)}
                  >
                    <span className="font-bold text-yellow-300 mr-1">@</span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Input */}
          <input
            ref={inputRef}
            className="w-full px-4 py-3 bg-gray-700/80 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 shadow-inner hover:shadow-lg transition-shadow"
            placeholder={
              replyToMessage
                ? replyToMessage.user_id === currentUserId
                  ? "Replying to yourself..."
                  : `Reply to ${replyToMessage.user_name}...`
                : "Type your message..."
            }
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCombinedSend()}
          />

          {/* Send Button */}
          <button
            className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            onClick={handleCombinedSend}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatInput;
