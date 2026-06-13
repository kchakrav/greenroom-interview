import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "AIInterview — practice & screen with an AI interviewer",
  description:
    "A world-class AI interview platform: immersive voice/video/text/coding interviews with adaptive questioning, BARS scoring, and personalized mentoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="ambient min-h-screen antialiased">{children}</body>
    </html>
  );
}
