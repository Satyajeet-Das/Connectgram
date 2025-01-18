import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faUserCircle, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  // State to track whether dark mode is enabled or not
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  // Toggle the theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode); // Toggle dark class on the root element
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between z-40">
      {/* Left Section: Hamburger Menu and Logo */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ease-in-out duration-200"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="text-gray-800 dark:text-white w-5 h-5" />
        </button>

        {/* Logo or Title */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
          Connectgram
        </h1>
      </div>

      {/* Right Section: Notifications, Profile, and Theme Toggle */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
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
