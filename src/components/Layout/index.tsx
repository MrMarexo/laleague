import { ReactNode } from "react";
import { useTheme } from "next-themes";
import { type ReactFCC } from "~/types/types";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout: ReactFCC = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className="dark:bg-black-800 flex min-h-screen flex-col items-center bg-white text-black dark:text-white">
       <Navbar isDark={isDark} onThemeToggle={handleThemeToggle} />
      <div className="container flex flex min-h-screen flex-col flex-col items-center justify-center px-4 py-16 ">
        {children}
      </div>
    </main>
  );
};

export default Layout;
