

import type { Metadata } from 'next'
 
export function generateMetadata(): Metadata {
  return {
    title: 'Blog detail',
    description: 'hello 123',
  }
}

export default function ViewDetail({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
