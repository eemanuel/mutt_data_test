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

const COLUMN_NAMES = ["price", "avg_market_cap", "avg_24h_vol"];
type ColumnName = typeof COLUMN_NAMES[number]; // "price" | "avg_market_cap" | "avg_24h_vol"

const CURRENCIES = ["usd", "ars", "both"];
type Currency = typeof CURRENCIES[number]; // "usd" | "ars" | "both"

const ChartsPage: React.FC = () => {
  const [coin, setCoin] = useState<Coin>("bitcoin");
  const [columnName, setColumnName] = useState<ColumnName>("price");
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [currency, setCurrency] = useState<Currency>("usd");

  const { data, loading, error } = useCryptoPrices({
    endpoint: "last_90_days",
    params: { crypto_id: coin, granularity: granularity },
    coin,
    granularity,
    flag: true,
  });

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const selectorsConfig = [
    { label: "Coin", value: coin, onChange: setCoin, options: COINS },
    {
      label: "ColumnName",
      value: columnName,
      onChange: setColumnName,
      options: COLUMN_NAMES,
    },
    {
      label: "Granularity",
      value: granularity,
      onChange: setGranularity,
      options: GRANULARITIES,
    },
    {
      label: "Currency",
      value: currency,
      onChange: setCurrency,
      options: CURRENCIES,
    },
  ];

  const linesConfig = [
    {
      key: "price",
      usd: { dataKey: "period_usd_avg", name: "USD Avg" },
      ars: { dataKey: "period_ars_avg", name: "ARS Avg" },
    },
    {
      key: "avg_market_cap",
      usd: { dataKey: "period_usd_avg_market_cap", name: "USD Avg Market Cap" },
      ars: { dataKey: "period_ars_avg_market_cap", name: "ARS Avg Market Cap" },
    },
    {
      key: "avg_24h_vol",
      usd: { dataKey: "period_usd_avg_24h_vol", name: "USD Avg 24 hs Vol" },
      ars: { dataKey: "period_ars_avg_24h_vol", name: "ARS Avg 24 hs Vol" },
    },
  ];

  return (
    <div className="w-full">
      <h1 className="section-title">Crypto Chart</h1>

      {/* Selectors */}
      <div className="div-selector">
        {selectorsConfig.map((sel) => (
          <Selector
            key={sel.label}
            label={sel.label}
            value={sel.value}
            onChange={sel.onChange}
            options={sel.options}
          />
        ))}
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
            {linesConfig.map((config) => {
              if (config.key !== columnName) return null;

              const currencies =
                currency === "both" ? ["usd", "ars"] : [currency];

              return currencies.map((curr) => {
                const lineData = config[curr as "usd" | "ars"];
                const color = curr === "usd" ? "#a8d884ff" : "#ca9e82ff";

                return (
                  <Line
                    key={`${config.key}-${curr}`}
                    type="monotone"
                    dataKey={lineData.dataKey}
                    stroke={color}
                    name={lineData.name}
                  />
                );
              });
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsPage;
