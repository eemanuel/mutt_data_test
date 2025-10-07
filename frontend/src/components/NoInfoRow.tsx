import React from "react";

interface NoInfoRowProps {
  colSpan?: number;
}

const NoInfoRow: React.FC<NoInfoRowProps> = () => {
  return (
    <tr className="table-tr">
      <td className="table-cell-no-info" colSpan={4}>
        No info
      </td>
    </tr>
  );
};

export default NoInfoRow;
