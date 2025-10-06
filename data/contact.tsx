import { Mail, Facebook, Linkedin, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiTiktok } from "react-icons/si"; // 👈 Import the TikTok icon

export const contactData = [
  {
    name: "Email Address",
    Icon: Mail,
    description: "Send me a direct email for professional or personal inquiries.",
    link: "mailto:mail.christianluisaceron@yahoo.com",
    color: "text-red-400",
    hoverBg: "hover:bg-red-600/20",
    buttonLabel: "Send me an email",
  },
  {
    name: "LinkedIn Profile",
    Icon: Linkedin,
    description: "Connect with me professionally and view my career history.",
    link: "https://www.linkedin.com/in/christianluisaceron",
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-600/20",
    buttonLabel: "Connect with me",
  },
  {
    name: "GitHub Repositories",
    Icon: Github,
    description: "Explore my open-source projects and contributions.",
    link: "https://github.com/aceaceron",
    color: "text-gray-300",
    hoverBg: "hover:bg-gray-700/20",
    buttonLabel: "View Repositories",
  },
  {
    name: "Facebook Page",
    Icon: Facebook,
    description: "Follow my personal updates and social activity.",
    link: "https://www.facebook.com/christianluisaceron",
    color: "text-blue-400",
    hoverBg: "hover:bg-blue-500/20",
    buttonLabel: "Visit my Facebook",
  },
  {
    name: "Google Developers Account",
    Icon: FcGoogle,
    description: "Check out my Google Developer profile and articles.",
    link: "https://developers.google.com/profile/u/aceaceron",
    color: "text-yellow-400",
    hoverBg: "hover:bg-yellow-600/20",
    buttonLabel: "View My Dev Profile",
  },
  // 🚀 Added TikTok Contact Item
  {
    name: "TikTok Profile",
    Icon: SiTiktok,
    description: "Follow me on TikTok for coding, projects, and personal content.",
    link: "https://www.tiktok.com/@christianluisaceron",
    color: "text-pink-500",
    hoverBg: "hover:bg-pink-600/20",
    buttonLabel: "Follow me on TikTok",
  },
];