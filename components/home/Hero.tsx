"use client";

import AnimatedButton from "../AnimatedButton";
import ImageGallery from "../ImageGallery"; 

export default function Hero() {
  return (
    <section className="pt-0">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Gallery */}
        <div>
          <ImageGallery /> 
        </div>

        {/* Right Text */}
        <div>
          <h1 className="text-2xl text-accent">Hi, I’m Christian Luis Aceron</h1>
          <p className="mt-4 text-white">
            I am an aspiring full-stack developer based in Labo, Camarines Norte, Philippines.
            During college, I built systems using vanilla HTML, CSS, and JavaScript, focusing
            on creating functional and responsive user interfaces. I designed intuitive UI/UX
            layouts to ensure smooth and engaging user experiences. I also worked with databases
            to manage and organize data efficiently, integrating backend logic to support system
            functionalities. Additionally, I used third-party APIs to enhance structure, streamline
            development, and make apps easier to use.
          </p>
          <div className="mt-6 flex gap-3">
            <AnimatedButton label="Get to know more about me!" href="/about" />
          </div>
        </div>
      </div>
      <hr className="mt-12 border-[#FFD700]" />
    </section>
  );
}
