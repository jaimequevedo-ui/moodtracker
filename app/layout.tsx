import type { Metadata } from 'next';
import { Noto_Serif, Manrope } from 'next/font/google';
import './globals.css';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Mood-Tracker | Diario de Ánimo',
  description: 'Tu diario de estado de ánimo personal.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${notoSerif.variable} ${manrope.variable} dark`}>
      <body className="min-h-screen selection:bg-primary selection:text-on-primary antialiased">
        {children}
      </body>
    </html>
  );
}
