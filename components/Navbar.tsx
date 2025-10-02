"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X, Home, User, Folder, Code, Award, LayoutDashboard, Mail } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Skills", href: "/skills", icon: Code },
  { name: "Certifications", href: "/certifications", icon: Award },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contact", href: "/contact", icon: Mail },
];

// Nav link component with grouped hover animation + active highlight
function NavLink({ link }: { link: typeof navLinks[0] }) {
  const pathname = usePathname(); // get current path
  const Icon = link.icon;
  const [isHovered, setIsHovered] = useState(false);

  // Determine if this link is active
  const isActive = pathname === link.href;

  return (
    <motion.div
      className="flex items-center gap-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      animate={{
        color: isActive ? "#FFD700" : isHovered ? "#FFD700" : "#FFFFFF",
      }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="flex-shrink-0"
        animate={{ rotate: isHovered ? -12 : 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Icon size={20} />
      </motion.div>
      <motion.span
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="transition-transform font-semibold"
      >
        {link.name}
      </motion.span>
    </motion.div>
  );
}

// Variants
// Adjust panelVariants to slide down from just below the top bar's height (approx 56px)
const panelVariants: Variants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.3 } },
  visible: { 
    height: "calc(100vh - 56px)", 
    opacity: 1, 
    transition: { 
      type: "spring" as const, 
      stiffness: 120, 
      damping: 20, 
      when: "beforeChildren" 
    } 
  },
  exit: { height: 0, opacity: 0, transition: { duration: 0.3, when: "afterChildren" } },
};

const linkVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.2 + i * 0.1, type: "spring" as const, stiffness: 100, damping: 15 },
  }),
};

// Variants for first-time loading animation (desktop)
const firstTimeVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.2 + i * 0.1, type: "spring" as const, stiffness: 100, damping: 15 },
  }),
};

// REMOVED THE DUPLICATE EXPORT DEFAULT FROM HERE

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    // Check if this is the first time visiting any page in this session
    const hasVisited = sessionStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsFirstTime(true);
      sessionStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // Function to close menu on link click
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Desktop Vertical Navbar (z-50) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#0F172A] to-[#FFD700] border-r border-gray-700 z-50 px-6 py-8">
        {/* Logo & Title */}
        {/* Desktop Logo & Title */}
        <div className="flex flex-col items-start gap-2 mb-6">
          <a href="/" className="flex items-center gap-3 w-full">
            <div className="w-16 h-16 md:w-20 md:h-12 rounded-full overflow-hidden border-2 border-[#FFD700]">
              <img src="/images/logo.jpg" alt="Logo" width={64} height={64} className="object-cover" />
            </div>
            <span className="text-xl font-bold text-[#FFD700]">Christian Luis Aceron</span> 
          </a>
          <hr className="border-t border-gray-500 w-full mt-2" />
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 text-white text-base">
          {navLinks.map((l, i) => (
            <motion.div
              key={l.href}
              custom={i}
              variants={isFirstTime ? firstTimeVariants : undefined}
              initial={isFirstTime ? "hidden" : false}
              animate={isFirstTime ? "visible" : false}
            >
              {/* Replaced <Link> with <a> */}
              <a href={l.href}><NavLink link={l} /></a>
            </motion.div>
          ))}
        </nav>
        {/* Footer - Keep for desktop as part of the fixed vertical nav */}
        <p className="hidden md:block text-black mt-auto text-center text-sm">
          © {new Date().getFullYear()} Christian Luis Aceron. All rights reserved.
        </p>
      </aside>
      {/* Mobile Top Navbar and Smart Animated Menu */}
      {/* Set a high z-index to ensure the fixed header is always on top of page content. */}
      <header className="md:hidden fixed top-0 left-0 w-full z-[100]"> 
        
      {/* Top Bar (Contains logo and menu button) */}
      <div
        className={`flex items-center justify-between py-3 px-6 bg-[#0F172A] backdrop-blur relative z-[110] ${
          open ? "border-b-0" : "border-b border-gray-700"
        }`}
        style={{ minHeight: "56px" }}
      >
        {/* Logo and Title (Small version) */}
        {/* Mobile Logo & Title */}
          <motion.div
            layout
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <motion.div
              layoutId="logo-circle"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FFD700] flex-shrink-0"
            >
              <img
                src="/images/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </motion.div>
            <motion.span
              layoutId="logo-text"
              className="text-lg font-bold text-[#FFD700] whitespace-nowrap"
            >
              Christian Luis Aceron
            </motion.span>
          </motion.div>
        {/* Menu/Close Button */}
          <motion.button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded transition"
            style={{ position: "relative", zIndex: 120 }}
          >
          <AnimatePresence mode="popLayout" initial={false}>
            {open ? (
              <motion.div
                key="close-icon"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu-icon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Menu size={24} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu Panel (Slides down and expands below the top bar) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 w-full bg-gradient-to-b from-[#0F172A] to-[#FFD700] backdrop-blur shadow-2xl z-40 flex flex-col overflow-y-auto"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ paddingBottom: "20px" }}
          >
            {/* Large Logo and Title (Stacked) */}
            <motion.div
              layout
              layoutId="logo-container"
              className="flex flex-col items-center px-6 py-6 gap-4"
            >
              <motion.div
                layoutId="logo-circle"
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFD700] flex-shrink-0"
              >
                <img
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </motion.div>
              <motion.span
                layoutId="logo-text"
                className="text-2xl font-bold text-[#FFD700] text-center"
              >
                Christian Luis Aceron
              </motion.span>
            <hr className="border-t border-gray-500 w-full mt-2" />
            </motion.div>
          
            {/* Navigation Links */}
            <nav className="flex flex-col mt-4 gap-4 px-6 text-white text-xl">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={handleLinkClick} // Close menu on link click
                >
                  <a href={l.href}>
                    <NavLink link={l} />
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      </header>
    </>
  );
}

export default Navbar;