import { getSortSymbol } from "../utils";
import { SortOptions } from "../constants";

export interface SortConfig {
  key: string;
  direction: SortOptions;
}

interface CryptoTableHeadProps {
  sortConfig?: SortConfig | null;
  handleSort?: (key: string) => void;
  addName?: boolean;
}

export default function TableHead({
  sortConfig,
  handleSort,
  addName = false,
}: CryptoTableHeadProps) {
  return (
    <thead className="table-thead">
      <tr>
        <th scope="col" className="table-cell-first-row">
          #
        </th>
        {addName && (
          <th
            onClick={() => (handleSort ? handleSort("crypto_id") : null)}
            scope="col"
            className="table-cell"
          >
            Name {sortConfig ? getSortSymbol(sortConfig, "crypto_id") : ""}
          </th>
        )}
        {handleSort ? (
          <th
            onClick={() => handleSort("hour_requested")}
            scope="col"
            className="table-cell"
          >
            Hour{" "}
            {sortConfig ? getSortSymbol(sortConfig, "hour_requested") : "▼"}
          </th>
        ) : (
          <th scope="col" className="table-cell">
            Hour
          </th>
        )}
        <th
          onClick={() => (handleSort ? handleSort("usd") : null)}
          scope="col"
          className="table-cell"
        >
          USD Price {sortConfig ? getSortSymbol(sortConfig, "usd") : ""}
        </th>
        <th
          onClick={() => (handleSort ? handleSort("ars") : null)}
          scope="col"
          className="table-cell"
        >
          ARS Price {sortConfig ? getSortSymbol(sortConfig, "ars") : ""}
        </th>
        <th scope="col" className="table-cell">
          USD 24 Hs Vol
        </th>
        <th scope="col" className="table-cell">
          USD Market Cap
        </th>
        <th scope="col" className="table-cell">
          ARS 24 Hs Vol
        </th>
        <th scope="col" className="table-cell">
          ARS Market Cap
        </th>
      </tr>
    </thead>
  );
}
