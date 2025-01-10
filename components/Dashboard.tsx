'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { WeatherWidget } from './WeatherWidget'
import { NewsWidget } from './NewsWidget'
import { FinanceWidget } from './FinanceWidget'
import { WidgetSelector } from './WidgetSelector'
import { AnimatedBackground } from './AnimatedBackground'
import { Button } from '../components/minicomp/button'
import { Moon, Sun, ArrowLeft } from 'lucide-react'
import { useTheme } from 'next-themes'
import { GitHubWidget } from './GithubWidget'
import { MovieWidget } from './MovieWidget'
import clsx from 'clsx'

type WidgetType = 'weather' | 'news' | 'finance' | 'github' | 'movie' | null

export function Dashboard() {
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>(null)
  const { theme, setTheme } = useTheme()
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    })
  }, [controls])

  const renderWidget = () => {
    switch (selectedWidget) {
      case 'weather':
        return <WeatherWidget />
      case 'news':
        return <NewsWidget />
      case 'finance':
        return <FinanceWidget />
      case 'github':
        return <GitHubWidget />
      case 'movie':
        return <MovieWidget />
      default:
        return <WidgetSelector onSelect={setSelectedWidget} />
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <AnimatedBackground />
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="w-full min-h-screen p-8 text-cyan-200"
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.h1
              className={clsx(
                "text-5xl text-transparent bg-clip-text bg-gradient-to-r font-bold",
                theme === 'dark' ? 'from-cyan-400 to-blue-500' : 'from-blue-500 to-cyan-400'
              )}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              InsightHub Dashboard
            </motion.h1>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="border border-cyan-400 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-cyan-500/10 transition-colors duration-300"
              >
                <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ${theme === 'dark' ? 'dark:scale-0 dark:-rotate-90' : ''}`} />
                <Moon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${theme === 'dark' ? 'dark:rotate-0 dark:scale-100' : ''}`} />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedWidget || 'selector'}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div
                className={clsx(
                  "relative w-full max-w-4xl p-6 sm:p-12 bg-gradient-to-br from-cyan-700 to-blue-800 text-white rounded-2xl shadow-lg",
                  "before:content-[''] before:absolute before:-top-3 before:-left-3 before:w-full before:h-full before:bg-gradient-to-br from-cyan-400 to-blue-500 before:rounded-2xl before:blur-xl before:-z-10",
                  "hover:scale-105 transition-transform duration-300 ease-in-out"
                )}
              >
                {renderWidget()}
              </div>
            </motion.div>
          </AnimatePresence>
          {selectedWidget && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                onClick={() => setSelectedWidget(null)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Widget Selection
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
