import type { Config } from "tailwindcss"

export default <Partial<Config>>{
  /**
   * In Vue SFC <style scoped>, dark: utility classes will be transformed into
   * [data-v-component-unqiue-identifier][data-mode="dark"] even with :deep().
   *
   * Even the default .dark class behavior will be transformed the same and not checked
   * at the <html> element.
   */
  darkMode: "class",
  safelist: [
    {
      pattern: /bg-rarity-\d/,
      variants: ["hover", "focus", "focus-visible"],
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "rgb(var(--color-primary-main) / <alpha-value>)",
          alt: "rgb(var(--color-primary-alt) / <alpha-value>)",
        },
        secondary: {
          main: "rgb(var(--color-secondary-main) / <alpha-value>)",
          alt: "rgb(var(--color-secondary-alt) / <alpha-value>)",
        },
        tertiary: {
          main: "rgb(var(--color-tertiary-main) / <alpha-value>)",
        },
        brand: {
          icon: "rgb(var(--color-brand-icon) / <alpha-value>)",
          text: "rgb(var(--color-brand-text) / <alpha-value>)",
        },
        rarity: {
          "1": {
            item: {
              normal: "rgb(var(--color-rarity-1-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-1-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-1-card) / <alpha-value>)",
          },
          "2": {
            item: {
              normal: "rgb(var(--color-rarity-2-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-2-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-2-card) / <alpha-value>)",
          },
          "3": {
            item: {
              normal: "rgb(var(--color-rarity-3-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-3-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-3-card) / <alpha-value>)",
          },
          "4": {
            item: {
              normal: "rgb(var(--color-rarity-4-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-4-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-4-card) / <alpha-value>)",
          },
          "5": {
            item: {
              normal: "rgb(var(--color-rarity-5-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-5-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-5-card) / <alpha-value>)",
          },
          "6": {
            item: {
              normal: "rgb(var(--color-rarity-6-item) / <alpha-value>)",
              focus: "rgb(var(--color-rarity-6-item-focus) / <alpha-value>)",
            },
            card: "rgb(var(--color-rarity-6-card) / <alpha-value>)",
          },
        },
        bg: {
          navbar: "rgb(var(--color-bg-navbar) / <alpha-value>)",
          body: "rgb(var(--color-bg-body) / <alpha-value>)",
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          input: {
            normal: "rgb(var(--color-bg-input) / <alpha-value>)",
            focus: "rgb(var(--color-bg-input-focus) / <alpha-value>)",
          },
          container: {
            "1": {
              normal: "rgb(var(--color-bg-container-1) / <alpha-value>)",
              focus: "rgb(var(--color-bg-container-1-focus) / <alpha-value>)",
            },
          },
        },
        fg: {
          navbar: {
            inactive: "rgb(var(--color-fg-navbar-inactive) / <alpha-value>)",
            active: "rgb(var(--color-fg-navbar-active) / <alpha-value>)",
            focus: "rgb(var(--color-fg-navbar-focus) / <alpha-value>)",
          },
          body: "rgb(var(--color-fg-body) / <alpha-value>)",
          primary: "rgb(var(--color-fg-primary) / <alpha-value>)",
          input: {
            normal: "rgb(var(--color-fg-input) / <alpha-value>)",
            placeholder:
              "rgb(var(--color-fg-input-placeholder) / <alpha-value>)",
          },
          container: {
            "1": "rgb(var(--color-fg-container-1) / <alpha-value>)",
          },
        },
      },
      fontSize: {
        "operator-name-3xs": ["0.55rem", "0.60rem"],
        "2xs": ["0.625rem", "0.65rem"],
      },
      borderRadius: {
        theme: "var(--border-radius-theme, 0.25rem)"
      }
    },
  },
}
