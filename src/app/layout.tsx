import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/sidebar-context';
import { getReportNav, getDeepResearchNav, getGeneralNav, getMarketOverviewNav } from '@/lib/navigation';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { InstallPrompt } from '@/components/install-prompt';
import { SearchTrigger } from '@/components/search-trigger';
import { LoginDialogOverlay } from '@/components/login-dialog-overlay';
import { AuthInitializer } from '@/components/auth-initializer';
import { siteUrl, siteName, siteDescription } from '@/lib/site';

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(siteName + ' \u2014 Daily Stock Report')}&desc=${encodeURIComponent(siteDescription)}`;

export const metadata: Metadata = {
  title: {
    default: `${siteName} \u2014 Daily Stock Report`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    siteName,
    title: `${siteName} \u2014 Daily Stock Report`,
    description: siteDescription,
    url: siteUrl,
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} \u2014 Daily Stock Report`,
    description: siteDescription,
    images: [ogImageUrl],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteName,
    startupImage: '/icon-512.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteName,
    'application-name': siteName,
    'msapplication-TileColor': '#0a0a0a',
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
  const generalGroups = getGeneralNav();
  const marketOverviewItems = getMarketOverviewNav();

  return (
    <html
      lang="en"
      className={`${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
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
        <LoginDialogOverlay />
        <AuthInitializer />
        <SidebarProvider>
          <Sidebar reportItems={reportItems} deepResearchGroups={deepResearchGroups} generalGroups={generalGroups} marketOverviewItems={marketOverviewItems} />
          <main className="flex-1 overflow-y-auto px-4 pt-14 pb-6 md:px-10 md:py-10">
            <SearchTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
