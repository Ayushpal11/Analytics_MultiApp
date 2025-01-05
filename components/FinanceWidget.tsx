'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/minicomp/card"
import { Button } from "@/components/minicomp/button"
import { AnimatedNumber } from './minicomp/animated-number'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import axios from 'axios'
import { StockSearch } from './StockSearch'

const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  volume: number
  historicalData: { date: string; price: number }[]
}

export function FinanceWidget() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [timeRange, setTimeRange] = useState('1M')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchStockData = async (symbol: string) => {
    setLoading(true)
    setError('')

    try {
      const [quoteResponse, aggregatesResponse] = await Promise.all([
        axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`),
        axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2022-01-01/${new Date().toISOString().split('T')[0]}?adjusted=true&sort=asc&limit=50000&apiKey=${POLYGON_API_KEY}`)
      ])

      const quote = quoteResponse.data.results?.[0] ?? {}
      const historicalData = (aggregatesResponse.data.results ?? []).map((item: any) => ({
        date: new Date(item.t).toISOString().split('T')[0],
        price: item.c,
      }))

      setStockData({
        symbol: symbol,
        price: quote.c ?? 0,
        change: (quote.c ?? 0) - (quote.o ?? 0),
        changePercent: ((quote.c ?? 0) - (quote.o ?? 0)) / (quote.o ?? 1) * 100,
        high: quote.h ?? 0,
        low: quote.l ?? 0,
        open: quote.o ?? 0,
        previousClose: quote.pc ?? 0,
        volume: quote.v ?? 0,
        historicalData,
      })
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTimeRangeData = () => {
    if (!stockData) return []
    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case '1W':
        startDate.setDate(now.getDate() - 7)
        break
      case '1M':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3M':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6M':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'ALL':
        return stockData.historicalData
    }

    return stockData.historicalData.filter(item => new Date(item.date) >= startDate)
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex items-center text-3xl font-bold">
          <DollarSign className="mr-2 text-primary" />
          Stock Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StockSearch onSubmit={fetchStockData} isLoading={loading} />

        {error && <p className="text-destructive mt-4">{error}</p>}

        {stockData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 space-y-4"
          >
            <h3 className="text-3xl font-semibold">{stockData.symbol}</h3>
            <div className="flex items-center text-2xl">
              <DollarSign className="mr-2 text-primary" />
              <AnimatedNumber value={stockData?.price ?? 0} />
            </div>
            <div className="flex items-center text-xl">
              {stockData.change >= 0 ? (
                <TrendingUp className="mr-2 text-green-500" />
              ) : (
                <TrendingDown className="mr-2 text-red-500" />
              )}
              <AnimatedNumber value={stockData?.change ?? 0} />
              (<AnimatedNumber value={stockData?.changePercent ?? 0} />%)
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Open: ${stockData?.open?.toFixed(2) ?? 'N/A'}</div>
              <div>Previous Close: ${stockData?.previousClose?.toFixed(2) ?? 'N/A'}</div>
              <div>High: ${stockData?.high?.toFixed(2) ?? 'N/A'}</div>
              <div>Low: ${stockData?.low?.toFixed(2) ?? 'N/A'}</div>
              <div>Volume: {stockData?.volume?.toLocaleString() ?? 'N/A'}</div>
            </div>
            <div className="flex space-x-2">
              {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                >
                  {range}
                </Button>
              ))}
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getTimeRangeData()}>
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis
                    stroke="currentColor"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--popover-foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <ReferenceLine y={stockData?.previousClose ?? 0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
