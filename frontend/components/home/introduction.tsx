"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Introduction() {
  return (
    <section id="home" className="w-full py-16 bg-theme-background flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-3xl  bg-gradient-to-br from-colorTwo to-colorTwo-light border-none shadow-lg">
        <CardContent className="p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center">FIND THE FAKE</h1>
            <p className="text-xl md:text-2xl text-white text-center mb-8">
              See the Spread. Stop the Lies. — AI-Powered Misinformation Tracker Across Social Media.
            </p>
            <div className="flex justify-center">
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                <ChevronDown className="text-white w-8 h-8" />
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </section>
  )
}

