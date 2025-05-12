import Analytics from "@/components/analytics/analytics";
import Introduction from "@/components/home/introduction";
import Metrics from "@/components/metrics/metrics";
import Search from "@/components/search/search";
import TrendingComponent from "@/components/trending/trending-componnet";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-black">
      <Introduction />
      <Metrics />
      <Search />
      <div className="container mx-auto">
        <div className="border-b border-emerald-200/20 dark:border-emerald-100/20 my-4"></div>
      </div>
      <TrendingComponent />

      <div className="container mx-auto">
        <div className="border-b border-white/20 my-4"></div>
      </div>

      <Analytics />

      <div className="container mx-auto">
        <div className="border-b border-white/20 my-4"></div>
      </div>
    </main>
  );
}
