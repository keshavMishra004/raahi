import { Geist, Geist_Mono, Inika, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inika = Inika({
  variable: "--font-inika",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "RAAHi - Fly Bharat",
  description: "Charters, aerial services, and pilgrimage flights across India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-papm6kQ1pQnH3UX0DpD+s/1pYt6U+4PSJVpaz6RtZpmjHtkobaN6D+PfYZ7R6pujISiFDUFxIr05oig3FQ8XZw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inika.variable} ${inter.variable} ${instrumentSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

