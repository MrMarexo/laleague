import { useTheme } from "next-themes";
import { type ReactFCC } from "~/types/types";
import Navbar from "./Navbar";
import BoxerRed from "~/components/BoxerRed";
import BoxerBlue from "~/components/BoxerBlue";

const Layout: ReactFCC<{ isFlexOff?: boolean; isWithBoxers?: boolean }> = ({
  children,
  isFlexOff,
  isWithBoxers,
}) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black dark:bg-black-800 dark:text-white">
      <Navbar isDark={isDark} onThemeToggle={handleThemeToggle} />

      {isWithBoxers === true ? (
        <>
          <div className="position absolute mt-20 hidden w-screen pt-10 md:block">
            <div className="absolute"></div>
            <BoxerBlue />
          </div>
          <div className="position absolute mt-20 hidden w-screen pt-10 md:block">
            <div className="absolute right-0">
              <BoxerRed />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

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
