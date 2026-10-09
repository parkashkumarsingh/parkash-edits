import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PARKASH // Video Editor & Motion Graphics Designer",
  description: "Portfolio of Parkash — Video Editor and Motion Graphics Designer specializing in high-retention YouTube editing, viral social reels, commercial ads, sound design, and graphic design.",
  keywords: [
    "Video Editor",
    "Motion Graphics",
    "YouTube Video Editor",
    "Reels Editor",
    "Premiere Pro",
    "After Effects",
    "Photoshop",
    "Illustrator",
    "Video Editing Portfolio",
    "Freelance Video Editor",
  ],
  authors: [{ name: "Parkash" }],
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#050508] text-[#f3f3f6] antialiased selection:bg-cinema-red selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
