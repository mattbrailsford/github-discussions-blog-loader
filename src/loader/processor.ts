import type { LoaderContext } from "astro/loaders";
import type { GitHubPost, Post } from "../types.ts";
import slugify from "slugify";
import { readingTime } from "reading-time-estimator";
import { stripHtml } from "string-strip-html";

export function githubPostProcessor(renderMarkdown: LoaderContext['renderMarkdown']) {

    const truncate = (str: string, length: number, delimiter: string = '...') : string => {
        if (str.length <= length) return str;
        const lastSpace = str.slice(0, length - delimiter.length + 1).lastIndexOf(' ');
        return str.slice(0, lastSpace > 0 ? lastSpace : length - delimiter.length) + delimiter;
    }

    return {
        process: async (input: GitHubPost) : Promise<{
            post: Post,
            rendered: {
                html: string;
                metadata?: Record<string, unknown>;
            }
        }> => {
            const rendered = await renderMarkdown(input.body);
            const frontmatter = rendered.metadata?.frontmatter as Record<string, any> | undefined;
            const text = stripHtml(rendered.html).result;
            const post : Post = {
                ...input,
                slug: frontmatter?.slug ?? slugify(input.title, { lower: true }),
                description: frontmatter?.description ?? truncate(text, 150),
                body: rendered.html,
                published: frontmatter?.published ? new Date(frontmatter?.published) : input.created,
                readingTime: readingTime(text, { wordsPerMinute: 240 }).text
            };
            return { post, rendered };
        }
    }
}
