import { redirect } from 'next/navigation';
import { getMarketOverviewFiles } from '@/lib/content';

export default function Home() {
  const files = getMarketOverviewFiles();
  const latest = files.length > 0 ? files[0] : null;

  if (latest) {
    redirect(`/market-overview/${latest}`);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-5xl text-[#00FF88]/20">◈</div>
        <h1 className="text-lg font-semibold text-[#E4E7EC] mb-2">Supri Spinach Terminal</h1>
        <p className="text-sm text-[#5A6270]">
          Waiting for the first report drop...
        </p>
      </div>
    </div>
  );
}
