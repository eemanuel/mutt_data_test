export const COINS = ["bitcoin", "ethereum"];
export type Coin = typeof COINS[number]; // "bitcoin" | "ethereum"

export const GRANULARITIES = ["daily", "weekly", "monthly"];
export type Granularity = typeof GRANULARITIES[number]; // "daily" | "weekly" | "monthly"
