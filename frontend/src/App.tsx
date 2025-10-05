import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import TablePage from "./pages/TablePage/TablePage";
import ChartsPage from "./pages/ChartsPage/ChartsPage";
import "./index.css";
import DefaultSidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      <DefaultSidebar />
      <main className="flex-1 p-8 md:ml-5 bg-gray-100 overflow-auto">
        <Routes>
          <Route path="/table" element={<TablePage />} />
          <Route path="/charts" element={<ChartsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
