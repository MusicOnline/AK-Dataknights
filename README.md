# AK-Dataknights

**数据方舟 | データナイツ | 자료방주**

**Website: https://dataknights.pages.dev**

[![Deploy SSG to Cloudflare Pages](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-cfpages.yml/badge.svg)](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-cfpages.yml) [![Deploy SSG to GitHub Pages](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-ghpages.yml/badge.svg)](https://github.com/MusicOnline/AK-Dataknights/actions/workflows/deploy-ghpages.yml)

Work-in-progress Arknights database made with [Nuxt](https://nuxt.com) for educational purposes. Features Mainland Chinese, English, Japanese and Korean game data and technical support for custom translations (English only for now).

All Arknights content is the copyright of Hypergryph Network Technology Co. Ltd.

## Development

### Setup

Prerequisites:

- Node.js (developed with version 18)

Clone the repository, then install the dependencies:

```bash
git clone https://github.com/MusicOnline/AK-Dataknights
npm install
```

### Configuration

Create a `.env` file with the following content or define the environment variables elsewhere:

```bash
# Clone https://github.com/Kengxxiao/ArknightsGameData to this path
# Game data is processed before being used to generate the website
GAME_DATA_ROOT_PATH=/path/to/ArknightsGameData

# Set to true if "npm run generate" should be prerendered
# Alternatively, this can be set in nuxt.config.ts in ssr
ENABLE_SSR=true

# For generating SSG for GitHub Pages deployment,
# repository pages are deployed to username.github.io/RespositoryNameHere
# Therefore this must be set to correct routing base URL
# Alternatively, this can be set in nuxt.config.ts in app.baseURL
# Omit this variable if pages are deployed to the root URL
NUXT_APP_BASE_URL=RepositoryNameHere
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

### Production

Server-Side Rendering (SSR):

```bash
npm run build
# Start server
node .output/server/index.mjs
```

Static Site Generation (SSG):

```bash
npm run generate
# Serve .output/public, example:
npx http-server .output/public
```

Locally preview production build:

```bash
npm run preview
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
