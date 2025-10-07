import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation(); // detect current route (table or charts)

  const menuItems = [
    { name: "Lasts", path: "/lasts" },
    { name: "Today", path: "/today" },
    { name: "Table", path: "/table" },
    { name: "Charts", path: "/charts" },
  ];

  return (
    // flex flex-col bg-gray-900 text-gray-400 py-[200px] space-y-10 fixed top-0 w-full
    <aside
      className="fixed top-0 w-full bg-gray-900 text-gray-400
    md:static md:w-32 md:h-screen md:space-y-10 md:flex md:flex-col"
    >
      <img
        src={require("../mutt_data.jpg")}
        alt="Mutt Data"
        className="hidden md:block md:py-5"
      />
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name.toLowerCase()}
            to={item.path}
            className={`sidebar ${isActive ? "text-white" : "text-blue-500"}`}
          >
            <span className="text-ls font-medium">{item.name}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default Sidebar;
