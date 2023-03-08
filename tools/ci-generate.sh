#!/bin/bash

# Checkout game data
git clone https://github.com/Kengxxiao/ArknightsGameData.git ArknightsGameData

# Set environment variables
export npm_config_ignore_scripts=false
export GAME_DATA_ROOT_PATH=$(pwd)/ArknightsGameData
export ENABLE_SSR=true
export NODE_OPTIONS=--max_old_space_size=8192

# Install dependencies (Cloudflare already does this)
npm ci

# Generate static site
npm run generate-linux

