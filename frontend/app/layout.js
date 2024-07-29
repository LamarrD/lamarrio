import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lamarr.io",
  description: "Lamarr's personal site and blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Head>
            <title>Lamarr Henry</title>
          </Head>
          <nav className="w-full py-4 text-xl">
            <ul className="flex justify-center space-x-4 list-none">
              <li className="list-none">
                <a className="no-underline" href="/">
                  About
                </a>
              </li>
              <li className="list-none">
                <a className="no-underline" href="/articles">
                  Articles
                </a>
              </li>
            </ul>
          </nav>
          <main className="flex-grow flex flex-col justify-center items-center w-full">{children}</main>
          <footer className="w-full py-4 bg-transparent text-center mt-auto">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} Lamarr Henry - All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
