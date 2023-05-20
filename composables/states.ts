// null: before hydration hence before JS can run
export const useColorMode = () =>
  useState<"light" | "dark" | null>("colorMode", () => null)

export const useIsAdvancedViewEnabled = () =>
  useState<boolean>("isAdvancedViewEnabled", () => false)
