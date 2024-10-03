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
    githubUrl: string
    number: number
    tags: string[]
    series?: GitHubPostSeries
    author: GitHubActor
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

export type GitHubPostSeries = {
    id: string
    name: string
}

export type GitHubActor = {
    avatarUrl: string
    username: string
    url: string
}

export type PostSeries = GitHubPostSeries
export type PostActor = GitHubActor
export type Post = GitHubPost & {
    slug: string
    description?: string
    readingTime: string
    published: Date
    series?: PostSeries
    author: PostActor
}