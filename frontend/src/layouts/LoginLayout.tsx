import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Props {
  children: React.ReactNode;
}

const LoginLayout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="h-[89vh] flex flex-1">
        <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LoginLayout;
