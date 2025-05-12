import { Home, PieChart, Video, BarChart3, Search, TrendingUp, LineChart } from "lucide-react";
import { Links as LinksType } from "../ui/sidebar";

export const Links: LinksType[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <Home className="text-neutral-700 dark:text-neutral-200 hover:text-theme h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: "metrics",
    label: "Metrics",
    icon: (
      <BarChart3 className="text-neutral-700 dark:text-neutral-200 hover:text-theme h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: "search",
    label: "Search",
    icon: (
      <Search className="text-neutral-700 dark:text-neutral-200 hover:text-theme h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: "trending",
    label: "Trending",
    icon: (
      <TrendingUp className="text-neutral-700 dark:text-neutral-200 hover:text-theme h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <LineChart className="text-neutral-700 dark:text-neutral-200 hover:text-theme h-5 w-5 flex-shrink-0" />
    ),
  },
]; 