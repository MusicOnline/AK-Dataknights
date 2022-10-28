# AK-Dataknights

Arknights database made with [Nuxt 3](https://v3.nuxtjs.org) for educational purposes. Uses data from [Kengxxiao/ArknightsGameData](https://github.com/Kengxxiao/ArknightsGameData).

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Configuration

Create a `.env` file with the following content:

```bash
# https://github.com/Kengxxiao/ArknightsGameData
GAME_DATA_ROOT_PATH=/path/to/ArknightsGameData
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
