import type { GitHubActor, GitHubCategory, GitHubMappings, GitHubPost, GitHubSeries } from "../types.ts";
import slugify from "slugify";

export function githubMapper(mappings: GitHubMappings) {
    
    const mapPosts = (data: any): GitHubPost[] => {
        return data.search.edges.map(mapPost);
    }

    const mapPost = ({ node } : { node: any }): GitHubPost => ({
        id: node.id,
        title: node.title,
        body: node.body,
        created: new Date(node.createdAt),
        updated: new Date(node.updatedAt),
        githubUrl: node.url,
        number: node.number,
        category: mapCategory(node.category),
        tags: mapTags(node.labels),
        series: mapSeries(node.labels),
        author: mapActor(node.author)
    });

    const mapCategory = (category: any) : GitHubCategory => ({
        id: slugify(category.name, { lower: true }),
        name: category.name
    });

    const mapTags = (labels: any): string[] => {
        return labels.edges.filter((x:any) => x.node.name.startsWith(mappings.tagLabelPrefix)).map((x:any) => slugify(x.node.name.replace(mappings.tagLabelPrefix, ''), { lower: true }));
    }

    const mapSeries = (labels: any): GitHubSeries => {
        const seriesNode = labels.edges.find((x:any) => x.node.name.startsWith(mappings.seriesLabelPrefix));
        return seriesNode && {
            id: slugify(seriesNode.node.name.replace(mappings.seriesLabelPrefix, '')),
            name: seriesNode.node.description
        }
    }
    
    const mapActor = (actor: any) : GitHubActor => ({
        avatarUrl: actor.avatarUrl,
        username: actor.login,
        url: actor.url
    })
    
    return { mapPosts, mapPost, mapTags, mapSeries, mapActor, mapCategory };
}

