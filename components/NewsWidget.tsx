'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/minicomp/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/minicomp/select"
import { Button } from "@/components/minicomp/button"
import { Newspaper, ChevronDown } from 'lucide-react'
import axios from 'axios'
import { ArticleModal } from './ArticleModal'

interface Article {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
  source: { name: string }
}

export function NewsWidget() {
  const [category, setCategory] = useState('general')
  const [news, setNews] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const itemsPerPage = 5

  const API_KEY = process.env.NEXT_PUBLIC_NEWSAPI_API_KEY
  const BASE_URL = 'https://newsapi.org/v2/top-headlines'

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          category,
          country: 'us',
          pageSize: 100,
          apiKey: API_KEY,
        },
      })
      const validArticles = response.data.articles.filter(
        (article: Article) => !article.title.includes('[Removed]')
      );

      setNews(validArticles);
      setPage(1)
    } catch (error) {
      setError('Failed to fetch news. Please try again later.')
      console.error('News fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [category])

  const displayedNews = news.slice(0, page * itemsPerPage)

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex items-center text-3xl font-bold">
          <Newspaper className="mr-2 text-primary" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="bg-background border-input text-foreground mb-4">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
          </SelectContent>
        </Select>
        {loading && <p className="text-center text-muted-foreground">Loading...</p>}
        {error && <p className="text-center text-destructive">{error}</p>}
        <AnimatePresence>
          {displayedNews.map((article, index) => (
            <motion.div
              key={`${article.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="mt-4 cursor-pointer hover:bg-accent transition-colors duration-300"
                onClick={() => setSelectedArticle(article)}
              >
                <CardContent className="flex flex-col sm:flex-row items-start sm:p-4">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
                    />
                  )}
                  <div className="flex flex-col sm:flex-1">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Source: {article.source.name} | Published: {new Date(article.publishedAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {news.length > page * itemsPerPage && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              className="flex items-center mx-auto"
            >
              Load More <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </Card>
  )
}
