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
- pnpm (or convert the lockfile/commands yourself)

Clone the repository, then install the dependencies:

```bash
git clone https://github.com/MusicOnline/AK-Dataknights
pnpm install
# After cloning game data and preparing .env file as in the Configuration section
pnpm prepare-nuxt
```

### Configuration

Create a `.env` file with the following content or define the environment variables elsewhere:

```bash
# Clone https://github.com/Kengxxiao/ArknightsGameData to this path
# Game data is processed before being used to generate the website
CN_GAME_DATA_ROOT_PATH=/path/to/ArknightsGameData

# Clone https://github.com/Kengxxiao/ArknightsGameData_YoStar to this path
YOSTAR_GAME_DATA_ROOT_PATH=/path/to/ArknightsGameData_YoStar

# Set to true if "pnpm generate" should be prerendered to HTML
# Set to false to only render HTML using JS when browsed to (no SEO support)
# Alternatively, this can be set in nuxt.config.ts in ssr
ENABLE_SSR=true

# For generating static files for GitHub Pages deployment,
# repository pages are deployed to username.github.io/RespositoryNameHere
# Therefore this must be set to correct the routing base URL
# Alternatively, this can be set in nuxt.config.ts in app.baseURL
# Omit this variable if pages are deployed to the root URL
# Remember to add the leading and trailing slash
NUXT_APP_BASE_URL=/RepositoryNameHere/

# For generating SEO meta tags that require the base URL including the domain name
# Omit the trailing slash
NUXT_PUBLIC_FULL_BASE_URL=http://localhost:3000

# Optional git remote repository commit base URL
NUXT_PUBLIC_COMMIT_BASE_URL=https://github.com/MusicOnline/AK-Dataknights/commit
```

Builds may require `NODE_OPTIONS=--max_old_space_size=8192` to run.
This should be set in the operating system or through the terminal, not in the `.env` file.

### Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

### Production

Serve with a Node.js Server:

```bash
pnpm build
# Start server
node .output/server/index.mjs
```

Static hosting:

```bash
pnpm generate
# Serve .output/public, example:
pnpm dlx serve .output/public
```

Locally preview production build:

```bash
pnpm preview
```

### Continuous Deployment

The [`check-data-update`](./.github/workflows/check-data-update.yml) workflow checks for updates in the master branch of Kengxxiao/ArknightsGameData and Kengxxiao/ArknightsGameData_YoStar. If there is an update, [`.game-data-sha`](./data/.game-data-sha) and [`.game-data-yostar-sha`](./data/.game-data-yostar-sha) is updated in this repository.

Any pushes to this repository may trigger Cloudflare Pages to build and deploy the website with its automatic deployments feature (without using workers). This is currently disabled due to it being unstable (works sometimes, and segfaults other times). In addition to the above environment variables, `NITRO_PRESET=static` is required. This is the build command:

```bash
git clone --depth 1 https://github.com/Kengxxiao/ArknightsGameData ArknightsGameData \
&& git clone --depth 1 https://github.com/Kengxxiao/ArknightsGameData_YoStar ArknightsGameData_YoStar \
&& pnpm prepare-nuxt \
&& pnpm build
```

[`deploy-cfpages`](./.github/workflows/deploy-cfpages.yml) can be triggered manually with GitHub Actions in case the Cloudflare build fails. This workflow is used on push instead of Cloudflare's own automatic deployments.

Additionally, any pushes to the main branch of this repository will trigger the [`deploy-ghpages`](./.github/workflows/deploy-ghpages.yml) workflow to deploy the website to GitHub Pages.

GitHub Pages Mirror: https://musiconline.github.io/AK-Dataknights/

Artifacts for both builds are available for download in their respective GitHub Actions pages.

## Special Thanks

In no particular order:

- [Kengxxiao](https://github.com/Kengxxiao) ([ArknightsGameData](https://github.com/Kengxxiao/ArknightsGameData), [ArknightsGameData_YoStar](https://github.com/Kengxxiao/ArknightsGameData_YoStar))
- [astral4](https://github.com/astral4), [akgcc](https://github.com/akgcc) ([arkdata](https://github.com/akgcc/arkdata))
- [Aceship](https://github.com/Aceship) ([Arknight-Images](https://github.com/Aceship/Arknight-Images))
