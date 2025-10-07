import React from "react";
import { Routes, Route } from "react-router-dom";
import LastsValuesPage from "./pages/LastsValuesPage/LastsValuesPage";
import TodayPage from "./pages/TodayPage/TodayPage";
import TablePage from "./pages/TablePage/TablePage";
import ChartsPage from "./pages/ChartsPage/ChartsPage";
import "./index.css";
import DefaultSidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      <DefaultSidebar />
      <main className="flex-1 p-8 bg-gray-700 overflow-auto">
        <Routes>
          <Route path="/lasts" element={<LastsValuesPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/charts" element={<ChartsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
