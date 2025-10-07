import React, { useState } from "react";
import useCryptoPrices from "../../hooks/useCryptoPrices";
import Selector from "../../components/Selector";
import { COINS, GRANULARITIES, Coin, Granularity } from "../../constants";

const TablePage: React.FC = () => {
  const [coin, setCoin] = useState<Coin>("bitcoin");
  const [granularity, setGranularity] = useState<Granularity>("monthly");

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
      <h1 className="section-title">Daily Crypto Prices (History)</h1>

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
      </div>

      {/* Table */}
      <div className="main-obj">
        <table className="table-style">
          <thead className="table-thead">
            <tr>
              <th scope="col" className="table-cell-first-row">
                #
              </th>
              <th scope="col" className="table-cell">
                Period
              </th>
              <th scope="col" className="table-cell">
                USD Avg
              </th>
              <th scope="col" className="table-cell">
                ARS Avg
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className="table-tr">
                <td className="table-cell-no-info" colSpan={4}>
                  {" "}
                  No info{" "}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key="crypto-values" className="table-tr">
                  <td className="table-cell-first-row">{index + 1}</td>
                  <td className="table-cell">{item.period}</td>
                  <td className="table-cell">
                    {item.period_usd_avg === undefined
                      ? ""
                      : item.period_usd_avg.toFixed(4)}
                  </td>
                  <td className="table-cell">
                    {item.period_ars_avg === undefined
                      ? ""
                      : item.period_ars_avg.toFixed(4)}
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
