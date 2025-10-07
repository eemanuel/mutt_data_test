// pages/ChartsPage/ChartsPage.tsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import useCryptoPrices from "../../hooks/useCryptoPrices";
import Selector from "../../components/Selector";
import { COINS, GRANULARITIES, Coin, Granularity } from "../../constants";

const CURRENCIES = ["usd", "ars", "both"];
type Currencies = typeof CURRENCIES[number]; // "usd" | "ars" | "both"

const ChartsPage: React.FC = () => {
  const [coin, setCoin] = useState<Coin>("bitcoin");
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [currency, setCurrency] = useState<Currencies>("usd");

  const { data, loading, error } = useCryptoPrices({
    endpoint: "last_90_days",
    params: { crypto_id: coin, granularity: granularity },
    coin,
    granularity,
    flag: true,
  });

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="w-full">
      <h1 className="section-title">Crypto Chart</h1>

      {/* Selectors */}
      <div className="div-selector">
        <Selector
          label="Coin"
          value={coin}
          onChange={setCoin}
          options={COINS}
        />
        <Selector
          label="Granularity"
          value={granularity}
          onChange={setGranularity}
          options={GRANULARITIES}
        />
        <Selector
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES}
        />
      </div>

      {/* Chart */}
      <div className="main-obj">
        <ResponsiveContainer width="100%" height={700}>
          <LineChart data={data} margin={{ left: 20, right: 55 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" className="text-lg" />
            <YAxis />
            <Tooltip />
            <Legend />
            {(currency === "usd" || currency === "both") && (
              <Line
                type="monotone"
                dataKey="period_usd_avg"
                stroke="#a8d884ff"
                name="USD Avg"
              />
            )}
            {(currency === "ars" || currency === "both") && (
              <Line
                type="monotone"
                dataKey="period_ars_avg"
                stroke="#ca9e82ff"
                name="ARS Avg"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsPage;
