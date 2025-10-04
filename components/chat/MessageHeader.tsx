"use client";

export default function MessageHeader({
  userName,
  isAuthor,
  isAuthorMessage,
}: {
  userName: string;
  isAuthor: boolean;
  isAuthorMessage: boolean;
}) {
  const headerNameClass = `text-sm font-semibold ${isAuthorMessage ? "text-white" : ""}`;
  const badgeClass = `px-2 py-0.5 text-xs font-bold rounded-full flex items-center gap-1 ${
    isAuthorMessage ? "bg-white text-black" : "bg-gradient-to-r from-yellow-400 to-amber-600 text-black"
  }`;

  return (
    <div className="flex items-center gap-2 mb-1">
      <p className={headerNameClass}>{userName}</p>
      {isAuthor && <span className={badgeClass}>Author</span>}
    </div>
  );
}
