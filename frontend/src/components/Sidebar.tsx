import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation(); // Get current location
  const navigate = useNavigate(); // Navigate to a new route

  // Define your links
  const links = [
    { label: "Home", icon: faHome, id: "home", path: "/" },
    { label: "Profile", icon: faUser, id: "profile", path: "/profile" },
    { label: "Settings", icon: faCog, id: "settings", path: "/settings" },
    { label: "Help", icon: faQuestionCircle, id: "help", path: "/help" },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      Cookie.remove("token");
      navigate("/login"); // Navigate to the login page
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div
      className={`fixed md:relative top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-40 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform md:w-full w-72`}
    >
      <div className="h-full flex flex-col text-gray-800 dark:text-white">
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-4">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => navigate(link.path)} // Navigate to the path on click
              className={`flex items-center px-4 py-3 w-full rounded transition-all ${
                location.pathname === link.path
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold shadow-inner"
                  : "hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white text-gray-500"
              }`}
            >
              <FontAwesomeIcon icon={link.icon} className="mr-3 text-lg" />
              {link.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 rounded transition-all bg-gray-100 hover:bg-red-100 text-gray-800 hover:text-red-600 dark:bg-gray-700 dark:hover:bg-red-600 dark:text-white dark:hover:text-white"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
