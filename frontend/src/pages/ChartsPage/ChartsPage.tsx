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
import useDailyPrices from "../../hooks/useDailyPrices";
import Selector from "../../components/Selector";

const ChartsPage: React.FC = () => {
  const [coin, setCoin] = useState<"bitcoin" | "ethereum">("bitcoin");
  const [granularity, setGranularity] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");
  const [currency, setCurrency] = useState<"usd" | "ars" | "both">("usd");

  const { data, loading, error } = useDailyPrices(coin, granularity);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Crypto Chart</h1>

      {/* Selectors */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Selector
          label="Coin"
          value={coin}
          onChange={setCoin}
          options={["bitcoin", "ethereum"]}
        />
        <Selector
          label="Granularity"
          value={granularity}
          onChange={setGranularity}
          options={["daily", "weekly", "monthly"]}
        />
        <Selector
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={["usd", "ars", "both"]}
        />
      </div>

      {/* Chart */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <ResponsiveContainer width="100%" height={550}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
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
