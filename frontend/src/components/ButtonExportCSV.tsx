import React from "react";

interface ButtonExportCSVProps {
  data: any[];
  filename?: string;
}

const ButtonExportCSV: React.FC<ButtonExportCSVProps> = ({
  data,
  filename = "data.csv",
}) => {
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers.map((h) => JSON.stringify(obj[h] ?? ""))
    );

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <button onClick={exportToCSV} className="quiet-button">
      ⬇️ Export CSV
    </button>
  );
};

export default ButtonExportCSV;
