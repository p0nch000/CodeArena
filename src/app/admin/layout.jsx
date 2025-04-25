import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <head>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        </head>
        <body className="bg-mahindra-navy-blue min-h-screen">
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </body>
      </html>
    );
  }
  