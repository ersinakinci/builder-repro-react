# Builder React SDK repro template

This template is intended for quickly spinning up a back end when creating reproduction cases for Builder React SDK bug reports.

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/nextjs-cmpuwo)

## Space structure

This project assumes a particular space structure, detailed below.

- Page models
  - `page`: Default page model
    - Preview URL: `${YOUR_DEV_URL}`
- Section models
  - `header`
    - Preview URL: `${YOUR_DEV_URL}`
  - `footer`
    - Preview URL: `${YOUR_DEV_URL}`
  - `project-template`: Templates for displaying content items from the `project` data model
    - Preview URL: Dynamic preview URL configured to point to `/__builder__/preview` or `/__builder__/preview-ssr` (see below)
  - `symbol`
    - Preview URL: Dynamic preview URL configured to point to `/__builder__/preview` or `/__builder__/preview-ssr` (see below)
- Data models
  - `project`
    - Preview URL: `${YOUR_DEV_URL}/projects`
    - Fields
      - `title` (`string`)
      - `description` (`string`)
      - `urlPath` (`url`)

## Project structure

- `pages/[[...page]].tsx`: Catch-all route for all `page` model content items.
- `pages/__builder__/preview.tsx`: Preview route for displaying a single content item in the Visual Editor. Intended for section models like `symbol`. Doesn't fetch content from the content API, all rendering happens client-side. Requires dynamic preview URL setup within Builder (see below).
- `pages/__builder__/preview-ssr.tsx`: Same as above, but also fetches content item data from Builder before rendering. Requires dynamic preview URL setup within Builder (see below).

## Setup

1. Add your Builder space's public key to `NEXT_PUBLIC_BUILDER_API_KEY` in `.env`. Note: `.env` will be checked into source control, so [don't store any secrets there](https://nextjs.org/docs/basic-features/environment-variables).
2. Create a private key within Builder for dynamic preview URLs (see below).
3. For any models using `/__builder__/preview` or `/__builder__/preview-ssr` as a preview URL path, setup a dynamic preview URL with the following code. Replace `YOUR_PRIVATE_KEY`, `YOUR_BASE_URL`, and `YOUR_PATH` with the appropriate values from Builder and your development server:

```
const privateKey = YOUR_PRIVATE_KEY;
const baseUrl = YOUR_BASE_URL;
const path = YOUR_PATH; // "/__builder__/preview" or "/__builder__/preview-ssr", depending on what you want to repro

const res = await fetch("https://cdn.builder.io/api/v2/admin", {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: "query ($modelId: String!) {\n  model(id: $modelId) {\n    name\n  }\n}\n",
        variables: { modelId: content.modelId },
    })
});
const data = await res.json();
const model = data.data.model.name;

return `${baseUrl}${path}?model=${model}&id=${content.id}`;
```

# Need Expert help with Builder?

[Submit a project to BuildQuick](https://www.buildquick.dev/) and be matched with a Builder expert.
