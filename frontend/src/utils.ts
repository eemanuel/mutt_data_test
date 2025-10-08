import { SortOptions, ITEMS_PER_PAGE } from "./constants";

export const getNextSortConfig = (
  current: { key: string; direction: SortOptions } | null,
  key: string
) => {
  if (current && current.key === key && current.direction === "asc") {
    return { key, direction: "desc" };
  }
  return { key, direction: "asc" };
};

export const sortData = <T>(
  data: T[],
  sortConfig: { key: string; direction: SortOptions } | null
) => {
  if (!sortConfig) return data;
  const sorted = [...data];
  sorted.sort((a, b) => {
    const aValue = a[sortConfig.key as keyof T];
    const bValue = b[sortConfig.key as keyof T];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
  return sorted;
};

export const getSortSymbol = (
  sortConfig: { key: string; direction: SortOptions } | null,
  key: string
) => {
  if (!sortConfig || sortConfig.key !== key) return "";
  return sortConfig.direction === "asc" ? "▲" : "▼";
};

export const getCurrentTimestamp = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timestamp = `${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(
    now.getDate()
  )}_${pad(now.getHours())}_${pad(now.getMinutes())}`;
  return timestamp;
};

export const getPaginatedData = <T>(
  currentPage: number,
  sortedData: T[]
): T[] => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
};
