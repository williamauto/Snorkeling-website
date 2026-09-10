import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Snorkeling Miami',
  description:
    'Every real snorkeling spot from Lauderdale-by-the-Sea to Islamorada, grouped reef by reef, with access type, depth, and what you will actually see.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-body">
        <header className="sticky top-0 z-40 border-b border-lagoon-deep/10 bg-foam/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-lagoon-deep">
              <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                <circle cx="15" cy="15" r="15" fill="#FF9E7F" />
                <path
                  d="M6 16c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0M6 21c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"
                  stroke="#0B2A2E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              Snorkeling Miami
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-semibold text-ink/80 sm:flex">
              <Link href="/#explore" className="hover:text-lagoon-deep">
                Explore areas
              </Link>
              <Link href="/#map" className="hover:text-lagoon-deep">
                Map
              </Link>
              <Link href="/compare/" className="hover:text-lagoon-deep">
                Compare spots
              </Link>
            </nav>
            <Link
              href="/compare/"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-[#241009] shadow-sm transition hover:-translate-y-0.5 sm:hidden"
            >
              Compare
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-lagoon-deep/10 bg-[#06181C] py-12 text-sm text-[#9FC7C4]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-9 px-5 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
            <div>
              <p className="flex items-center gap-2 font-display text-base font-semibold text-[#EAF6F4]">
                <svg width="22" height="22" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                  <circle cx="15" cy="15" r="15" fill="#FF9E7F" />
                  <path
                    d="M6 16c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0M6 21c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"
                    stroke="#0B2A2E"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Snorkeling Miami
              </p>
              <p className="mt-3 max-w-sm text-[#7FA6A1]">
                A reef-by-reef guide from Lauderdale-by-the-Sea to Islamorada. Every spot is sourced
                and cited; see each area page for where the details came from.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-[#5D8C87]">Explore</h4>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                <li>
                  <Link href="/#explore" className="text-[#CFE6E2] hover:text-[#EAFBF8]">
                    All beach areas
                  </Link>
                </li>
                <li>
                  <Link href="/compare/" className="text-[#CFE6E2] hover:text-[#EAFBF8]">
                    Compare every spot
                  </Link>
                </li>
                <li>
                  <Link href="/#map" className="text-[#CFE6E2] hover:text-[#EAFBF8]">
                    Map
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-[#5D8C87]">About the data</h4>
              <p className="mt-3.5 text-[#CFE6E2]">
                Content is researched from public dive and snorkel guides. Verify current conditions,
                fees, and operator availability before you go.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
