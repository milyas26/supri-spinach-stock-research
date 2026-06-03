import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/sidebar-context';
import { getReportNav, getDeepResearchNav } from '@/lib/navigation';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Supri Spinach — Daily Stock Report',
  description: 'AI-generated daily stock analysis for 31 watchlist stocks',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mr. Supri',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reportItems = getReportNav();
  const deepResearchItems = getDeepResearchNav();

  return (
    <html
      lang="en"
      className={`${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#16a34a" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="flex h-full overflow-hidden">
        <ServiceWorkerRegistration />
        <SidebarProvider>
          <Sidebar reportItems={reportItems} deepResearchItems={deepResearchItems} />
          <main className="flex-1 overflow-y-auto px-4 pt-14 pb-6 md:px-10 md:py-10">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
