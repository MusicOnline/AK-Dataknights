export const useIsDarkModeEnabled = () =>
  useState<boolean>("isDarkModeEnabled", () => false)
