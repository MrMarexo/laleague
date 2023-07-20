import { useTheme } from "next-themes";
import { type ReactFCC } from "~/types/types";
import Navbar from "./Navbar";
import BoxerRight from "~/components/BoxerRight";
import BoxerLeft from "~/components/BoxerLeft";
import Link from "../Link/Link";

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
    <>
      <main className="flex min-h-screen flex-col items-center bg-white text-black dark:bg-black-800 dark:text-white">
        <Navbar isDark={isDark} onThemeToggle={handleThemeToggle} />
        {isWithBoxers && (
          <>
            <div className="position absolute z-0 mt-20 hidden w-screen pt-10 md:block">
              <div className="absolute"></div>
              <BoxerLeft />
            </div>
            <div className="position absolute z-0 mt-20 hidden w-screen pt-10 md:block">
              <div className="absolute right-0">
                <BoxerRight />
              </div>
            </div>
          </>
        )}

        <div
          className={`container ${
            isFlexOff ? "" : "flex flex-col items-center"
          } z-10  mb-4 px-4 pb-5 pt-16`}
        >
          {children}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 z-20 flex w-full justify-center gap-10 bg-white px-5 py-2 pb-4 text-sm dark:bg-black-800">
        <Link href="/rules">Rules</Link>
        <Link href="/thanks">Thanks</Link>
        {/* <Link href="/rules">Support</Link> */}
        {/* <i>
          made by
          <Link href="https://discordapp.com/users/213597836233670658">
            Marexo
          </Link>
        </i> */}
      </footer>
    </>
  );
};

export default Layout;
