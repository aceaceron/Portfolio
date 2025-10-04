"use client";
import { JSX } from "react";

const MENTION_REGEX = /@([A-Za-z0-9_-]+(?:\s[A-Za-z0-9_-]+)?)/g;

interface Props {
  text: string;
  expanded: boolean;
  setExpanded: (val: boolean) => void;
  isAuthorMessage: boolean;
  onMentionClick?: (userName: string) => void;
  maxLength?: number;
}

export default function MessageText({
  text,
  expanded,
  setExpanded,
  isAuthorMessage,
  onMentionClick,
  maxLength = 150,
}: Props) {
  const isLongMessage = text.length > maxLength;
  const rawText = expanded || !isLongMessage ? text : text.slice(0, maxLength) + "...";

  const formatMessageText = (content: string) => {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    content.replace(MENTION_REGEX, (match, username, index) => {
      if (index > lastIndex) parts.push(content.substring(lastIndex, index));
      parts.push(
        <span
          key={index}
          className="text-blue-400 font-semibold hover:underline cursor-pointer transition-colors"
          onClick={() => onMentionClick?.(username)}
        >
          {match}
        </span>
      );
      lastIndex = index + match.length;
      return match;
    });

    if (lastIndex < content.length) parts.push(content.substring(lastIndex));
    return <>{parts}</>;
  };

  const messageTextClass = `text-sm ${isAuthorMessage ? "text-white" : ""}`;

  return (
    <div>
      <p className={messageTextClass}>{formatMessageText(rawText)}</p>
      {isLongMessage && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-400 hover:underline mt-1"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
