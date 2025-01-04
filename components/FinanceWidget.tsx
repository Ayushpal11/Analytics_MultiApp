'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/minicomp/card"
import { Button } from "@/components/minicomp/button"
import { AnimatedNumber } from './minicomp/animated-number'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import axios from 'axios'
import { Autocomplete, TextField } from '@mui/material'
import { VictoryChart, VictoryCandlestick, VictoryTheme, VictoryAxis, VictoryTooltip, VictoryZoomContainer } from 'victory'

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY

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
  historicalData: { date: string; open: number; high: number; low: number; close: number }[]
}

const predefinedTimeRanges = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL']

export function FinanceWidget() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [timeRange, setTimeRange] = useState('1M')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([])

  const fetchStockData = async (symbol: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query`,
        {
          params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol,
            interval: '5min',
            outputsize: 'compact', // Use 'full' for extended history
            apikey: ALPHA_VANTAGE_API_KEY,
          },
        }
      )

      const data = response.data['Time Series (5min)']
      if (!data) throw new Error('No data returned from API')

      const historicalData = Object.entries(data).map(([date, values]: [string, any]) => ({
        date: new Date(date),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
      }))

      const latestEntry = historicalData[0]
      setStockData({
        symbol,
        price: latestEntry.close,
        change: latestEntry.close - latestEntry.open,
        changePercent: ((latestEntry.close - latestEntry.open) / latestEntry.open) * 100,
        high: latestEntry.high,
        low: latestEntry.low,
        open: latestEntry.open,
        previousClose: historicalData[1]?.close || latestEntry.open,
        volume: 0, // Volume not available in this endpoint
        historicalData,
      })
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAutocompleteSuggestions = async (query: string) => {
    const predefinedStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'IBM', 'TSLA']
    setAutocompleteOptions(predefinedStocks.filter(stock => stock.toLowerCase().includes(query.toLowerCase())))
  }

  const getTimeRangeData = () => {
    if (!stockData) return []
    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case '1D':
        startDate.setDate(now.getDate() - 1)
        break
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
    <Card className="bg-cyan-900 text-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-3xl font-bold">
          <DollarSign className="mr-2 text-cyan-400" />
          Stock Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Autocomplete
          freeSolo
          options={autocompleteOptions}
          onInputChange={(event, value) => {
            setSearchValue(value)
            fetchAutocompleteSuggestions(value)
          }}
          onChange={(event, value) => value && fetchStockData(value)}
          renderInput={(params) => <TextField {...params} label="Search Stock" />}
        />

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {stockData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 space-y-4"
          >
            <h3 className="text-3xl font-semibold text-cyan-400">{stockData.symbol}</h3>
            <div className="flex items-center text-2xl text-blue-50">
              <DollarSign className="mr-2 text-cyan-400" />
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
            <div className="flex space-x-2 text-cyan-300">
              {predefinedTimeRanges.map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  className="text-cyan-300 hover:text-cyan-100"
                >
                  {range}
                </Button>
              ))}
            </div>
            <div className="mt-7 w-full h-70">
              <VictoryChart
                theme={VictoryTheme.material}
                scale={{ x: 'time', y: 'linear' }}
                containerComponent={<VictoryZoomContainer zoomDimension="x" />}
              >
                <VictoryAxis tickFormat={(t) => new Date(t).toLocaleDateString()} style={{ tickLabels: { fill: 'white' } }} />
                <VictoryAxis dependentAxis style={{ tickLabels: { fill: 'white' } }} />
                <VictoryCandlestick
                  data={getTimeRangeData()}
                  x="date"
                  open="open"
                  close="close"
                  high="high"
                  low="low"
                  labels={({ datum }) => `Close: ${datum.close}`}
                  labelComponent={<VictoryTooltip />}
                  style={{
                    data: { stroke: 'cyan', fill: 'cyan' },
                  }}
                />
              </VictoryChart>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
