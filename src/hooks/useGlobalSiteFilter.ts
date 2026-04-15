import { useSelectedSite } from "@/context/SelectedSiteContext";

/**
 * Returns a filter function that filters items by the globally selected site.
 * Items must have a `site_id` field.
 */
export function useGlobalSiteFilter() {
  const { selectedSiteId } = useSelectedSite();

  const filterBySite = <T extends { site_id: string | null }>(items: T[]): T[] => {
    if (!selectedSiteId || selectedSiteId === "all") return items;
    return items.filter(item => item.site_id === selectedSiteId);
  };

  return { selectedSiteId, filterBySite };
}
