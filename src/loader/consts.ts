import type { GitHubMappings } from "../types.ts";

export const DEFAULT_MAPPINGS : GitHubMappings = {
    blogPostCategory: undefined, // Load all categories
    draftLabel: "state/draft",
    tagLabelPrefix: "tag/",
    seriesLabelPrefix: "series/"
}