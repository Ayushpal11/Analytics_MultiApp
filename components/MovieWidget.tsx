'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/minicomp/card"
import { Input } from "@/components/minicomp/input"
import { Button } from "@/components/minicomp/button"
import { ScrollArea } from "@/components/minicomp/scroll-area"
import { Film, Search, Star, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { debounce } from 'lodash'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  overview: string
}

export function MovieWidget() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [autocompleteResults, setAutocompleteResults] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTrendingMovies()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setAutocompleteResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchTrendingMovies = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${TMDB_API_BASE_URL}/trending/movie/week`, {
        params: { api_key: TMDB_API_KEY }
      })
      setTrendingMovies(response.data.results)
    } catch (err) {
      setError('Failed to fetch trending movies')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${TMDB_API_BASE_URL}/search/movie`, {
        params: { api_key: TMDB_API_KEY, query: searchQuery }
      })
      setSearchResults(response.data.results)
      setAutocompleteResults([])
    } catch (err) {
      setError('Failed to search movies')
    } finally {
      setLoading(false)
    }
  }

  const debouncedAutocomplete = debounce(async (query: string) => {
    if (query.length < 2) {
      setAutocompleteResults([])
      return
    }

    try {
      const response = await axios.get(`${TMDB_API_BASE_URL}/search/movie`, {
        params: { api_key: TMDB_API_KEY, query: query }
      })
      setAutocompleteResults(response.data.results.slice(0, 5))
    } catch (err) {
      console.error('Autocomplete error:', err)
    }
  }, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedAutocomplete(query)
  }

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie)
    setSearchQuery('')
    setAutocompleteResults([])
  }

  const renderMovieList = (movies: Movie[], title: string) => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => handleSelectMovie(movie)}
            >
              <img
                src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder.svg?height=300&width=200'}
                alt={movie.title}
                className="w-full h-auto rounded-md shadow-md"
              />
              <p className="text-sm mt-1 text-center truncate">{movie.title}</p>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <Card className="lg:bg-card lg:text-card-foreground lg:min-h-screen overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center text-3xl font-bold">
          <Film className="mr-2 text-primary" />
          Movie Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full  overflow-y-auto">
        <form onSubmit={handleSearch} className="flex pt-5 space-x-2 relative">
          <div className="flex-grow relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search for movies..."
              className="w-full"
            />
            {autocompleteResults.length > 0 && (
              <div ref={autocompleteRef} className="absolute z-10 w-full bg-background border border-input rounded-md mt-1 shadow-lg">
                {autocompleteResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => handleSelectMovie(movie)}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>

        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-center mt-4 text-destructive">{error}</p>}

        <AnimatePresence mode="wait">
          {selectedMovie ? (
            <motion.div
              key="movie-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Button
                variant="outline"
                onClick={() => setSelectedMovie(null)}
                className="mb-4"
              >
                Back to list
              </Button>
              <div className="flex flex-col md:flex-row">
                <img
                  src={selectedMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${selectedMovie.poster_path}` : '/placeholder.svg?height=450&width=300'}
                  alt={selectedMovie.title}
                  className="w-full md:w-1/3 rounded-md shadow-md mb-4 md:mb-0 md:mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
                  <p className="text-muted-foreground mb-2">
                    Release Date: {new Date(selectedMovie.release_date).toLocaleDateString()}
                  </p>
                  <div className="flex items-center mb-2">
                    <Star className="text-yellow-400 mr-1" />
                    <span>{selectedMovie.vote_average.toFixed(1)} / 10</span>
                  </div>
                  <p>{selectedMovie.overview}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="movie-lists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {searchResults.length > 0 && renderMovieList(searchResults, 'Search Results')}
              {renderMovieList(trendingMovies, 'Trending Movies')}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
