# Builder React SDK repro template

This template is intended for quickly spinning up reproduction cases when you encounter a bug or some unexpected behavior while working with [Builder](https://builder.io/) and their [React SDK](https://github.com/builderio/builder/tree/main/packages/react).

The idea is to use the template as a starting point and add modifications to demonstrate your specific bug. You can then share your modifications with Builder's team, [the Builder community](https://forum.builder.io/), or [a BuildQuick expert](https://www.buildquick.dev/) to get help.

## Structure

The template has everything you need for a semi-complex, realistic demo:

- Next.js back end with pages and utility functions, ready to be deployed
- Builder content (`/builder-space`), ready to be cloned into a new space within your Builder organization [using Builder's CLI tool](https://github.com/BuilderIO/builder/tree/main/packages/cli)

For more details, see the _Project structure_ section below.

## Workflow

- Set up your development environment.
  - The back end can be spun up on any server you like. I recommend [forking this project on StackBlitz](https://stackblitz.com/edit/nextjs-cmpuwo) and running it within the browser. That way, you can easily share modifications to your back end with Builder's team with a single, live URL and without having to create a new repo to store your modifications.
  - If you use a local development environment, you can click "Use this template" to create your own repo with the same contents. Then clone your new repo to your environment so that you can commit and share any modifications to the source code.
  - Forking this repo is only recommended if you intend to contribute changes to the template.
- Clone Builder content to a new space within your organization.
- Make any modifications to the Builder content in your space and/or the back end to demonstrate your bug.
- Share your repro case, including links to your back end and your space, with Builder's team.
  - Anyone can [post a bug report on Builder's forums](https://forum.builder.io/c/bugs). Responses from Builder's team are viewable by the community and help improve the Builder experience for everyone!
  - Current Builder customers can email support@builder.io.
  - If you're a highly technical user who's certain that there's a bug in the SDK itself and you've thoroughly diagnosed the issue within the SDK's codebase, you can [file a bug report in Builder's open source repo](https://github.com/BuilderIO/builder/issues).
  - Totally stumped by a hard problem? [Consider submitting the issue as a project request to BuildQuick](https://www.buildquick.dev/), Builder's official development partner.

## Requirements

- A Builder account
- A private key [for your Builder organization](https://www.builder.io/c/docs/managing-organizations#:~:text=Add%20or%20change%20your%20private%20key) (**NOTE**: this isn't the same thing as your space's public key, nor a space's private write API key)

## Detailed setup instructions

1. Clone this repo into your development environment. I recommend [forking on StackBlitz](https://stackblitz.com/edit/nextjs-cmpuwo), which will give you a development environment along with all the code from this repo.
2. Prepare your development environment: `npm install`
3. Clone the template's Builder space into a new space within your Builder organization using [Builder's CLI tool](https://github.com/BuilderIO/builder/tree/main/packages/cli):

```
npm install -g @builder.io/cli
builder create -k YOUR_BUILDER_ORG_PRIVATE_KEY -i ./builder-space -n "My repro space" -d
```

**NOTE**: Builder's CLI tool is sometimes buggy when cloning content into a new space. You may see an error like:

```
FetchError: invalid json response body at https://cdn.builder.io/api/v2/admin reason: Unexpected token < in JSON at position 1
```

If you see this error or a similar one, keep executing the clone command until you get a success message:

```
Your new space "My repro space" public API Key: xxxxxxx
```

Once you've successfully created your new space, manually delete any partially-populated spaces that may have been created.

4. Add your new Builder space's public key to `NEXT_PUBLIC_BUILDER_API_KEY` in `.env`. **NOTE**: `.env` will be checked into source control, so [don't store any secrets there](https://nextjs.org/docs/basic-features/environment-variables).
5. Create a private key for your new Builder space for dynamic preview URLs (see below). **NOTE**: this private key is not the same as your organization's private key which you used to clone the Builder content into your new space.
6. For any models using `/__builder__/preview` or `/__builder__/preview-ssr` as a preview URL path (`project-template` and `symbol`), set up a dynamic preview URL with the following code. Replace `YOUR_PRIVATE_SPACE_KEY`, `YOUR_BASE_URL`, and `YOUR_PATH` with the appropriate values from Builder and your development server:

```javascript
// Dynamic preview URL code for symbol and project-template models
// Add this code to your model settings page.

// NOTE: private write API key for your space, not your organization
const privateKey = YOUR_PRIVATE_SPACE_KEY;
const baseUrl = YOUR_BASE_URL;
// "/__builder__/preview" or "/__builder__/preview-ssr", depending on what you want to repro
const path = YOUR_PATH;

// This admin API query fetches the model name for a given model ID.
// We need the model name when fetching and rendering Builder content,
// but the preview URL only has access to the model ID.
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

// The preview page will use the model name (and optionally the content
// item ID) to render a preview of the content.
return `${baseUrl}${path}?model=${model}&id=${content.id}`;
```

7. For all other models, set the preview URL according to the _Space structure_ section below.
8. Start the dev server if it isn't already running: `npm run dev:debug`
9. Visit the root URL on your dev server. If you see a home page with a header and footer, everything's good!

# Project structure

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

## Back end structure

- `pages`
  - `[[...page]].tsx`: Catch-all route for all `page` model content items.
  - `__builder__`
    - `preview.tsx`: Preview route for displaying a single content item in the Visual Editor. Intended for section models like `symbol`. Doesn't fetch content from the content API, all rendering happens client-side. Requires dynamic preview URL setup within Builder (see below).
    - `preview-ssr.tsx`: Same as above, but also fetches content item data from Builder before rendering. Requires dynamic preview URL setup within Builder (see below).
  - `projects`
    - `[project].tsx`: Route for all `project` model content items. Renders content using `project-template`.

# Need Expert help with Builder?

[Submit a project to BuildQuick](https://www.buildquick.dev/) and be matched with a Builder expert.
