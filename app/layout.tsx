import type { Metadata, Viewport } from "next";
import "./globals.css";
import Effects from "./effects";

export const metadata: Metadata = {
  title: "1.resto — Order on WhatsApp",
  description: "Fresh food, ordered in seconds. No app needed.",
};

export const viewport: Viewport = {
  themeColor: "#ff6b1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Effects />
        {children}
      </body>
    </html>
  );
}