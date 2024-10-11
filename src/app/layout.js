import "./globals.css";
import Script from 'next/script';

export const metadata = {
  title: "EidoTime",
  description: "Page to see the duration of the day and night cycles of Cetus to know when to do trido ⚔️🌙",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"/>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QET62H832Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QET62H832Y');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
