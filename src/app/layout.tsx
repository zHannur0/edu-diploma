import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/app/StoreProvider";

export const metadata: Metadata = {
  title: "Aqylshyn",
  description: "Ағылшын тілін оңай үйреніңіз!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <StoreProvider>
        <html lang="en" translate="no">
        <head>
          <title>Aqylshyn</title>
          <meta httpEquiv="Content-Language" content="en"/>
          <meta name="google" content="notranslate"/>
        </head>
        <body
            className={`antialiased`}
        >
        <main>
          {children}
        </main>
        </body>
        </html>
      </StoreProvider>

  );
}
