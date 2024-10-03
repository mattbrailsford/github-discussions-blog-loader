import type { AstroConfig, MarkdownHeading } from "astro";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { GitHubPost, Post } from "../types.ts";
import matter from "gray-matter";
import slugify from "slugify";
import { readingTime } from "reading-time-estimator";
import { stripHtml } from "string-strip-html";

export async function githubPostProcessor(config: AstroConfig) {
    
    const markdownProcessor = await createMarkdownProcessor(config.markdown);
    
    const truncate = (str: string, length: number, delimiter: string = '...') : string => {
        if (str.length <= length) return str;
        const lastSpace = str.slice(0, length - delimiter.length + 1).lastIndexOf(' ');
        return str.slice(0, lastSpace > 0 ? lastSpace : length - delimiter.length) + delimiter;
    }
    
    return {
        process: async (input: GitHubPost) : Promise<{ 
            post: Post,
            metadata:{
                headings: MarkdownHeading[];
                imagePaths: string[];
                frontmatter: Record<string, any>;
            } 
        }> => {
            const { data: frontmatter, content: markdownContent } = matter(input.body);
            const { code : html, metadata} = await markdownProcessor.render(markdownContent);
            const text = stripHtml(html).result;
            const post : Post = {
                ...input,
                slug: frontmatter?.slug ?? slugify(input.title, { lower: true }),
                description: frontmatter?.description ?? truncate(text, 150),
                body: html,
                published: new Date(frontmatter?.published ?? input.createdAt),
                readingTime: readingTime(text, 240).text,
            };
            return { post, metadata: { ...metadata, frontmatter, imagePaths: [...metadata.imagePaths] } };
        }
    }
}