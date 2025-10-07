import { useEffect, useState } from "react";
import backendRequester from "../services/backendRequester";
import { Coin, Granularity } from "../constants";

export interface CryptoPrice {
  usd: number;
  ars: number;
}

export interface CryptoItem {
  crypto_id?: string;
  hour_requested?: string;
  usd?: number;
  usd_market_cap?: number;
  usd_24h_vol?: number;
  ars?: number;
  ars_market_cap?: number;
  ars_24h_vol?: number;
  period?: string;
  period_usd_avg?: number;
  period_ars_avg?: number;
  period_usd_avg_24h_vol?: number;
  period_usd_avg_market_cap?: number;
  period_ars_avg_24h_vol?: number;
  period_ars_avg_market_cap?: number;
}

interface UseCryptoPricesOptions {
  endpoint: string;
  params?: Record<string, string>;
  coin?: Coin;
  granularity?: Granularity;
  flag?: boolean;
}

export default function useCryptoPrices({
  endpoint,
  params,
  coin,
  granularity,
  flag,
}: UseCryptoPricesOptions) {
  const [data, setData] = useState<CryptoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendRequester.get(
        `/crypto_values/${endpoint}/`,
        {
          params,
        }
      );
      setData(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [coin, granularity, flag]);

  return { data, loading, error };
}
