import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LastsValuesPage from "./pages/LastsValuesPage/LastsValuesPage";
import TodayPage from "./pages/TodayPage/TodayPage";
import TablePage from "./pages/TablePage/TablePage";
import ChartsPage from "./pages/ChartsPage/ChartsPage";
import "./index.css";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-700 overflow-auto dark:bg-black">
          <Routes>
            <Route path="/lasts" element={<LastsValuesPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="/charts" element={<ChartsPage />} />
          </Routes>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
