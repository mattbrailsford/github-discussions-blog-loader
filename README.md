# GitHub Discussions Blog Loader

This package provides a GitHub Discussions loader for Astro, allowing you to use [GitHub Discussions as a blog engine](https://mattbrailsford.dev/building-a-github-discussions-powered-blog).

## Installation

```sh
npm install github-discussions-blog-loader
```

## Usage

This package requires Astro 4.14.0 or later. You must enable the experimental content layer in Astro unless you are using version 5.0.0-beta or later. You can do this by adding the following to your `astro.config.mjs`:

```javascript
export default defineConfig({
  // ...
  experimental: {
    contentLayer: true,
  },
});
```

You can then use the feed loader in your content configuration at `src/content/config.ts`:

```typescript
import { defineCollection } from "astro:content";
import { githubDiscussionsBlogLoader } from "github-discussions-blog-loader";

const blogPosts = defineCollection({
  loader: githubDiscussionsBlogLoader({
      auth: GITHUB_ACCESS_TOKEN,
      repo: {
          name: GITHUB_REPO_NAME,
          owner: GITHUB_REPO_OWNER,
      },
  })
});

export const collections = { blogPosts };
```
You can then use these like any other content collection in Astro:

```astro
---
import type { GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import type { Post } from "github-discussions-blog-loader";
import Layout from "../../layouts/Layout.astro";

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPosts = await getCollection("blogPosts");
  return customers.map((blogPost) => ({
    params: {
      slug: blogPost.id,
    },
    props: { post: blogPost.data },
  }));
};

type Props = { post: Post };

const { post } = Astro.props;
---

<Layout title={post.title}>
  <h1>{post.title}</h1>
  <div set:html={post.body}></div>
</Layout>

```

## Options

The `githubDiscussionsBlogLoader` function takes an options object with the following properties:

- `auth`: A [GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with permissions to access discussions.
- `repo`: Details of the GitHub repository to connect to.
- `repo.name`: The name of the repository.
- `repo.owner`: The owner of the repository.
- `incremental`: If `true`, the loader will only fetch new/updated discussions since the last build. Otherwise the loader will fetch all blog posts on every build. The default is `false`.
- `mappings`: Details of the how to map the GitHub Discussions data to the blog post data. 
- `mappings.blogPostCategory`: The GitHub Discussions category used to define blog posts. The default it `"Blog Post"`.
- `mappings.draftLabel`: The GitHub Discussions label that defines a blog post as draft and so will be excluded from the loaders results. The default is `"state/draft"`.
- `mappings.tagLabelPrefix`: A prefix that identifies a GitHub Discussions label as a tag. The default is `"tag/"`.
- `mappings.seriesLabelPrefix`: A prefix that identifies a GitHub Discussions label as a series container. The default is `"series/"`.

The default mapping options are available via a `DEFAULT_MAPPINGS` export and so you can override just the properties you need to change using the spread operator:

```typescript
// src/content/config.ts
import { defineCollection } from "astro:content";
import { githubDiscussionsBlogLoader, DEFAULT_MAPPINGS } from "github-discussions-blog-loader";

const blogPosts = defineCollection({
  loader: githubDiscussionsBlogLoader({
      auth: GITHUB_ACCESS_TOKEN,
      repo: {
          name: GITHUB_REPO_NAME,
          owner: GITHUB_REPO_OWNER,
      },
      mappings: {
          ...DEFAULT_MAPPINGS,
          blogPostCategory: "Article",
      }
  })
});

export const collections = { blogPosts };
```

## Post Data
The loader will return an array of `Post` objects, each with the following data structure:

```text
{
  id: string,
  slug: string
  title: string
  description?: string
  body: string
  created: Date
  updated: Date
  published: Date
  readingTime: string
  githubUrl: string
  number: number
  tags: string[]
  series?: {
    id: string
    name: string
  }
  author: {
    avatarUrl: string
    username: string
    url: string
  }
}
```