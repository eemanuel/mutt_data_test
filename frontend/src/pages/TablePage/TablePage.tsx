import React, { useState } from "react";
import useCryptoPrices from "../../hooks/useCryptoPrices";
import Selector from "../../components/Selector";
import ButtonExportCSV from "../../components/ButtonExportCSV";
import NoInfoRow from "../../components/NoInfoRow";
import {
  getNextSortConfig,
  sortData,
  getSortSymbol,
  getCurrentTimestamp,
} from "../../utils";
import {
  COINS,
  GRANULARITIES,
  Coin,
  Granularity,
  SortOptions,
} from "../../constants";

const TablePage: React.FC = () => {
  const [coin, setCoin] = useState<Coin>("bitcoin");
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortOptions;
  } | null>(null);

  const { data, loading, error } = useCryptoPrices({
    endpoint: "last_90_days",
    params: { crypto_id: coin, granularity: granularity },
    coin,
    granularity,
    flag: true,
  });

  const sortedData = React.useMemo(
    () => sortData(data, sortConfig),
    [data, sortConfig]
  );

  const handleSort = (key: string) => {
    setSortConfig((prev) => getNextSortConfig(prev, key));
  };

  const fileName = React.useMemo(() => {
    return `crypto_prices_${getCurrentTimestamp()}_${coin}_${granularity}_${
      sortConfig?.key
    }_${sortConfig?.direction}_history_table.csv`;
  }, [coin, granularity, sortConfig]);

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
        <ButtonExportCSV data={sortedData} filename={fileName} />
      </div>

      {/* Table */}
      {sortedData.length === 0 ? (
        <NoInfoRow />
      ) : (
        <div className="main-obj">
          <table className="table-style">
            <thead className="table-thead">
              <tr>
                <th scope="col" className="table-cell-first-row">
                  #
                </th>
                <th
                  onClick={() => handleSort("period")}
                  scope="col"
                  className="table-cell"
                >
                  Period{" "}
                  {sortConfig ? getSortSymbol(sortConfig, "period") : "▼"}
                </th>
                <th
                  onClick={() => handleSort("period_usd_avg")}
                  scope="col"
                  className="table-cell"
                >
                  USD Avg {getSortSymbol(sortConfig, "period_usd_avg")}
                </th>
                <th
                  onClick={() => handleSort("period_ars_avg")}
                  scope="col"
                  className="table-cell"
                >
                  ARS Avg {getSortSymbol(sortConfig, "period_ars_avg")}
                </th>
                <th scope="col" className="table-cell">
                  USD Avg 24 Hs Vol
                </th>
                <th scope="col" className="table-cell">
                  USD Avg Market Cap
                </th>
                <th scope="col" className="table-cell">
                  ARS Avg 24 Hs Vol
                </th>
                <th scope="col" className="table-cell">
                  ARS Avg Market Cap
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr className="table-tr">
                  <td className="table-cell-no-info" colSpan={4}>
                    {" "}
                    No info{" "}
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr key={`crypto-values-${index}`} className="table-tr">
                    <td className="table-cell-first-row">{index + 1}</td>
                    <td className="table-cell table-cell-hightlight">
                      {item.period}
                    </td>
                    <td className="table-cell table-cell-hightlight-2">
                      {item.period_usd_avg?.toFixed(4) ?? ""}
                    </td>
                    <td className="table-cell table-cell-hightlight-2">
                      {item.period_ars_avg?.toFixed(4) ?? ""}
                    </td>
                    <td className="table-cell">
                      {item.period_usd_avg_24h_vol?.toFixed(4) ?? ""}
                    </td>
                    <td className="table-cell">
                      {item.period_usd_avg_market_cap?.toFixed(4) ?? ""}
                    </td>
                    <td className="table-cell">
                      {item.period_ars_avg_24h_vol?.toFixed(4) ?? ""}
                    </td>
                    <td className="table-cell">
                      {item.period_ars_avg_market_cap?.toFixed(4) ?? ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablePage;
