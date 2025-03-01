import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import Layout from "./components/layout";

const figtree = localFont({
  src: [
    {
      path: "./fonts/Figtree/Figtree-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Figtree/Figtree-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Figtree/Figtree-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Figtree/Figtree-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/Figtree/Figtree-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Figtree/Figtree-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Figtree/Figtree-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Figtree/Figtree-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Figtree/Figtree-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  // title: "Post To Your LinkedIn with Confidence",
  // description: "Post To Your LinkedIn with Confidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`}>
        {/* {children} */}
        {children}
        <Toaster
          // toastOptions={{
          //   className: "bg-dark-700 border border-white/5 text-gray-300 p-4",
          // }}
        />
      </body>
    </html>
  );
}
