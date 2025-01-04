import { useState, useEffect } from 'react'
import { Input } from "@/components/minicomp/input"
import { Button } from "@/components/minicomp/button"
import { Loader2 } from 'lucide-react'
import axios from 'axios'

const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY

interface StockSearchProps {
  onSubmit: (symbol: string) => void
  isLoading: boolean
}

export function StockSearch({ onSubmit, isLoading }: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ symbol: string; name: string }[]>([])
  const [lastCallTime, setLastCallTime] = useState(0)
  const CALL_DELAY = 12000 // 12 seconds between calls (5 calls per minute)

  useEffect(() => {
    const fetchSuggestions = async () => {
      const now = Date.now()
      if (now - lastCallTime < CALL_DELAY) {
        console.log('Waiting to avoid rate limiting...')
        return
      }

      if (query.length > 1) {
        try {
          setLastCallTime(now)
          const response = await axios.get(`https://api.polygon.io/v3/reference/tickers?search=${query}&active=true&sort=ticker&order=asc&limit=10&apiKey=${POLYGON_API_KEY}`)
          const results = response.data.results || []
          setSuggestions(results.map((item: any) => ({
            symbol: item.ticker,
            name: item.name,
          })))
        } catch (error) {
          console.error('Error fetching suggestions:', error)
          setSuggestions([])
        }
      } else {
        setSuggestions([])
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [query, lastCallTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      onSubmit(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter stock symbol or company name"
          className="bg-background/50 border-input text-foreground placeholder-muted-foreground"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-background border border-input rounded-md mt-1">
            {suggestions.map((item) => (
              <li
                key={item.symbol}
                className="px-4 py-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  setQuery(item.symbol)
                  setSuggestions([])
                }}
              >
                <span className="font-bold">{item.symbol}</span> - {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? 'Fetching Data...' : 'Get Stock Data'}
      </Button>
    </form>
  )
}

