# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Astro content loader that fetches blog posts from GitHub Discussions via the GraphQL API. Published as an npm package (`github-discussions-blog-loader`) for use in Astro 5+ projects.

## Commands

- **Build:** `npm run build` (runs `tsc --build`)
- **Watch:** `npm run build:watch`
- **Pack:** `npm run pack` (outputs to `./artifacts/`)

There are no tests or linting configured.

## Architecture

The package exports a single Astro `Loader` from `index.ts` which re-exports from `src/loader/loader.ts`.

### Data Flow

1. **`loader.ts`** — Entry point implementing Astro's `Loader` interface. Handles incremental loading via `last-modified` metadata, defines the Zod schema for the content collection, and orchestrates the pipeline.
2. **`client/client.ts`** — Builds GitHub GraphQL search queries with label-based filtering and pagination. Recursively fetches all matching discussions.
3. **`client/graphql.ts`** — Contains the raw GraphQL query string for searching discussions.
4. **`client/mapper.ts`** — Maps raw GraphQL response nodes to `GitHubPost` objects. Extracts tags/series from discussion labels using configurable prefixes (`tag/`, `series/`).
5. **`loader/processor.ts`** — Processes each `GitHubPost` into a final `Post`: parses frontmatter from the discussion body via `gray-matter`, renders markdown to HTML using Astro's markdown processor, generates slug/description/readingTime.
6. **`loader/consts.ts`** — Default mapping configuration.
7. **`types.ts`** — All TypeScript types. `GitHubPost` is the raw fetched shape; `Post` extends it with derived fields (slug, description, readingTime, published).

### Key Conventions

- GitHub Discussion labels drive blog metadata: labels with `tag/` prefix become tags, `series/` prefix defines series membership, and configurable labels are used for filtering (draft/ignore).
- Frontmatter in discussion body (parsed by `gray-matter`) can override slug, description, and published date.
- The `incremental` option tracks `last-modified` timestamps to only fetch updated discussions on subsequent builds.
