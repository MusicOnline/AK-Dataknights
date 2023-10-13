export const useIsAdvancedViewEnabled = () =>
  useState<boolean>("isAdvancedViewEnabled", () => false)

export const useIsSidebarExpanded = () =>
  useState<boolean>("isSidebarExpanded", () => false)
