import React, { useState } from "react";
import useDailyPrices from "../../hooks/useDailyPrices";
import Selector from "../../components/Selector";

const TablePage: React.FC = () => {
  const [coin, setCoin] = useState<"bitcoin" | "ethereum">("bitcoin");
  const [granularity, setGranularity] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");

  const { data, loading, error } = useDailyPrices(coin, granularity);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Daily Crypto Prices
      </h1>

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
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th scope="col" className="px-10 py-1">
                #
              </th>
              <th scope="col" className="px-10 py-3">
                Period
              </th>
              <th scope="col" className="px-10 py-3">
                USD Avg
              </th>
              <th scope="col" className="px-10 py-3">
                ARS Avg
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className="border-b border-gray-100">
                <td
                  className="px-6 py-4 text-gray-400 text-center"
                  colSpan={4}
                />
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key="bitcoin"
                  className="border-b border-gray-100 hover:bg-yellow-900"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.period}</td>
                  <td className="px-6 py-4">
                    {item.period_usd_avg.toFixed(4)}
                  </td>
                  <td className="px-6 py-4">
                    {item.period_ars_avg.toFixed(4)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePage;
