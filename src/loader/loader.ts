import type { Loader } from 'astro/loaders';
import { githubClient } from "../client/client.ts";
import type { GitHubDiscussionsLoaderOptions, GitHubMappings } from "../types.ts";
import { githubPostProcessor } from "./processor.ts";
import { z } from 'astro/zod';
import { DEFAULT_MAPPINGS } from "./consts.ts";

export function githubDiscussionsBlogLoader({
    auth, 
    repo, 
    incremental = false,
    mappings = DEFAULT_MAPPINGS
} : GitHubDiscussionsLoaderOptions): Loader {
    return {
        name: "github-discussions-blog-loader",
        load: async ({ store, parseData, generateDigest, meta, config, logger }): Promise<void> => {

            let lastModified = meta.get('last-modified');
            if (incremental) {
                logger.info(`Last Modified: ${lastModified}`);
            }
            
            const client = githubClient({ auth, repo, mappings });
            const posts = await client.getAllPosts(incremental ? lastModified : undefined);
            
            logger.info(`Processing ${posts.length} blog posts`);
            
            let maxUpdatedDate: Date = new Date(lastModified ?? 0);
            
            if (!incremental) {
                store.clear();
            }

            const processor = await githubPostProcessor(config);
            
            for (const item of posts) {

                const { post, metadata } = await processor.process(item);
                
                const data = await parseData({
                    id: item.id,
                    data: post,
                });
                
                const digest = generateDigest(data);
                
                store.set({
                    id: post.id,
                    data,
                    rendered: {
                        html: post.body,
                        metadata,
                    },
                    digest
                });
                
                if (item.updated > maxUpdatedDate) {
                    maxUpdatedDate = item.updated;
                }
            }

            if (incremental)  {
                meta.set('last-modified', maxUpdatedDate.toISOString());
                logger.info(`New Last Modified: ${meta.get('last-modified')}`);
            }
        },
        schema: () => z.object({
            id: z.string(),
            slug: z.string(),
            title: z.string(),
            description: z.string().optional(),
            body: z.string(),
            created: z.date(),
            updated: z.date(),
            published: z.date(),
            readingTime: z.string(),
            category: z.object({
                id: z.string(),
                name: z.string(),
            }),
            tags: z.array(z.string()),
            series: z.object({
                id: z.string(),
                name: z.string(),
            }).optional(),
            author: z.object({
                avatarUrl: z.string(),
                username: z.string(),
                url: z.string(),
            }),
            githubUrl: z.string(),
            githubDiscussionId: z.string(),
            githubDiscussionNumber: z.number(),
        })
    };
}