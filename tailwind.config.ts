import type { Config } from "tailwindcss"

export default <Partial<Config>>{
  safelist: [
    {
      pattern: /bg-rarity-\d-item/,
    },
    {
      pattern: /bg-rarity-\d-item-focus/,
      variants: ["hover", "focus-visible"],
    },
    {
      pattern: /bg-rarity-\d-card/,
    },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          icon: "rgb(var(--color-brand-icon) / <alpha-value>)",
          text: "rgb(var(--color-brand-text) / <alpha-value>)",
        },
        rarity: {
          "1": {
            item: {
              DEFAULT: "rgb(var(--color-rarity-1-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-1-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-1-card) / <alpha-value>)",
          },
          "2": {
            item: {
              DEFAULT: "rgb(var(--color-rarity-2-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-2-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-2-card) / <alpha-value>)",
          },
          "3": {
            item: {
              DEFAULT: "rgb(var(--color-rarity-3-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-3-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-3-card) / <alpha-value>)",
          },
          "4": {
            item: {
              DEFAULT: "rgb(var(--color-rarity-4-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-4-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-4-card) / <alpha-value>)",
          },
          "5": {
            item: {
              DEFAULT: "rgb(var(--color-rarity-5-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-5-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-5-card) / <alpha-value>)",
          },
          "6": {
            item: {
              DEFAULT: "rgb(var(--color-rarity-6-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-6-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-6-card) / <alpha-value>)",
          },
        },
        navbar: {
          bg: "rgb(var(--color-bg-navbar) / <alpha-value>)",
          fg: {
            inactive: "rgb(var(--color-fg-navbar-inactive) / <alpha-value>)",
            active: "rgb(var(--color-fg-navbar-active) / <alpha-value>)",
            focus: "rgb(var(--color-fg-navbar-focus) / <alpha-value>)",
          },
        },
        body: {
          bg: "rgb(var(--color-bg-body) / <alpha-value>)",
          fg: "rgb(var(--color-fg-body) / <alpha-value>)",
        },
        container: {
          primary: {
            fg: "rgb(var(--color-fg-container-primary) / <alpha-value>)",
          },
          "1": {
            bg: {
              DEFAULT: "rgb(var(--color-bg-container-1) / <alpha-value>)",
              focus: "rgb(var(--color-bg-container-1-focus) / <alpha-value>)",
            },
            fg: "rgb(var(--color-fg-container-1) / <alpha-value>)",
          },
        },
      },
      fontSize: {
        "operator-name-3xs": ["0.55rem", "0.60rem"],
        "2xs": ["0.625rem", "0.65rem"],
      },
      borderRadius: {
        theme: "var(--border-radius-theme, 0.25rem)",
      },
    },
  },
}
