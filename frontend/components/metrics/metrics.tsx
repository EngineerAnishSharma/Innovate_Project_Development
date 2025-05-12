"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type MetricProps = {
  value: number
  label: string
}

const MetricItem = ({ value, label }: MetricProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 800 // faster animation (0.8 seconds)
    const steps = 40
    const stepTime = duration / steps
    const increment = value / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep += 1
      setCount(Math.min(Math.round(increment * currentStep), value))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="flex flex-col items-center text-center" id="metrics">
      <span className="text-6xl font-mono font-bold text-theme dark:text-themelight mb-2 tracking-tight">{count}</span>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
       <motion.div className="relative inline-block">
  <motion.span
    className="text-white-black text-sm uppercase tracking-wider font-mono"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    {label}
  </motion.span>
  <motion.div
    className="absolute left-0 bottom-0 h-0.5 bg-colorTwo"
    initial={{ width: 0 }}
    animate={{ width: "50%" }} // Expand to full text width
    transition={{ duration: 0.5, delay: 0.6 }}
  />
</motion.div>

      </motion.div>
    </div>
  )
}

export default function Metrics() {
  const metrics = [
    { value: 46, label: "Number of pages crawled" },
    { value: 128, label: "Fake news detected" },
    { value: 84, label: "Accuracy percentage" },
  ]

  return (
    <section className="w-full py-16 bg-theme-background">
     <div className="container mx-auto">
        <h2 className="text-3xl font-mono uppercase tracking-wider text-white-black mb-12 border-l-4 border-colorTwo pl-4">
          METRICS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {metrics.map((metric, index) => (
            <MetricItem key={index} value={metric.value} label={metric.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
