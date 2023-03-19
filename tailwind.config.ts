export default {
  darkMode: ["class", '[data-mode="dark"]'],
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
          icon: "rgba(var( --color-brand-icon), <alpha-value>)",
          text: "rgba(var(--color-brand-text), <alpha-value>)",
        },
        bg: {
          navbar: "rgba(var( --color-bg-navbar), <alpha-value>)",
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
};
