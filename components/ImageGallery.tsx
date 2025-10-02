"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo, Transition } from "framer-motion";
import Image from "next/image";
import { supabase } from "../lib/supabase.client";

interface GalleryImage {
  id: number;
  url: string;
}

interface Rotation {
  rotateX: number;
  rotateY: number;
}

// ------------------------
// Wiggle animation keyframes (no opacity change)
// ------------------------
const WIGGLE_ANIMATE = {
  rotateY: [0, 15, -15, 0],
  rotateX: [0, 10, -10, 0],
  x: [0, 5, -5, 0],
  opacity: 1, // ✅ Ensure fully visible
};

const WIGGLE_TRANSITION: Transition = {
  duration: 1.5,
  ease: "easeInOut",
};

const BASE_TRANSITION: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export default function ImageGallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [index, setIndex] = useState(0);
  const [rotation, setRotation] = useState<Rotation>({ rotateX: 0, rotateY: 0 });
  const [wiggleTriggered, setWiggleTriggered] = useState(false);

  // Fetch gallery images
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

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) =>
        galleryImages.length ? (prev + 1) % galleryImages.length : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  // Trigger wiggle after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (galleryImages.length) setWiggleTriggered(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [galleryImages]);

  const nextImage = () => setIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () =>
    setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const DAMPING = 5;
    const MAX_ROT = 20;
    setRotation({
      rotateY: Math.max(Math.min(info.offset.x / DAMPING, MAX_ROT), -MAX_ROT),
      rotateX: Math.max(Math.min(-info.offset.y / DAMPING, MAX_ROT), -MAX_ROT),
    });
  };

  const handleDragEnd = (info: PanInfo, threshold: number) => {
    setRotation({ rotateX: 0, rotateY: 0 });
    if (info.offset.x < -threshold) nextImage();
    else if (info.offset.x > threshold) prevImage();
  };

  if (!galleryImages.length) return null;

  const getAnimateTarget = (isTop: boolean, pos: number) => ({
    opacity: 1,
    scale: 1 - 0.05 * pos,
    y: 20 * pos,
    rotate: isTop ? 0 : pos * -2,
    x: 10 * pos,
    rotateY: isTop ? rotation.rotateY : 0,
    rotateX: isTop ? rotation.rotateX : 0,
  });

  const renderGallery = (maxVisible: number, perspective: string) =>
    galleryImages.map((img, i) => {
      const pos = (i - index + galleryImages.length) % galleryImages.length;
      if (pos > maxVisible) return null;
      const isTop = pos === 0;

      return (
        <motion.div
          key={img.id}
          drag={isTop}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.3}
          onDrag={isTop ? handleDrag : undefined}
          onDragEnd={(e, info) => isTop && handleDragEnd(info, 75)}
          whileTap={{ cursor: "grabbing" }}
          initial={{ opacity: 1, y: 0 }} // ✅ No fade-in
          animate={isTop && wiggleTriggered ? WIGGLE_ANIMATE : getAnimateTarget(isTop, pos)}
          transition={isTop && wiggleTriggered ? WIGGLE_TRANSITION : BASE_TRANSITION}
          onAnimationComplete={() => isTop && wiggleTriggered && setWiggleTriggered(false)}
          className="absolute w-full h-full rounded-lg shadow-lg overflow-hidden cursor-grab border-2 border-[#FFD700]"
          style={{ zIndex: galleryImages.length - pos, perspective }}
        >
          <Image
            src={img.url}
            alt={`Gallery ${i + 1}`}
            fill
            priority={isTop}
            className="object-cover rounded-lg select-none pointer-events-none"
          />
        </motion.div>
      );
    });

  return (
    <section className="pt-0 mb-12 flex justify-center">
      <div className="md:hidden relative w-full max-w-[200px] aspect-[2/3] perspective-[800px]">
        <AnimatePresence initial={true}>{renderGallery(2, "800px")}</AnimatePresence>
      </div>

      <div className="hidden md:flex relative w-full max-w-[300px] aspect-[2/3] justify-center items-center perspective-[1000px]">
        <AnimatePresence initial={true}>{renderGallery(3, "1000px")}</AnimatePresence>
      </div>
    </section>
  );
}
