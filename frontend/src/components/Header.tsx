import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faUserCircle, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Retrieve the theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const { user } = useAuth();

  useEffect(() => {
    // Apply the theme on component mount
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Toggle the theme and save the preference
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between z-40">
      {/* Left Section: Hamburger Menu and Logo */}
      <div className="flex items-center space-x-4">
        <button
          className="md:hidden p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ease-in-out duration-200"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="text-gray-800 dark:text-white w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
          Connectgram
        </h1>
      </div>

      {/* Right Section: Notifications, Profile, and Theme Toggle */}
      <div className="flex items-center space-x-6">
        <button
          className="relative p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ease-in-out duration-200"
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-gray-800 dark:text-white w-5 h-5" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
            3
          </span>
        </button>

        {/* Theme Toggle Button */}
        <button
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ease-in-out duration-200"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          <FontAwesomeIcon
            icon={isDarkMode ? faSun : faMoon}
            className="text-gray-800 dark:text-white w-5 h-5"
          />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <FontAwesomeIcon icon={faUserCircle} className="text-gray-800 dark:text-white w-8 h-8" />
          <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
            {`Welcome, ${user.name}`}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
