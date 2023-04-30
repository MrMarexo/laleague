import { useTheme } from "next-themes";
import { type ReactFCC } from "~/types/types";
import Navbar from "./Navbar";

const Layout: ReactFCC<{ isFlexOff?: boolean }> = ({ children, isFlexOff }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black dark:bg-black-800 dark:text-white">
      <Navbar isDark={isDark} onThemeToggle={handleThemeToggle} />
      <div
        className={`container ${
          isFlexOff ? "" : "flex flex-col items-center"
        } min-h-screen px-4 pb-5 pt-16`}
      >
        {children}
      </div>
    </main>
  );
};

export default Layout;
