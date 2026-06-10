import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/sidebar-context';
import { getReportNav, getDeepResearchNav, getGeneralNav } from '@/lib/navigation';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { InstallPrompt } from '@/components/install-prompt';
import { SearchTrigger } from '@/components/search-trigger';

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Supri Spinach — Daily Stock Report',
  description: 'AI-generated daily stock analysis for Konglo stocks',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Supri Spinach',
    startupImage: '/icon-512.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Supri Spinach',
    'application-name': 'Supri Spinach',
    'msapplication-TileColor': '#16a34a',
    'msapplication-TileImage': '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reportItems = getReportNav();
  const deepResearchGroups = getDeepResearchNav();
  const generalItems = getGeneralNav();

  return (
    <html
      lang="en"
      className={`${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="116308d7-ad11-4cfc-a86a-a5ee0cf13ffd"></script>
      </head>
      <body className="flex h-full overflow-hidden">
        <ServiceWorkerRegistration />
        <InstallPrompt />
        <SidebarProvider>
          <Sidebar reportItems={reportItems} deepResearchGroups={deepResearchGroups} generalItems={generalItems} />
          <main className="flex-1 overflow-y-auto px-4 pt-14 pb-6 md:px-10 md:py-10">
            <SearchTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
