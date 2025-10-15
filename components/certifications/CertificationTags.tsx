// components/certifications/CertificationTags.tsx
import * as React from "react";

type CertificationTagsProps = {
  tags?: string[];
  onTagClick: (tag: string) => void;
};

export default function CertificationTags({
  tags,
  onTagClick,
}: CertificationTagsProps) {
  // Check for undefined, null, or empty array
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={(e) => {
            // Stop propagation to prevent card-level clicks
            e.stopPropagation(); 
            onTagClick(tag);
          }}
          className="px-3 py-1 text-xs border border-gray-600 rounded-full text-gray-400 
                    hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}