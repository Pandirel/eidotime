import "./globals.css"
export const metadata = {
  title: "EidoTime",
  description: "Page to see the duration of the day and night cycles of cetus to know when to do trido ⚔️🌙",
  icons : {
    icon: "https://cdn.discordapp.com/attachments/829820621142753300/1291061665177276478/Logo.png?ex=66feba5f&is=66fd68df&hm=6c1d6df8588f67bd557e86d9f2b49a5f105ef199d9682f2b39120d5e3728b7b9&"
  }
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
