import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "../Link/Link";
import BurgerButton from "./BurgerButton";

type NavbarProps = {
  onThemeToggle: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onThemeToggle }) => {
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
    <div className="position: fixed my-2 flex w-full flex-row justify-between px-5 md:px-20">
      <nav className="flex flex-row gap-5 text-lg md:gap-8">
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
              ? "dark:bg-black-800 fixed top-0 right-0 z-0 h-full w-64 bg-white p-5 shadow-lg md:p-0"
              : "z-0 hidden flex-row gap-5 md:static md:flex md:gap-8 md:bg-transparent md:shadow-none md:dark:bg-transparent"
          } z-0 flex-row gap-5 md:static md:flex md:gap-8 md:bg-transparent md:shadow-none md:dark:bg-transparent`}
        >
          <nav className="top-0 flex flex-col items-start space-y-4 text-lg md:flex-row md:gap-5 md:gap-8 md:space-y-0">
            <Link href="/results" className="effect">
              My&nbsp;results
            </Link>
            <Link href="/scoreboard">Scoreboard</Link>
            <button
              className="text-base transition duration-300 hover:text-pink-700 md:text-lg"
              onClick={onThemeToggle}
            >
              <span className="h-6 w-6 rounded-full text-base text-black dark:text-white">
                {data?.theme === "dark" ? "☼" : "☾"}
              </span>
            </button>
          </nav>
        </section>
      </nav>
      <div className="flex flex-row gap-2">
        {data?.user?.name ? (
          <>
            <div>
              Welcome, <span className="font-bold">{data.user.name}</span>
            </div>
            <div>|</div>
            <button
              className="text-base text-black transition duration-300 hover:text-pink-700 md:text-lg"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="text-base text-black text-black transition duration-300 hover:text-pink-700 dark:text-white md:text-lg"
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
