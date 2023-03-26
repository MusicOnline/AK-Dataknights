export const useIsDarkModeEnabled = () =>
  useState<boolean>("isDarkModeEnabled", () => false)

export const useIsAdvancedViewEnabled = () =>
  useState<boolean>("isAdvancedViewEnabled", () => false)
