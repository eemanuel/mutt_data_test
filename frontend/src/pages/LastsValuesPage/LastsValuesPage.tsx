import React, { useState } from "react";
import useCryptoPrices from "../../hooks/useCryptoPrices";
import { COINS } from "../../constants";

const LastsValuesPage: React.FC = () => {
  const [flag, setFlag] = useState<boolean>(false);

  const { data, loading, error } = useCryptoPrices({
    endpoint: "lasts_values",
    flag,
  });
  console.log(data);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const handleFetch = () => {
    setFlag(!flag);
  };

  return (
    <div className="w-full">
      <h1 className="section-title">Last Crypto Prices</h1>

      <div className="div-selector">
        <button onClick={handleFetch} className="refresh-button">
          Refresh
        </button>
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
                Name
              </th>
              <th scope="col" className="table-cell">
                Hour
              </th>
              <th scope="col" className="table-cell">
                USD Price
              </th>
              <th scope="col" className="table-cell">
                ARS Price
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
              COINS.map((coinName, index) => (
                <tr
                  key={`crypto-current-values-${coinName}`}
                  className="table-tr"
                >
                  <td className="table-cell-first-row">{index + 1}</td>
                  <td className="table-cell font-bold text-yellow-300">
                    {coinName.toUpperCase()}
                  </td>
                  {/* @ts-ignore */}
                  <td className="table-cell">{data.hour_requested}</td>
                  <td className="table-cell">
                    {/* @ts-ignore */}
                    {data[coinName].usd.toFixed(4)}
                  </td>
                  <td className="table-cell">
                    {/* @ts-ignore */}
                    {data[coinName].ars.toFixed(4)}
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
