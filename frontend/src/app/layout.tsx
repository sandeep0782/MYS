import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LayourWrapper from "@/components/LayoutWrapper";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Shopping for Women, Men, Kids fashion & Lifestyles - Mysmme",
  description: "mysmme.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${assistant.variable}  antialiased`}
      >
        <LayourWrapper>
          <Header />
          {children}
          <Footer />
        </LayourWrapper>
      </body>
    </html>
  );
}
