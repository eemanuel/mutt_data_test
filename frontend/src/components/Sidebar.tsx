import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation(); // detect current route (table or charts)

  const menuItems = [
    { name: "Table", path: "/table" },
    { name: "Charts", path: "/charts" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-25 bg-gray-900 text-gray-400 py-7 space-y-12">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center space-y-1 hover:text-yellow-400 transition-colors duration-200 ${
              isActive ? "text-white" : "text-blue-700"
            }`}
          >
            <span className="text-ls font-medium">{item.name}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default Sidebar;
