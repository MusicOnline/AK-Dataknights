# AK-Dataknights

**数据方舟 | データナイツ | 자료방주**

**Website: https://dataknights.pages.dev**

[![Deploy SSG to Cloudflare Pages](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-cfpages.yml/badge.svg)](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-cfpages.yml) [![Deploy SSG to GitHub Pages](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-ghpages.yml/badge.svg)](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-ghpages.yml)

Work-in-progress Arknights database made with [Nuxt](https://nuxt.com) for educational purposes. Features Mainland Chinese, English, Japanese and Korean game data and technical support for custom translations.

All Arknights content is the copyright of Hypergryph Network Technology Co. Ltd.

## Development

### Setup

Prerequisites:

- Node.js (developed & tested with version 20.8.0)
- pnpm

Clone the repository, then install the dependencies:

```bash
git clone https://github.com/MusicOnline/AK-Dataknights
pnpm install
```

### Configuration

Create a `.env` file with the following content or define the environment variables elsewhere:

```bash
# Clone https://github.com/Kengxxiao/ArknightsGameData to this path
# Game data is processed before being used to generate the website
GAME_DATA_ROOT_PATH=/path/to/ArknightsGameData

# Set to true if "pnpm run generate" should be prerendered to HTML
# Set to false to only render HTML using JS when browsed to (no SEO support)
# Alternatively, this can be set in nuxt.config.ts in ssr
ENABLE_SSR=true

# For generating static files for GitHub Pages deployment,
# repository pages are deployed to username.github.io/RespositoryNameHere
# Therefore this must be set to correct the routing base URL
# Alternatively, this can be set in nuxt.config.ts in app.baseURL
# Omit this variable if pages are deployed to the root URL
NUXT_APP_BASE_URL=RepositoryNameHere
```

### Development Server

Start the development server on http://localhost:3000

```bash
pnpm run dev
```

### Production

Serve with a Node.js Server:

```bash
pnpm run build
# Start server
node .output/server/index.mjs
```

Static hosting:

```bash
pnpm run generate
# Serve .output/public, example:
pnpm dlx serve .output/public
```

Locally preview production build:

```bash
pnpm run preview
```

### Continuous Deployment

The [`check-data-update`](./.github/workflows/check-data-update.yml) workflow checks for updates in the master branch of Kengxxiao/ArknightsGameData. If there is an update, [`.game-data-sha`](./data/.game-data-sha) is updated in this repository.

Any pushes to this repository will trigger Cloudflare Pages to build and deploy the website with its automatic deployments feature. [`deploy-cfpages`](./.github/workflows/deploy-cfpages.yml) is also triggered with GitHub Actions in case the Cloudflare build fails.

Additionally, any pushes to the main branch of this repository will trigger the [`deploy-ghpages`](./.github/workflows/deploy-ghpages.yml) workflow to deploy the website to GitHub Pages.

GitHub Pages Mirror: https://musiconline.github.io/AK-Dataknights/

Artifacts for both builds are available for download in their respective GitHub Actions pages.

## Special Thanks

In no particular order:

- [Kengxxiao](https://github.com/Kengxxiao) ([ArknightsGameData](https://github.com/Kengxxiao/ArknightsGameData))
- [Aceship](https://github.com/Aceship) ([Arknight-Images](https://github.com/Aceship/Arknight-Images))
