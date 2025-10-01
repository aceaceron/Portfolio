import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Poppins } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script";

const poppins = Poppins({ subsets: ["latin"], weight: ["400","600","700"] });

export const metadata = {
  title: "Christian Luis Aceron | Portfolio",
  description: "Full-Stack Developer Portfolio of Christian Luis Aceron",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Umami Analytics Script */}
        <Script
          src="https://umami-kappa-tan.vercel.app/script.js"
          data-website-id="8b4dc1cb-c54a-4b3b-bc42-438119625bbe"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${poppins.className} bg-primary text-gray-100`}>
        {/* Main wrapper to limit max width and center layout */}
        <div className="max-w-[1400px] mx-auto flex min-h-screen">
          {/* Sidebar / Navbar */}
          <Navbar />

          {/* Main content */}
          <main className="flex-1 pt-20 md:pt-10 px-4 md:px-12 lg:px-12">
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />

        <Analytics /> {/* Vercel Analytics */} 
        <SpeedInsights /> {/* Vercel Speed Insights */}
      </body>
    </html>
  );
}
