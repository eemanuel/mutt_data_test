import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  useReactQuery?: boolean;
}

export default function useCryptoPrices({
  endpoint,
  params,
  coin,
  granularity,
  flag,
  useReactQuery = false,
}: UseCryptoPricesOptions) {
  const url = `/crypto-values/${endpoint}/`;

  const fetchData = async (): Promise<CryptoItem[]> => {
    const response = await backendRequester.get(url, {
      params,
    });
    return response.data;
  };

  const query = useQuery<CryptoItem[], Error>({
    queryKey: [
      "cryptoPrices",
      url,
      params ? JSON.stringify(params) : "",
      coin,
      granularity,
      flag,
    ],
    queryFn: fetchData,
    refetchInterval: 30000, // each 30 secs
    enabled: useReactQuery, // only use useQuery if useReactQuery is true
  });

  const [data, setData] = useState<CryptoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendRequester.get(url, {
        params,
      });
      setData(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useReactQuery) return; // if useReactQuery is true then do not fetch manually
    getData();
  }, [url, coin, granularity, flag, useReactQuery]);

  return useReactQuery
    ? {
        data: query.data ?? [],
        loading: query.isLoading,
        error: query.error ? (query.error as Error).message : null,
      }
    : { data, loading, error };
}
