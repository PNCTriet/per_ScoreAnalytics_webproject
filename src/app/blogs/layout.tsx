

import type { Metadata } from 'next'
 
export function generateMetadata(): Metadata {
  return {
    title: 'Bloglist',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
