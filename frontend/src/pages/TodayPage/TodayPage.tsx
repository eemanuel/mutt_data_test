import React, { useState } from "react";
import useCryptoPrices from "../../hooks/useCryptoPrices";
import Selector from "../../components/Selector";
import TableHead, { SortConfig } from "../../components/TableHead";
import ButtonExportCSV from "../../components/ButtonExportCSV";
import NoInfoRow from "../../components/NoInfoRow";
import { getNextSortConfig, sortData, getCurrentTimestamp } from "../../utils";
import { COINS, Coin } from "../../constants";

const TodayPage: React.FC = () => {
  const [coin, setCoin] = useState<Coin>("bitcoin");
  const [flag, setFlag] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const { data, loading, error } = useCryptoPrices({
    endpoint: "today_values",
    flag,
    useReactQuery: true,
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => getNextSortConfig(prev, key));
  };

  const sortedData = React.useMemo(
    () => sortData(data, sortConfig),
    [data, sortConfig]
  );

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const handleFetch = () => {
    setFlag(!flag);
  };

  const getFileName = () => {
    return `crypto_prices_${getCurrentTimestamp()}_${coin}_${sortConfig?.key}_${
      sortConfig?.direction
    }_today_table.csv`;
  };

  return (
    <div className="w-full">
      <h1 className="section-title">Today Crypto Prices</h1>

      {/* Selectors */}
      <div className="div-selector">
        <Selector
          label="Coin"
          value={coin}
          onChange={setCoin}
          options={COINS}
        />
        <button onClick={handleFetch} className="refresh-button">
          Refresh
        </button>
        <ButtonExportCSV data={sortedData} filename={getFileName()} />
      </div>

      {/* Table */}
      <div className="main-obj">
        <table className="table-style">
          <TableHead sortConfig={sortConfig} handleSort={handleSort} />
          <tbody>
            {sortedData.length === 0 ? (
              <NoInfoRow />
            ) : (
              sortedData.map((item, index) => {
                if (item.crypto_id === coin) {
                  return (
                    <tr
                      key={`crypto-today-values-${index}`}
                      className="table-tr"
                    >
                      <td className="table-cell-first-row">{index + 1}</td>
                      <td className="table-cell table-cell-hightlight">
                        {item.hour_requested}
                      </td>
                      <td className="table-cell table-cell-hightlight-2">
                        {item.usd?.toFixed(4) ?? ""}
                      </td>
                      <td className="table-cell table-cell-hightlight-2">
                        {item.ars?.toFixed(4) ?? ""}
                      </td>
                      <td className="table-cell">
                        {item.usd_24h_vol?.toFixed(4) ?? ""}
                      </td>
                      <td className="table-cell">
                        {item.usd_market_cap?.toFixed(4) ?? ""}
                      </td>
                      <td className="table-cell">
                        {item.ars_24h_vol?.toFixed(4) ?? ""}
                      </td>
                      <td className="table-cell">
                        {item.ars_market_cap?.toFixed(4) ?? ""}
                      </td>
                    </tr>
                  );
                }
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayPage;
