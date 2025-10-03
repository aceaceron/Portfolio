import { Mail, Facebook, Linkedin, Github, Code, LucideIcon } from "lucide-react";

export interface ContactItem {
  name: string;
  Icon: LucideIcon;
  description: string;
  link: string;
  color: string;
  hoverBg: string;
  buttonLabel: string;
}

export const contactData: ContactItem[] = [
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
    description: "Connect with me professionally and view my full career history and experience.",
    link: "https://www.linkedin.com/in/christianluisaceron",
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-600/20",
    buttonLabel: "Connect with me",
  },
  {
    name: "GitHub Repositories",
    Icon: Github,
    description: "Explore my open-source projects, contributions, and code repositories.",
    link: "https://github.com/aceaceron",
    color: "text-gray-300",
    hoverBg: "hover:bg-gray-700/20",
    buttonLabel: "View Repositories",
  },
  {
    name: "Facebook Page",
    Icon: Facebook,
    description: "Follow my personal updates and social activity on this platform.",
    link: "https://www.facebook.com/christianluisaceron",
    color: "text-blue-400",
    hoverBg: "hover:bg-blue-500/20",
    buttonLabel: "Visit my Facebook",
  },
  {
    name: "Google Developers Account",
    Icon: Code,
    description: "Check out my profile, articles, or contributions on Google Developer platforms.",
    link: "https://developers.google.com/profile/u/aceaceron",
    color: "text-yellow-400",
    hoverBg: "hover:bg-yellow-600/20",
    buttonLabel: "View My Dev Profile",
  },
];

export const mainContacts = contactData.slice(0, 3);
export const specialContacts = contactData.slice(3, 5);
