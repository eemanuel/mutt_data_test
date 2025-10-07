import { useEffect, useState } from "react";
import backendRequester from "../services/backendRequester";

export interface CryptoPrice {
  usd: number;
  ars: number;
}

export interface CurrentCryptoData {
  bitcoin?: CryptoPrice;
  ethereum?: CryptoPrice;
  hour_requested?: string;
  period?: string;
  period_usd_avg?: number;
  period_ars_avg?: number;
}

interface UseCryptoPricesOptions {
  endpoint: string;
  params?: Record<string, string>;
  flag?: boolean;
}

export default function useCryptoPrices({
  endpoint,
  params,
  flag,
}: UseCryptoPricesOptions) {
  const [data, setData] = useState<CurrentCryptoData[]>([]);
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
  }, [flag]);

  return { data, loading, error };
}
