import type { Metadata } from 'next';
import '@/app/globals.scss';

export const metadata: Metadata = {
  title: 'Chess Tournament',
  description: 'Chess tournament listing and management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
