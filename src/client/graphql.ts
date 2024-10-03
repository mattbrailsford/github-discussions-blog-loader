export const SEARCH_POSTS_QUERY : string = `
  query ($query: String!, $limit: Int!, $after: String) {
    search(query: $query, type: DISCUSSION, first: $limit, after: $after) {
      pageInfo {
        startCursor
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ... on Discussion {
            id
            url
            number
            title
            body
            createdAt
            updatedAt
            author {
              avatarUrl
              login
              url
            }
            labels(first: 10) {
              edges {
                node {
                  id
                  name
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`