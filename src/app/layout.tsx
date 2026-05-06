import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import AudioPlayer from "@/components/AudioPlayer";

export const viewport: Viewport = {
  themeColor: "#FF9933",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ramnambank.in"),
  title: {
    default: "श्री राम नाम महाधन संचय बैंक | Ayodhya Dham Official - World's Largest Spiritual Bank",
    template: "%s | श्री राम नाम महाधन संचय बैंक"
  },
  description: "अयोध्या धाम से संचालित विश्व का सबसे बड़ा आध्यात्मिक बैंक। जहाँ भक्त प्रभु श्री राम के पावन नाम को अपनी शाश्वत पूंजी के रूप में संचित करते हैं। डिजिटल राम नाम संचय और आध्यात्मिक प्रगति का वैश्विक केंद्र।",
  keywords: [
    "Ram Nam Bank", 
    "Ayodhya Ram Mandir", 
    "Spiritual Banking", 
    "Ram Nam Sanchay", 
    "Shri Jagannath OdiaBaba", 
    "Ayodhya Dham Official Site", 
    "Digital Ram Nam Bank", 
    "Spiritual Wealth",
    "Ram Nam Lekhan",
    "Ram Mantra Sanchay",
    "Ayodhya Spiritual ERP",
    "Sanchay Bank Ayodhya"
  ],
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Shri Jagannath OdiaBaba Sewa Sansthan" }],
  creator: "Antigravity AI",
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: "https://ramnambank.in",
    title: "श्री राम नाम महाधन संचय बैंक | अयोध्या धाम - विश्व का सबसे बड़ा आध्यात्मिक बैंक",
    description: "अपनी आध्यात्मिक पूंजी संचित करें। प्रभु श्री राम के पावन नाम का वैश्विक आध्यात्मिक कोष। अयोध्या धाम से संचालित।",
    siteName: "Ram Nam Bank Ayodhya",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Shri Ram Nam Bank Ayodhya Dham",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "श्री राम नाम महाधन संचय बैंक | Ayodhya Dham",
    description: "विश्व का सबसे बड़ा आध्यात्मिक बैंक - अयोध्या धाम। राम नाम संचय का पावन स्थान।",
    images: ["/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "श्री राम नाम महाधन संचय बैंक",
    "url": "https://ramnambank.in",
    "logo": "https://ramnambank.in/logo.png",
    "description": "अयोध्या धाम से संचालित विश्व का सबसे बड़ा आध्यात्मिक बैंक।",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ayodhya",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "224123",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9598023701",
      "contactType": "Customer Service"
    }
  };

  return (
    <html lang="hi">
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <AudioPlayer />
      </body>
    </html>
  );
}
