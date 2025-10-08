export const COINS = ["bitcoin", "ethereum"];
export type Coin = typeof COINS[number];

export const GRANULARITIES = ["daily", "weekly", "monthly"];
export type Granularity = typeof GRANULARITIES[number];

export const SORT_OPTIONS = ["asc", "desc"];
export type SortOptions = typeof SORT_OPTIONS[number];

export const ITEMS_PER_PAGE = 20;
