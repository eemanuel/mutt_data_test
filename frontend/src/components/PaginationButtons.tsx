import React from "react";
import { ITEMS_PER_PAGE } from "../constants";

interface PaginationButtonsProps<T> {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  sortedData: T[];
  itemsPerPage?: number;
}

const PaginationButtons = <T,>({
  setCurrentPage,
  currentPage,
  sortedData,
  itemsPerPage = ITEMS_PER_PAGE,
}: PaginationButtonsProps<T>) => {
  return (
    <div className="pagination">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="quiet-button"
      >
        ◀
      </button>

      <span className="px-5 text-lg">
        Page {currentPage} of {Math.ceil(sortedData.length / itemsPerPage)}
      </span>

      <button
        onClick={() =>
          setCurrentPage((p) =>
            p < Math.ceil(sortedData.length / itemsPerPage) ? p + 1 : p
          )
        }
        disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)}
        className="quiet-button"
      >
        ▶
      </button>
    </div>
  );
};

export default PaginationButtons;
