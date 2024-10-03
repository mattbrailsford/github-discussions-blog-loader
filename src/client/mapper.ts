import type { GitHubActor, GitHubMappings, GitHubPost, GitHubPostSeries } from "../types.ts";

export function githubMapper(mappings: GitHubMappings) {
    
    const mapPosts = (data: any): GitHubPost[] => {
        return data.search.edges.map(mapPost);
    }

    const mapPost = ({ node } : { node: any }): GitHubPost => {
        return {
            id: node.id,
            title: node.title,
            body: node.body,
            created: new Date(node.createdAt),
            updated: new Date(node.updatedAt),
            githubUrl: node.url,
            number: node.number,
            tags: mapTags(node.labels),
            series: mapSeries(node.labels),
            author: mapActor(node.author)
        };
    }

    const mapTags = (labels: any): string[] => {
        return labels.edges.filter((x:any) => x.node.name.startsWith(mappings.tagLabelPrefix)).map((x:any) => x.node.name.replace(mappings.tagLabelPrefix, ''));
    }

    const mapSeries = (labels: any): GitHubPostSeries => {
        const seriesNode = labels.edges.find((x:any) => x.node.name.startsWith(mappings.seriesLabelPrefix));
        return seriesNode && {
            id: seriesNode.node.name.replace(mappings.seriesLabelPrefix, ''),
            name: seriesNode.node.description
        }
    }
    
    const mapActor = (actor: any) : GitHubActor => {
        return {
            avatarUrl: actor.avatarUrl,
            username: actor.login,
            url: actor.url
        }
    }
    
    return { mapPosts, mapPost, mapTags, mapSeries, mapActor };
}

