import type { Metadata } from "next";
import { Epilogue, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./store/StoreProvider";
import { cn } from "@repo/types/lib/utils";

// display - heading, title, logo
const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

// body font — everything else
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

// mono font — date, id, technical details
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Apptrackr",
  description: "Keep track of your job applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${epilogue.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
