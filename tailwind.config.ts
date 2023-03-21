export default {
  darkMode: ["class", '[data-mode="dark"]'],
  safelist: [
    {
      pattern: /bg-rarity-\d/,
      variants: ["hover", "focus"],
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "rgba(var(--color-primary-main), <alpha-value>)",
          alt: "rgba(var(--color-primary-alt), <alpha-value>)",
        },
        secondary: {
          main: "rgba(var(--color-secondary-main), <alpha-value>)",
          alt: "rgba(var(--color-secondary-alt), <alpha-value>)",
        },
        tertiary: {
          main: "rgba(var(--color-tertiary-main), <alpha-value>)",
        },
        brand: {
          icon: "rgba(var(--color-brand-icon), <alpha-value>)",
          text: "rgba(var(--color-brand-text), <alpha-value>)",
        },
        rarity: {
          "1": {
            item: {
              normal: "rgba(var(--color-rarity-1-item), <alpha-value>)",
              focus: "rgba(var(--color-rarity-1-item-focus), <alpha-value>)",
            },
            card: "rgba(var(--color-rarity-1-card), <alpha-value>)",
          },
          "2": {
            item: {
              normal: "rgba(var(--color-rarity-2-item), <alpha-value>)",
              focus: "rgba(var(--color-rarity-2-item-focus), <alpha-value>)",
            },
            card: "rgba(var(--color-rarity-2-card), <alpha-value>)",
          },
          "3": {
            item: {
              normal: "rgba(var(--color-rarity-3-item), <alpha-value>)",
              focus: "rgba(var(--color-rarity-3-item-focus), <alpha-value>)",
            },
            card: "rgba(var(--color-rarity-3-card), <alpha-value>)",
          },
          "4": {
            item: {
              normal: "rgba(var(--color-rarity-4-item), <alpha-value>)",
              focus: "rgba(var(--color-rarity-4-item-focus), <alpha-value>)",
            },
            card: "rgba(var(--color-rarity-4-card), <alpha-value>)",
          },
          "5": {
            item: {
              normal: "rgba(var(--color-rarity-5-item), <alpha-value>)",
              focus: "rgba(var(--color-rarity-5-item-focus), <alpha-value>)",
            },
            card: "rgba(var(--color-rarity-5-card), <alpha-value>)",
          },
          "6": {
            item: {
              normal: "rgba(var(--color-rarity-6-item), <alpha-value>)",
              focus: "rgba(var(--color-rarity-6-item-focus), <alpha-value>)",
            },
            card: "rgba(var(--color-rarity-6-card), <alpha-value>)",
          },
        },
        bg: {
          navbar: "rgba(var(--color-bg-navbar), <alpha-value>)",
          body: "rgba(var(--color-bg-body), <alpha-value>)",
          primary: "rgba(var(--color-bg-primary), <alpha-value>)",
          input: {
            normal: "rgba(var(--color-bg-input), <alpha-value>)",
            focus: "rgba(var(--color-bg-input-focus), <alpha-value>)",
          },
          container: {
            "1": {
              normal: "rgba(var(--color-bg-container-1), <alpha-value>)",
              focus: "rgba(var(--color-bg-container-1-focus), <alpha-value>)",
            },
          },
        },
        fg: {
          navbar: {
            inactive: "rgba(var(--color-fg-navbar-inactive), <alpha-value>)",
            active: "rgba(var(--color-fg-navbar-active), <alpha-value>)",
            focus: "rgba(var(--color-fg-navbar-focus), <alpha-value>)",
          },
          body: "rgba(var(--color-fg-body), <alpha-value>)",
          primary: "rgba(var(--color-fg-primary), <alpha-value>)",
          input: {
            normal: "rgba(var(--color-fg-input), <alpha-value>)",
            placeholder:
              "rgba(var(--color-fg-input-placeholder), <alpha-value>)",
          },
          container: {
            "1": "rgba(var(--color-fg-container-1), <alpha-value>)",
          },
        },
      },
      fontSize: {
        "operator-name-3xs": ["0.55rem", "0.60rem"],
        "2xs": ["0.625rem", "0.65rem"],
      },
    },
  },
}
