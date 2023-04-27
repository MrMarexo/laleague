import { ReactNode } from "react";
import { useTheme } from "next-themes";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className="dark:bg-black-800 flex min-h-screen flex-col items-center bg-white text-black dark:text-white">
      <Navbar onThemeToggle={handleThemeToggle} />
      <div className="container flex flex min-h-screen flex-col flex-col items-center justify-center px-4 py-16 ">
        {children}
      </div>
    </main>
  );
};

export default Layout;
