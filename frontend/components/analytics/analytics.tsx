"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Helper function to format dates without date-fns
const formatDate = (date: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getDate()}`
}

// Helper function to get date N days ago
const getDaysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Generate dates for the last 30 days
const generateDailyData = () => {
  return Array.from({ length: 30 }).map((_, i) => {
    const date = getDaysAgo(30 - i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return {
      date: dateStr,
      dateObj: date,
      reddit: Math.floor(Math.random() * 100) + 50,
      mastodon: Math.floor(Math.random() * 70) + 30,
    }
  })
}

const monthlyData = [
  { month: "Jan", reddit: 186, mastodon: 80 },
  { month: "Feb", reddit: 305, mastodon: 200 },
  { month: "Mar", reddit: 237, mastodon: 120 },
  { month: "Apr", reddit: 173, mastodon: 190 },
  { month: "May", reddit: 209, mastodon: 130 },
  { month: "Jun", reddit: 214, mastodon: 140 },
]

const platformData = [
  { platform: "Reddit", value: 65 },
  { platform: "Mastodon", value: 45 },
]

const categoryData = [
  { category: "Health", value: 80 },
  { category: "Politics", value: 95 },
  { category: "Military", value: 70 },
  { category: "Science", value: 60 },
  { category: "Technology", value: 75 },
]

const chartConfig = {
  reddit: {
    label: "Reddit",
    color: "var(--color-two)",
  },
  mastodon: {
    label: "Mastodon",
    color: "var(--color-two-light)",
  },
} satisfies ChartConfig

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/10 border border-white/20 p-3 rounded-lg shadow-md">
        <p className="font-medium text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState({
    from: getDaysAgo(30),
    to: new Date(),
  })
  const [allData] = useState(generateDailyData())
  const [filteredData, setFilteredData] = useState(allData)
  const [isVisible, setIsVisible] = useState({
    areaChart: false,
    radarChart: false,
    lineChart: false,
    barChart: false,
  })

  // Refs for intersection observer
  const areaChartRef = useRef(null)
  const radarChartRef = useRef(null)
  const lineChartRef = useRef(null)
  const barChartRef = useRef(null)

  // Filter data based on date range
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const filtered = allData.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= dateRange.from && itemDate <= dateRange.to
      })
      setFilteredData(filtered)
    }
  }, [dateRange, allData])

  // Setup intersection observer for animations
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === areaChartRef.current && entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, areaChart: true }))
        } else if (entry.target === radarChartRef.current && entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, radarChart: true }))
        } else if (entry.target === lineChartRef.current && entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, lineChart: true }))
        } else if (entry.target === barChartRef.current && entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, barChart: true }))
        }
      })
    }, options)

    if (areaChartRef.current) observer.observe(areaChartRef.current)
    if (radarChartRef.current) observer.observe(radarChartRef.current)
    if (lineChartRef.current) observer.observe(lineChartRef.current)
    if (barChartRef.current) observer.observe(barChartRef.current)

    return () => {
      if (areaChartRef.current) observer.unobserve(areaChartRef.current)
      if (radarChartRef.current) observer.unobserve(radarChartRef.current)
      if (lineChartRef.current) observer.unobserve(lineChartRef.current)
      if (barChartRef.current) observer.unobserve(barChartRef.current)
    }
  }, [])

  return (
    <section  id="analytics" className="w-full py-16 bg-theme-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-mono uppercase tracking-wider text-white mb-12 border-l-4 border-colorTwo pl-4">
          ANALYTICS
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Area Chart */}
          <Card
            ref={areaChartRef}
            className="col-span-1 lg:col-span-2  bg-white/5 border-colorTwo transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Fake News Trends</CardTitle>
                <CardDescription className="text-white/70">Daily tracking across platforms</CardDescription>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Date Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to })
                      }
                    }}
                    className="bg-white/10 text-white"
                  />
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              <motion.div
                className="h-[300px]"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible.areaChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient id="colorReddit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-two)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-two)" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorMastodon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-two-light)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-two-light)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(dateStr) => {
                        const date = new Date(dateStr)
                        return formatDate(date)
                      }}
                      stroke="var(--white-black)"
                      opacity={0.7}
                      tickLine={false}
                    />
                    <YAxis stroke="var(--white-black)" opacity={0.7} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="reddit"
                      stroke="var(--color-two)"
                      fillOpacity={1}
                      fill="url(#colorReddit)"
                    />
                    <Area
                      type="monotone"
                      dataKey="mastodon"
                      stroke="var(--color-two-light)"
                      fillOpacity={1}
                      fill="url(#colorMastodon)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm border-t border-white/10 pt-4">
              <div className="flex gap-2 font-medium leading-none text-white">
                <TrendingUp className="h-4 w-4 text-colorTwo" /> Trending up by 5.2% this month
              </div>
              <div className="text-sm text-white/70">Showing fake news trends across Reddit and Mastodon</div>
            </CardFooter>
          </Card>

          {/* Radar Chart */}
          <Card
            ref={radarChartRef}
            className="bg-white/5 border-colorTwo hover:border-colorTwo/50 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-white">Fake News by Category</CardTitle>
              <CardDescription className="text-white/70">Distribution across topics</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="h-[300px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible.radarChart ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                    <PolarGrid stroke="var(--white-black)" opacity={0.2} />
                    <PolarAngleAxis dataKey="category" stroke="var(--white-black)" />
                    <Radar
                      name="Fake News"
                      dataKey="value"
                      stroke="var(--color-two)"
                      fill="var(--color-two)"
                      fillOpacity={0.6}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4">
              <div className="text-sm text-white/70">Politics has the highest rate of fake news</div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <Card
            ref={lineChartRef}
            className="bg-white/5 border-colorTwo hover:border-colorTwo/50 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-white">Monthly Trends</CardTitle>
              <CardDescription className="text-white/70">January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible.lineChart ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8 }}
              >
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart
                    accessibilityLayer
                    data={monthlyData}
                    margin={{
                      top: 20,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid vertical={false} opacity={0.2} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      stroke="var(--white-black)"
                      opacity={0.7}
                    />
                    <YAxis tickLine={false} axisLine={false} stroke="var(--white-black)" opacity={0.7} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Line dataKey="reddit" type="monotone" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line dataKey="mastodon" type="monotone" strokeWidth={2} activeDot={{ r: 6 }} />
                  </LineChart>
                </ChartContainer>
              </motion.div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm border-t border-white/10 pt-4">
              <div className="flex gap-2 font-medium leading-none text-white">
                <TrendingUp className="h-4 w-4 text-colorTwo" /> Reddit shows higher fake news volume
              </div>
            </CardFooter>
          </Card>

          {/* Horizontal Bar Chart */}
          <Card
            ref={barChartRef}
            className="bg-white/5 border-colorTwo hover:border-colorTwo/50 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-white">Platform Comparison</CardTitle>
              <CardDescription className="text-white/70">Fake news by social platform</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="h-[300px]"
                initial={{ opacity: 0, x: 20 }}
                animate={isVisible.barChart ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.8 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                    <XAxis type="number" stroke="var(--white-black)" opacity={0.7} />
                    <YAxis
                      dataKey="platform"
                      type="category"
                      stroke="var(--white-black)"
                      opacity={0.7}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="var(--color-two)" radius={[0, 4, 4, 0]} barSize={40}>
                      <LabelList dataKey="value" position="right" fill="var(--white-black)" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4">
              <div className="text-sm text-white/70">Reddit has 44% more fake news than Mastodon</div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="container mx-auto mt-16">
        <Separator className="h-0.5 bg-white/20" />
      </div>
    </section>
  )
}

