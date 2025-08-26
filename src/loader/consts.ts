import type { GitHubMappings } from "../types.ts";

export const DEFAULT_MAPPINGS : GitHubMappings = {
    blogPostCategory: undefined, // Load all categories
    draftLabel: "state/draft",
    ignoreLabels: undefined,
    tagLabelPrefix: "tag/",
    seriesLabelPrefix: "series/"
}