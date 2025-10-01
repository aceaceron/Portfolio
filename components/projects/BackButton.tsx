// app/projects/BackButton.tsx

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

type BackButtonProps = {
  href: string;
  label: string;
};

/**
 * Custom animated back button component.
 * It animates the button label and shifts the icon slightly on hover, 
 * using a standard anchor tag for navigation compatibility.
 */
export default function BackButton({ href, label }: BackButtonProps) {
  // Use a standard anchor tag wrapped in motion for animation and handling navigation
  return (
    <motion.a
      href={href} // Use standard href for navigation
      className="inline-flex items-center text-gray-300 hover:text-[#FFD700] transition-colors duration-200 cursor-pointer group"
      whileHover={{ x: -4 }} // Subtle shift left on hover
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="mr-1"
      >
        <ChevronLeft size={24} />
      </motion.div>
      <span className="font-medium text-lg">{label}</span>
    </motion.a>
  );
}
