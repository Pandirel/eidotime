import "./globals.css"
export default function RootLayout({ children }) {
  return (
    
    <html lang="en"  >
      <body 
      >
        <link rel="icon" href="./favicon.svg" sizes="any" />
        {children}
      </body>
    </html>
  );
}
