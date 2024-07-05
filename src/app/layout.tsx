import './globals.css';
import type { Metadata } from 'next';
import { ThemeProviders, ToasterProviders } from '@/components';
import { poppins } from '@/config/fonts';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: {
    template: '%s | MTBCHAT',
    default: 'Home',
  },
  description:
    'MTBCHAT, a super fast chat application built with Next.js, Upstash and Pusher. Here you can chat with your friends in real-time. What are you waiting for? Join now!',
  openGraph: {
    title: 'Home | MTBCHAT',
    description:
      'MTBCHAT, a super fast web chat application built with Next.js, Upstash and Pusher, where you can communicate with your friends in real-time. What are you waiting for? Join now!',
    url: 'https://mtbchat.vercel.app',
    siteName: 'MTBCHAT',
    type: 'website',
    locale: 'en_US',
    images: [
      `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720070596/Portfolio/gvojdfxzifvoiv7atb0x.png`,
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home | MTBCHAT',
    description:
      'MTBCHAT, a super fast web chat application built with Next.js, Upstash and Pusher, where you can communicate with your friends in real-time. What are you waiting for? Join now!',
    images: [
      `https://res.cloudinary.com/dmlpgks2h/image/upload/v1720070596/Portfolio/gvojdfxzifvoiv7atb0x.png`,
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-white dark:bg-neutral-900"
    >
      <body className={poppins.className}>
        <ThemeProviders>
          <ToasterProviders>{children}</ToasterProviders>
        </ThemeProviders>
        <Analytics />
      </body>
    </html>
  );
}
