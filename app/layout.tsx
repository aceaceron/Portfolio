import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const poppins = Poppins({ subsets: ["latin"], weight: ["400","600","700"] });

export const metadata = {
  title: "Christian Luis Aceron | Portfolio",
  description: "Full-Stack Developer Portfolio of Christian Luis Aceron"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
