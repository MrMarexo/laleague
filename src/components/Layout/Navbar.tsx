import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "../Link/Link";
import BurgerButton from "./BurgerButton";
import { LightSwitch } from "../LightSwitch";

type NavbarProps = {
  onThemeToggle: () => void;
  isDark: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onThemeToggle, isDark }) => {
  const { data } = useSession();
  const emojis = ["⚔️", "🔪", "💪", "🏆", "🏅", "🥈", "🍆"];

  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmojiIndex(
        (currentEmojiIndex) => (currentEmojiIndex + 1) % emojis.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleNavToggle = (isOpen: boolean) => {
    setIsNavOpen(isOpen);
  };

  return (
    <div className="fixed z-50 flex w-full flex-row justify-between bg-white px-5 py-2 dark:bg-black-800 md:px-20">
      <nav className="flex flex-row items-center gap-5 text-lg md:gap-8">
        <Link href="/">
          {emojis.map((emoji, index) => (
            <span
              key={emoji}
              className={`transition-opacity duration-700 ease-in-out ${
                index === currentEmojiIndex ? "opacity-100" : "opacity-0"
              } absolute`}
            >
              {emoji}
            </span>
          ))}
          <p className="pl-5 font-extrabold md:pl-6">League</p>
        </Link>
        <section
          id="sidebar"
          className={`${
            isNavOpen
              ? "fixed right-0 top-0 z-0 h-full w-64 bg-white p-5 shadow-lg dark:bg-black-800 md:p-0"
              : "z-0 hidden flex-row gap-5 md:static md:flex md:gap-8 md:bg-transparent md:shadow-none md:dark:bg-transparent"
          } z-0 flex-row gap-5 md:static md:flex md:gap-8 md:bg-transparent md:shadow-none md:dark:bg-transparent`}
        >
          <nav className="top-0 flex flex-col items-start space-y-4 text-lg md:flex-row md:gap-5 md:space-y-0">
            <Link href="/results">My&nbsp;results</Link>
            <Link href="/ranks">My&nbsp;ranks</Link>
            <Link href="/scoreboard">Scoreboard</Link>
            <LightSwitch />
          </nav>
        </section>
      </nav>
      <div className="flex flex-row items-center gap-2 md:text-lg">
        {data?.user?.name ? (
          <>
            <div className="hidden md:block">
              Welcome, <span className="font-bold">{data.user.name}</span>
            </div>
            <div className="hidden md:block">|</div>
            <button
              className="text-base text-black transition duration-300 hover:text-pink-700 dark:text-white md:text-lg"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="effect text-base text-black transition duration-300 hover:text-pink-700 dark:text-white md:text-lg"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        )}
        <BurgerButton onToggle={handleNavToggle} />
      </div>
    </div>
  );
};

export default Navbar;
