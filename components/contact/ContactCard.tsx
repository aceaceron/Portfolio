"use client";

import GlowingCardWrapper from "./GlowingCardWrapper";
import { ArrowRight } from "lucide-react";
import { ContactItem } from "./ContactData";

export default function ContactCard({ contact }: { contact: ContactItem }) {
  const { name, Icon, description, link, color, hoverBg, buttonLabel } = contact;

  return (
    <GlowingCardWrapper className="group h-full flex flex-col justify-between">
      <div>
        <div
          className={`p-4 rounded-full inline-flex ring-4 ring-inset ${color} ring-opacity-20 transition-colors duration-300 group-hover:ring-opacity-40`}
        >
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <h2 className="text-2xl font-bold mt-6 mb-2 text-white">{name}</h2>
        <p className="text-gray-400 text-base mb-6">{description}</p>
      </div>
      <button
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${color} bg-gray-800/50 ${hoverBg} border border-transparent group-hover:border-yellow-500/50`}
        onClick={() => window.open(link, "_blank")}
      >
        <span className="text-white">{buttonLabel}</span>
        <ArrowRight className="w-5 h-5 ml-1 text-yellow-400 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </GlowingCardWrapper>
  );
}
