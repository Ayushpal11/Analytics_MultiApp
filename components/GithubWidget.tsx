'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/minicomp/card"
import { Button } from "@/components/minicomp/button"
import { Input } from "@/components/minicomp/input"
import { Loader2, GitBranch, Star, Eye, Users } from 'lucide-react'
import { formatDate } from '../utils/formatDate'

interface Commit {
    sha: string
    commit: {
        author: {
            name: string
            date: string
        }
        message: string
    }
}

interface Contributor {
    login: string
    avatar_url: string
    contributions: number
}

interface RepoStats {
    name: string
    description: string
    stars: number
    forks: number
    watchers: number
    commits: Commit[]
    contributors: Contributor[]
}

export function GitHubWidget() {
    const [repoUrl, setRepoUrl] = useState('')
    const [repoStats, setRepoStats] = useState<RepoStats | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchRepoStats = async (owner: string, repo: string) => {
        setLoading(true)
        setError('')

        try {
            const [repoResponse, commitsResponse, contributorsResponse] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`)
            ])

            if (!repoResponse.ok || !commitsResponse.ok || !contributorsResponse.ok) {
                throw new Error('Failed to fetch repository data')
            }

            const repoData = await repoResponse.json()
            const commitsData = await commitsResponse.json()
            const contributorsData = await contributorsResponse.json()

            setRepoStats({
                name: repoData.name,
                description: repoData.description,
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                watchers: repoData.watchers_count,
                commits: commitsData,
                contributors: contributorsData
            })
        } catch (err) {
            console.error('Error fetching repo stats:', err)
            setError('Failed to fetch repository data. Please check the URL and try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
        if (match) {
            const [, owner, repo] = match
            fetchRepoStats(owner, repo)
        } else {
            setError('Invalid GitHub repository URL')
        }
    }

    return (
        <Card className="bg-cyan-900 text-blue-50">
            <CardHeader>
                <CardTitle className="flex items-center text-3xl font-bold">
                    <GitBranch className="mr-2 text-cyan-400" />
                    GitHub Repository Stats
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
                    <Input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="Enter GitHub repository URL"
                        className="flex-grow text-gray-500"
                    />
                    <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Fetch'}
                    </Button>
                </form>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {repoStats && (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold">{repoStats.name}</h3>
                        <p className="text-muted-foreground">{repoStats.description}</p>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <Star className="mr-1 text-yellow-500" />
                                <span>{repoStats.stars}</span>
                            </div>
                            <div className="flex items-center">
                                <GitBranch className="mr-1 text-green-500" />
                                <span>{repoStats.forks}</span>
                            </div>
                            <div className="flex items-center">
                                <Eye className="mr-1 text-blue-500" />
                                <span>{repoStats.watchers}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold mb-2">Recent Commits</h4>
                            <ul className="space-y-2">
                                {repoStats.commits.map((commit) => (
                                    <li key={commit.sha} className="border-b border-border pb-2">
                                        <p className="font-medium">{commit.commit.message}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {commit.commit.author.name} on {formatDate(commit.commit.author.date)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold mb-2">Top Contributors</h4>
                            <ul className="flex flex-wrap gap-4">
                                {repoStats.contributors.map((contributor) => (
                                    <li key={contributor.login} className="flex items-center space-x-2">
                                        <img src={contributor.avatar_url} alt={contributor.login} className="w-8 h-8 rounded-full" />
                                        <span>{contributor.login}</span>
                                        <span className="text-muted-foreground">({contributor.contributions})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
