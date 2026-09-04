import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import PageTransition from "@/components/PageTransition";
import AntiInspect from "@/components/AntiInspect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "11WINS | Elite Football Representation",
  description: "Official portal for 11WINS Football Agency. Discover elite talent, scouting applications, and professional representation.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#0a3d28",
  openGraph: {
    title: '11WINS | Elite Football Representation',
    description: 'Discover our roster of world-class talent. Track market values, contract details, and sponsorship opportunities.',
    url: 'https://11wins.online',
    siteName: '11WINS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '11WINS | Elite Football Representation',
    description: 'Discover our roster of world-class talent.',
  },
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a3d28', // This matches your dark green header
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageTransition>
          {children}
          <CookieBanner /> 
          <AntiInspect /> 
        </PageTransition>
      </body>
    </html>
  );
}