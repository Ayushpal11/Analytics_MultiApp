import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/minicomp/dialog"
import { ScrollArea } from "@/components/minicomp/scroll-area"
import { Button } from "@/components/minicomp/button"
import { ExternalLink } from 'lucide-react'

interface ArticleModalProps {
  article: {
    title: string
    content: string
    url: string
    urlToImage: string
    source: { name: string }
    publishedAt: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{article.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          {article.urlToImage && (
            <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-md mb-4" />
          )}
          <p className="text-sm text-muted-foreground mb-2">
            Source: {article.source.name} | Published: {new Date(article.publishedAt).toLocaleString()}
          </p>
          <p className="text-foreground">{article.content}</p>
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button asChild>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
              Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

