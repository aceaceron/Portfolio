"use client";

interface Message {
  id: string;
  user_name: string;
  text: string;
}

export default function MessageReplyBranch({
  parentMessage,
  msg,
  isAuthorMessage,
}: {
  parentMessage: Message;
  msg: Message;
  isAuthorMessage: boolean;
}) {
  return (
    <div
      onClick={() => {
        const el = document.getElementById(`message-${parentMessage.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

        if (typeof window !== "undefined") {
          const highlightEvent = new CustomEvent("highlightMessage", { detail: parentMessage.id });
          window.dispatchEvent(highlightEvent);
        }
      }}
      className={`flex flex-col border-l-2 pl-2 mb-2 pt-1 pb-1 text-xs cursor-pointer hover:bg-gray-700/30 max-w-xs ${
        isAuthorMessage ? "border-black/50 text-white/80" : "border-gray-500 text-gray-400 max-w-xs"
      }`}
    >
      <p className="font-medium">
        {parentMessage.user_name === msg.user_name ? (
          <>Replying to themselves</>
        ) : (
          <>
            Replying to
            <span
              className={`${
                isAuthorMessage ? "text-white" : "text-yellow-300"
              } font-semibold ml-1`}
            >
              {parentMessage.user_name}
            </span>
          </>
        )}
      </p>
      <p className="truncate max-w-[150px] opacity-75">
        "{parentMessage.text.substring(0, 40)}
        {parentMessage.text.length > 40 ? "..." : ""}"
      </p>
    </div>
  );
}
