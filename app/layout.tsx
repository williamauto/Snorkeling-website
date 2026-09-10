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
    'Every real snorkeling spot from Lauderdale-by-the-Sea to Islamorada -- reef by reef, with access type, depth, and what you will actually see.',
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
            <nav className="flex items-center gap-5 text-sm font-semibold text-ink/80">
              <Link href="/#map" className="hover:text-lagoon-deep">
                Map
              </Link>
              <Link href="/compare" className="hover:text-lagoon-deep">
                Compare spots
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-lagoon-deep/10 bg-[#06181C] py-10 text-sm text-[#9FC7C4]">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="font-display text-base font-semibold text-[#EAF6F4]">Snorkeling Miami</p>
            <p className="mt-2 max-w-2xl text-[#7FA6A1]">
              A reef-by-reef guide from Lauderdale-by-the-Sea to Islamorada. Every spot is sourced and cited --
              see each area page for where the details came from.
            </p>
            <p className="mt-4 text-xs text-[#5D8C87]">
              Content researched from public dive/snorkel guides; verify current conditions, fees, and operator
              availability before you go.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
