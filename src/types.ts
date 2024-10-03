export type GitHubDiscussionsLoaderOptions = GitHubClientOptions & {
    incremental?: boolean
}

export type GitHubClientOptions = {
    auth: string
    repo: GitHubRepository
    mappings?: GitHubMappings
}

export type GitHubRepository = {
    name: string
    owner: string
}

export type GitHubMappings = {
    blogPostCategory?: string
    draftLabel?: string
    tagLabelPrefix: string
    seriesLabelPrefix: string
}

export type GitHubPost = Record<string, unknown> & {
    id: string
    title: string
    body: string
    created: Date
    updated: Date
    category: GitHubCategory
    tags: string[]
    series?: GitHubSeries
    author: GitHubActor
    githubUrl: string
    githubDiscussionId: string
    githubDiscussionNumber: number
}

export type GitHubPostList = {
    posts: GitHubPost[]
    pageInfo: GitHubPageInfo
}

export type GitHubPageInfo = {
    startCursor: string
    hasNextPage: boolean
    endCursor: string
}

export type GitHubCategory = {
    id: string
    name: string
}

export type GitHubSeries = {
    id: string
    name: string
}

export type GitHubActor = {
    avatarUrl: string
    username: string
    url: string
}

export type Category = GitHubCategory
export type Series = GitHubSeries
export type Actor = GitHubActor
export type Post = GitHubPost & {
    slug: string
    description?: string
    readingTime: string
    published: Date
    category?: Category
    series?: Series
    author: Actor
}