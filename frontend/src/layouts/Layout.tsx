import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Content Area with Sidebar */}
      <div className="h-[89vh] flex flex-1">
        {/* Sidebar */}
        <div
          className={`fixed z-40 h-full bg-white shadow-lg md:relative md:z-auto md:flex md:flex-shrink-0 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-64 dark:bg-gray-800`}
        >
          <Sidebar isOpen={isOpen} />
        </div>

        {/* Overlay for mobile (to close sidebar when clicking outside) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
