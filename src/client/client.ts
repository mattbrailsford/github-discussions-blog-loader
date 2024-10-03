import { SEARCH_POSTS_QUERY } from "./graphql.ts";
import type { GitHubClientOptions, GitHubPostList, GitHubPost } from "../types.ts";
import { githubMapper } from "./mapper.ts";

const GITHUB_API_URL : string = 'https://api.github.com/graphql'

export function githubClient(options : GitHubClientOptions) {

    const getPosts = async  (limit = 50, after?: string, lastModified?: string): Promise<GitHubPostList>  => {

        // Build a query to search for blog post discussions
        // repo:... searches our specific repository
        // category:... limits the search to discussions with the blog post category
        // -label:... excludes discussions with the draft label
        // sort:updated-asc sorts the results by the updated date in ascending order (must be ascending to allow tracking of last modified date)
        // updated:>${lastModified} limits the search to discussions updated after the supplied lastModified date
        const query = `repo:${options.repo.owner}/${options.repo.name} sort:updated-asc ${options.mappings!.blogPostCategory ? `category:"${options.mappings!.blogPostCategory}"` : ''} ${options.mappings!.draftLabel ? `-label:"${options.mappings!.draftLabel}"` : ''} ${lastModified ? `updated:>${lastModified}` : ''}`
        
        const response = await fetch(GITHUB_API_URL,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.auth}`,
                'User-Agent': 'Astro'
            },
            body: JSON.stringify({
                query: SEARCH_POSTS_QUERY,
                variables: {
                    query,
                    limit,
                    after: after || null,
                },
            }),
        });
        
        const { data } = await response.json();

        const mapper = githubMapper(options.mappings!);
        
        return {
            posts: mapper.mapPosts(data ?? []),
            pageInfo: data?.search.pageInfo ?? {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
            }
        }

    }

    const getPostsRecursive = async(limit: number, after?: string, lastModified?:string): Promise<GitHubPost[]> => {
        const { posts, pageInfo } = await getPosts(limit, after, lastModified);
        if (pageInfo.hasNextPage) {
            return posts.concat(await getPostsRecursive(limit, pageInfo.endCursor, lastModified))
        }
        return posts;
    }

    return {
        getAllPosts: async (lastModified?: string): Promise<GitHubPost[]> => {
            return await getPostsRecursive(100, undefined, lastModified);
        }
    }
}



