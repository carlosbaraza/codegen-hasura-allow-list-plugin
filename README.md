# codegen-hasura-allow-list-plugin
Generate the metadata file with the collection of allowed queries for hasura

# How to use
1. Copy the `codegen-hasura-allow-list-plugin.js` file to the root of your project.
2. Add a new generated file to `codegen.yml`
```yaml
overwrite: true
generates:
  hasura/metadata/query_collections.yaml:
    schema: 
      - http://localhost:9696/v1/graphql:
          headers:
            'X-Hasura-Admin-Secret': 'YOUR_LOCAL_SECRET'
    documents:
      - './components/**/*.tsx'
      - './components/**/*.graphql'
      - './pages/**/*.tsx'
      - '!./node_modules/*'
      - '!./**/*.generated.tsx'
    plugins:
      - codegen-hasura-allow-list-plugin.js
```
3. If allow-list is enabled in local dev environment (we prefer it to be closer to production). Run a watch script to upload hasura metadata to your local hasura when it changes: `"hasura:allow-list:watch": "onchange 'hasura/metadata/query_collections.yaml' -- npm run ci:metadata",`

# Example generated `hasura/metadata/query_collections.yaml`:
```yaml
- name: allowed-queries
  definition:
    queries:
      - name: Comments
        query: >+
          query Comments {
            comment {
              id
              comment
            }
          }
      - name: Users
        query: >+
          query Users {
            user {
              id
              username
            }
          }
```

# Features
- [x] all operations: query, mutation, subscription
- [x] multiple operations per document
  - [x] extract each operation from document and concatenate the rest of definitions in document to support fragments (for example)
