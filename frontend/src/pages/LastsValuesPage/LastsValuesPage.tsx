import React, { useState } from "react";
import useCryptoPrices from "../../hooks/useCryptoPrices";
import TableHead, { SortConfig } from "../../components/TableHead";
import NoInfoRow from "../../components/NoInfoRow";
import ButtonExportCSV from "../../components/ButtonExportCSV";
import { getNextSortConfig, sortData, getCurrentTimestamp } from "../../utils";

const LastsValuesPage: React.FC = () => {
  const [flag, setFlag] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const { data, loading, error } = useCryptoPrices({
    endpoint: "lasts_values",
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
    return `crypto_prices_${getCurrentTimestamp()}__${sortConfig?.key}_${
      sortConfig?.direction
    }_lasts_table.csv`;
  };

  return (
    <div className="w-full">
      <h1 className="section-title">Last Crypto Prices</h1>

      <div className="div-selector">
        <button onClick={handleFetch} className="refresh-button">
          Refresh
        </button>
        <ButtonExportCSV data={sortedData} filename={getFileName()} />
      </div>

      {/* Table */}
      <div className="main-obj">
        <table className="table-style">
          <TableHead sortConfig={sortConfig} handleSort={handleSort} addName />
          <tbody>
            {sortedData.length === 0 ? (
              <NoInfoRow />
            ) : (
              sortedData.map((item, index) => (
                <tr key={`crypto-lasts-values-${index}`} className="table-tr">
                  <td className="table-cell-first-row">{index + 1}</td>
                  <td className="table-cell table-cell-hightlight">
                    {item.crypto_id?.toUpperCase() ?? ""}
                  </td>
                  <td className="table-cell">{item.hour_requested}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LastsValuesPage;
