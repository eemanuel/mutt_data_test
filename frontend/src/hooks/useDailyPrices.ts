import { useEffect, useState } from "react";
import hitBackend from "../services/hitBackend";

interface CryptoData {
  period: string;
  period_usd_avg: number;
  period_ars_avg: number;
}

export default function useDailyPrices(
  coin: "bitcoin" | "ethereum",
  granularity: "daily" | "weekly" | "monthly"
) {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await hitBackend.get(
          `/crypto_values/last_90_days/?crypto_id=${coin}&granularity=${granularity}`
        );
        setData(response.data);
      } catch (err: any) {
        setError(err.message || "Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coin, granularity]);

  return { data, loading, error };
}
