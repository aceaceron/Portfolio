"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo, Variant, Transition } from "framer-motion"; // Import Variant and Transition for better typing
import Image from "next/image";
import { supabase } from "../lib/supabase.client";

interface GalleryImage {
  id: number;
  url: string;
}

// Interface for the 3D rotation state
interface Rotation {
  rotateX: number;
  rotateY: number;
}

// -------------------------------------------------------------
// 🔥 MODIFIED: Increased rotation angles for a "stronger" wiggle
const DRAG_HINT_TRANSITION: Transition = {
  rotateY: { duration: 1.5, ease: [0.4, 0, 0.2, 1], times: [0, 0.3, 0.6, 1] }, 
  rotateX: { duration: 1.5, ease: [0.4, 0, 0.2, 1], times: [0, 0.3, 0.6, 1] },
  x: { duration: 1.5, ease: [0.4, 0, 0.2, 1], times: [0, 0.3, 0.6, 1] },
};

const DRAG_HINT_ANIMATE = {
  rotateY: [0, 15, -15, 0], // Stronger wiggle left and right (increased from 8)
  rotateX: [0, 10, -10, 0], // Stronger tilt up and down (increased from 5)
  x: [0, 5, -5, 0],         // Slight horizontal translation
};

const BASE_TRANSITION: Transition = { type: "spring", stiffness: 300, damping: 30 };

// 🔥 NEW: Slower spring transition for the initial fly-in animation
// Lower stiffness = slower and bouncier; Higher damping = less bounce
const FLY_IN_TRANSITION: Transition = { type: "spring", stiffness: 100, damping: 20 };
// -------------------------------------------------------------


export default function ImageGallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [index, setIndex] = useState(0);
  const [rotation, setRotation] = useState<Rotation>({ rotateX: 0, rotateY: 0 });
  
  // 🔥 NEW STATE: Tracks if the component has completed its initial mount animation.
  const [isMounted, setIsMounted] = useState(false);

  // RENAMED STATE: Now tracks if the wiggle has been triggered, not if it's complete.
  const [wiggleTriggered, setWiggleTriggered] = useState(false);

  // Triggers the wiggle animation after 1.5 seconds.
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only set to true if the component has images (is loaded)
      if (galleryImages.length) {
        setWiggleTriggered(true);
      }
    }, 1500);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [galleryImages]); // Rerun if images load after initial render

  // Fetch images from Supabase
  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase.from("galleries").select("*");
      if (error) return console.error(error);
      const gallery: GalleryImage[] = (data || []).map((item: any) => ({
        id: item.id,
        url: item.image_url,
      }));
      setGalleryImages(gallery);
    };
    fetchGallery();
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (galleryImages.length ? (prev + 1) % galleryImages.length : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  const nextImage = () => setIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  // ... (handleDrag and handleDragEnd remain the same) ...
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const DAMPING_FACTOR = 5; 
    const maxRotation = 20; 
    
    const newRotateY = info.offset.x / DAMPING_FACTOR; 
    const newRotateX = -info.offset.y / DAMPING_FACTOR; 

    setRotation({
      rotateY: Math.min(Math.max(newRotateY, -maxRotation), maxRotation),
      rotateX: Math.min(Math.max(newRotateX, -maxRotation), maxRotation),
    });
  };
  
  const handleDragEnd = (info: PanInfo, threshold: number) => {
    setRotation({ rotateX: 0, rotateY: 0 }); 
    if (info.offset.x < -threshold) nextImage();
    else if (info.offset.x > threshold) prevImage();
  };

  if (!galleryImages.length) return null;

  /**
    * Returns the target animation properties.
    */
  const getAnimateTarget = (isTop: boolean, pos: number) => {
    // Now checks if wiggleTriggered is true
    if (isTop && wiggleTriggered) {
      return {
          opacity: 1, 
          scale: 1 - 0.05 * pos, 
          y: 20 * pos, 
          rotate: pos * -2, 
          x: 10 * pos,
          // The rest of the properties are defined by DRAG_HINT_ANIMATE when merged
          rotateY: 0, 
          rotateX: 0,
      };
    }

    // Default animate state (includes drag rotation)
    return { 
        opacity: 1, 
        scale: 1 - 0.05 * pos, 
        y: 20 * pos, 
        rotate: pos * -2, 
        x: 10 * pos,
        rotateY: isTop ? rotation.rotateY : 0, 
        rotateX: isTop ? rotation.rotateX : 0,
    };
  };

  /**
    * Returns the correct transition object (initial fly-in, drag hint, or base spring).
    */
  const getTransition = (isTop: boolean, pos: number) => {
    // 🔥 NEW: Use a slower transition for the initial mount (fly-in)
    if (!isMounted) {
        // Stagger the fly-in transition slightly based on position
        return { ...FLY_IN_TRANSITION, delay: pos * 0.1 }; 
    }
    
    // Check if wiggleTriggered is true
    if (isTop && wiggleTriggered) {
      return DRAG_HINT_TRANSITION;
    }
    // Otherwise, use the standard spring transition for drag and index change
    return BASE_TRANSITION;
  };
  
  // Calculates the initial fly-in position based on pos
  const getFlyInInitial = (pos: number) => {
    // Determine the initial x/y offset based on the position in the stack (pos)
    let initialX = 0;
    let initialY = 0;

    // Use a different side for each visible card for a more dynamic look
    const OFF_SCREEN_OFFSET = 500; 

    switch (pos) {
        case 0: // Top card flies in from the left
            initialX = -OFF_SCREEN_OFFSET; 
            break;
        case 1: // Second card flies in from the right
            initialX = OFF_SCREEN_OFFSET;
            break;
        case 2: // Third card flies in from the top
            initialY = -OFF_SCREEN_OFFSET;
            break;
        case 3: // Fourth card (desktop only) flies in from the bottom
            initialY = OFF_SCREEN_OFFSET;
            break;
        default:
            break;
    }

    return {
        // Start from a low scale/opacity
        opacity: 0, 
        scale: 0.5, 
        // Apply the fly-in position
        x: initialX,
        y: initialY,
        // The standard stacked properties for the target state (to be overwritten by animate)
        rotate: pos * -2, 
    };
  }


  return (
    <section className="pt-0 mb-12 flex justify-center">
      
      {/* Mobile Gallery */}
      <div className="md:hidden relative w-full max-w-[200px] aspect-[2/3] perspective-[800px]">
        <AnimatePresence initial={true}>
          {galleryImages.map((img, i) => {
            const pos = (i - index + galleryImages.length) % galleryImages.length;
            if (pos > 2) return null;
            const isTop = pos === 0;

            return (
              <motion.div
                key={img.id}
                drag={isTop ? true : false} 
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} 
                dragElastic={0.3}
                onDrag={isTop ? handleDrag : undefined} 
                onDragEnd={(e, info) => {
                  if (!isTop) return;
                  handleDragEnd(info, 50); 
                }}
                whileTap={{ cursor: "grabbing" }}
                
                // Use the new fly-in initial state
                initial={getFlyInInitial(pos)}
                
                // Apply wiggle only if triggered, otherwise, go to target position
                animate={
                  isTop && wiggleTriggered 
                    ? { ...getAnimateTarget(isTop, pos), ...DRAG_HINT_ANIMATE } 
                    : getAnimateTarget(isTop, pos)
                } 
                
                exit={{ opacity: 0, scale: 0.8 }}
                
                // 🔥 MODIFIED: Pass 'pos' to the transition function
                transition={getTransition(isTop, pos)}

                // 🔥 NEW/MODIFIED: Set isMounted to true after the first animation is complete
                onAnimationComplete={(definition) => {
                    // Type-cast definition to a plain object to safely check properties
                    const animDef = definition as Record<string, any> | undefined; 
                    
                    if (animDef && animDef.opacity === 1 && !isMounted) {
                        setIsMounted(true);
                    }
                    if (isTop && wiggleTriggered) {
                        setWiggleTriggered(false);
                    }
                }}
                
                className="absolute w-full h-full rounded-lg shadow-lg overflow-hidden cursor-grab border-2 border-[#FFD700]"
                style={{ zIndex: galleryImages.length - pos }}
              >
                <Image
                  src={img.url}
                  alt={`Gallery ${i + 1}`}
                  fill
                  priority={isTop} // Improve loading for the top image
                  className="object-cover rounded-lg select-none pointer-events-none"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------- */}

      {/* Desktop Stacked Gallery (Similar changes applied here) */}
      <div className="hidden md:flex relative w-full max-w-[300px] aspect-[2/3] justify-center items-center perspective-[1000px]">
        <AnimatePresence initial={true}>
          {galleryImages.map((img, i) => {
            const pos = (i - index + galleryImages.length) % galleryImages.length;
            if (pos > 3) return null;
            const isTop = pos === 0;

            return (
              <motion.div
                key={img.id}
                drag={isTop ? true : false} 
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} 
                dragElastic={0.3}
                onDrag={isTop ? handleDrag : undefined}
                onDragEnd={(e, info) => {
                  if (!isTop) return;
                  handleDragEnd(info, 75); 
                }}
                whileTap={{ cursor: "grabbing" }}

                // Use the new fly-in initial state
                initial={getFlyInInitial(pos)}
                
                // Apply wiggle only if triggered, otherwise, go to target position
                animate={
                    isTop && wiggleTriggered 
                      ? { ...getAnimateTarget(isTop, pos), ...DRAG_HINT_ANIMATE } 
                      : getAnimateTarget(isTop, pos)
                } 
                
                exit={{ opacity: 0, scale: 0.8 }}
                
                // 🔥 MODIFIED: Pass 'pos' to the transition function
                transition={getTransition(isTop, pos)}

                // 🔥 NEW/MODIFIED: Set isMounted to true after the first animation is complete
                onAnimationComplete={(definition) => {
                    // Type-cast definition to a plain object to safely check properties
                    const animDef = definition as Record<string, any> | undefined; 
                    
                    if (animDef && animDef.opacity === 1 && !isMounted) {
                        setIsMounted(true);
                    }
                    if (isTop && wiggleTriggered) {
                        setWiggleTriggered(false);
                    }
                }}
                
                className="absolute w-full h-full rounded-lg shadow-lg overflow-hidden cursor-grab border-2 border-[#FFD700]"
                style={{ zIndex: galleryImages.length - pos }}
              >
                <Image
                  src={img.url}
                  alt={`Gallery ${i + 1}`}
                  fill
                  priority={isTop} // Improve loading for the top image
                  className="object-cover rounded-lg select-none pointer-events-none"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}