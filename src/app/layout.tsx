import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/sidebar-context';
import { getReportNav, getDeepResearchNav } from '@/lib/navigation';

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Supri Spinach — Daily Stock Report',
  description: 'AI-generated daily stock analysis for 31 watchlist stocks',
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
      <body className="flex h-full overflow-hidden">
        <SidebarProvider>
          <Sidebar reportItems={reportItems} deepResearchItems={deepResearchItems} />
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-10">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
