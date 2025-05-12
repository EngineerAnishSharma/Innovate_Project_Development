"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { AlertTriangle, Share2, Brain, Users, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"

const achievements = [
  { icon: <AlertTriangle className="w-6 h-6" />, label: "False Information Spreads Faster", value: "70%" },
  { icon: <Share2 className="w-6 h-6" />, label: "People Share Without Verifying", value: "59%" },
  { icon: <Brain className="w-6 h-6" />, label: "Trust in Online Content", value: "47%" },
  { icon: <Users className="w-6 h-6" />, label: "Users Want Better Fact-Checking", value: "85%" },
]

const chartData = [
  { browser: "Facebook", visitors: 320, fill: "#059669" },  // emerald-600
  { browser: "Twitter/X", visitors: 280, fill: "#10B981" }, // emerald-500
  { browser: "WhatsApp", visitors: 250, fill: "#34D399" },  // emerald-400
  { browser: "Instagram", visitors: 210, fill: "#6EE7B7" }, // emerald-300
  { browser: "TikTok", visitors: 190, fill: "#A7F3D0" },    // emerald-200
]

const chartConfig = {
  visitors: {
    label: "Cases",
  },
  "Facebook": {
    label: "Facebook",
    color: "#059669",  // emerald-600
  },
  "Twitter/X": {
    label: "Twitter/X",
    color: "#10B981",  // emerald-500
  },
  "WhatsApp": {
    label: "WhatsApp",
    color: "#34D399",  // emerald-400
  },
  "Instagram": {
    label: "Instagram",
    color: "#6EE7B7",  // emerald-300
  },
  "TikTok": {
    label: "TikTok",
    color: "#A7F3D0",  // emerald-200
  },
} satisfies ChartConfig

export default function AboutSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0])

  const totalCases = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <section ref={ref} id="about" className="py-20 relative overflow-hidden z-10 bg-emerald-50/50 dark:bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <Card className="flex flex-col bg-white dark:bg-black/90 border border-gray-200 dark:border-gray-800">
              <CardHeader className="items-center pb-0">
                <CardTitle className="text-gray-900 dark:text-white">Misinformation by Platform</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-300">Social Media Analysis 2024</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="text-3xl font-bold fill-gray-900 dark:fill-white"
                                >
                                  {totalCases.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-gray-500 dark:fill-gray-400"
                                >
                                  Cases
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none text-gray-900 dark:text-white">
                  Facebook leads with 32% of cases <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-gray-500 dark:text-gray-400">
                  Based on verified misinformation reports across platforms
                </div>
              </CardFooter>
            </Card>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-emerald-900 dark:text-emerald-300">About TruthLens</h2>
            <p className="text-lg mb-6 text-emerald-700 dark:text-emerald-400">
            In today's hyperconnected digital age, misinformation spreads faster than facts — especially across social media platforms . From fake news and manipulated images to deepfakes and misleading viral posts, the sheer volume of false content is overwhelming for users, fact-checkers, and even governments.
            </p>
            <p className="text-lg mb-8 text-emerald-700 dark:text-emerald-400">
              Our platform combines advanced fact-checking technology with user-friendly tools to help you verify information, identify potential false content, and make more informed decisions about what you share online.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  className="bg-emerald-50 dark:bg-emerald-900/50 rounded-lg p-4 border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-2">
                    <div className="mr-2 text-emerald-700 dark:text-emerald-400">{achievement.icon}</div>
                    <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">{achievement.value}</div>
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-500">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

