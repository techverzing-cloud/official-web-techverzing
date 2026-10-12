import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Cta from "@/components/global/Cta";
import ClientProviders from "@/components/global/ClientProviders";
import JsonLd from "@/components/global/JsonLd";
import Preloader from "@/components/global/Preloader";
import WhatsAppButton from "@/components/global/WhatsAppButton";
import { ENABLE_PRELOADER } from "@/lib/config";
import { siteConfig } from "@/lib/seo";
import "../../css/globals.css";
import "../../css/tailwind.css";
import "../../css/animations.css";
import { inter, lexend, outfit, spaceMono } from "@/components/others";

const siteUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/global/favicon.ico",
    apple: [
      {
        url: "/global/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: siteConfig.name,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/global/logo.png`,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.addressLocality,
    addressRegion: siteConfig.address.addressRegion,
    addressCountry: siteConfig.address.addressCountry,
  },
  sameAs: [...siteConfig.socialLinks],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: "en",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="OC8MtvrYvrRZn-VySwA_M2RaJwEmcPVxRaH4UVyUPGg"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9W5BW55VY6"
          strategy="afterInteractive"
        />

        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9W5BW55VY6');
          `}
        </Script>
      </head>

      <GoogleTagManager gtmId="GTM-MG2ZRTFC" />

      <body
        className={`${outfit.variable} ${inter.variable} ${spaceMono.variable} ${lexend.variable} antialiased min-h-screen font-space-mono`}
      >
        <Preloader />

        <header>
          <Header />
        </header>

        <main className="mrBg min-h-screen">{children}</main>

        <Cta />

        <footer>
          <Footer />
        </footer>

        <ClientProviders />
        <WhatsAppButton />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </body>
    </html>
  );
}