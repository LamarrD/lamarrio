import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://lamarr.io"),
  title: "Lamarr's Blog",
  description: "Lamarr's personal site and blog",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Lamarr's Blog",
    description: "Lamarr's personal site and blog",
    type: "website",
    url: "./",
    site_name: "Lamarr's Blog",
  },
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
            <div className="flex justify-center space-x-4 mb-4">
              <a
                href="https://www.linkedin.com/in/lamarrd/"
                target="_blank"
                className="text-gray-500 hover:text-gray-700"
                aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.23 0H1.77C.79 0 0 .77 0 1.73v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.21 0 22.23 0zM7.19 20.45H3.56V9h3.63v11.45zM5.38 7.58a2.1 2.1 0 01-2.1-2.1c0-1.16.94-2.1 2.1-2.1s2.1.94 2.1 2.1c0 1.16-.94 2.1-2.1 2.1zm14.53 12.87h-3.63v-5.9c0-1.41-.03-3.22-1.97-3.22-1.98 0-2.28 1.54-2.28 3.12v6h-3.63V9h3.48v1.56h.05c.49-.94 1.7-1.93 3.5-1.93 3.74 0 4.43 2.46 4.43 5.67v6.15z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/tworlamarr"
                target="_blank"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.56a9.94 9.94 0 01-2.89.79A5.03 5.03 0 0023.34 3c-.96.57-2.02.98-3.15 1.2a4.92 4.92 0 00-8.38 4.48A13.98 13.98 0 011.64 3.16a4.93 4.93 0 001.52 6.56 4.9 4.9 0 01-2.23-.61v.06a4.92 4.92 0 003.95 4.83 4.96 4.96 0 01-2.22.08 4.93 4.93 0 004.6 3.41A9.9 9.9 0 010 21.54a14 14 0 007.56 2.21c9.05 0 14-7.5 14-14 0-.21 0-.42-.01-.63A9.97 9.97 0 0024 4.56z" />
                </svg>
              </a>
              <a
                href="https://github.com/lamarrd"
                target="_blank"
                className="text-gray-500 hover:text-gray-700"
                aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297a12.013 12.013 0 00-3.795 23.42c.6.112.82-.258.82-.577v-2.17c-3.34.724-4.045-1.614-4.045-1.614-.546-1.387-1.33-1.757-1.33-1.757-1.086-.742.082-.727.082-.727 1.2.086 1.83 1.235 1.83 1.235 1.07 1.831 2.81 1.303 3.495.995.108-.776.42-1.304.763-1.604-2.665-.3-5.467-1.329-5.467-5.926 0-1.31.468-2.382 1.235-3.22-.124-.303-.534-1.522.118-3.176 0 0 1.005-.322 3.3 1.23a11.418 11.418 0 016 0c2.295-1.553 3.3-1.23 3.3-1.23.654 1.654.244 2.873.12 3.176.768.838 1.234 1.91 1.234 3.22 0 4.61-2.805 5.624-5.475 5.916.432.374.816 1.109.816 2.235v3.31c0 .32.22.692.825.575A12.016 12.016 0 0012 .297" />
                </svg>
              </a>
            </div>
            <p className="text-gray-600">&copy; {new Date().getFullYear()} Lamarr Henry - All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
