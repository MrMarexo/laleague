import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export const LightSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      className="effect-container text-base transition duration-300 md:text-lg"
      onClick={toggleTheme}
    >
      <span className="effect h-6 w-6 rounded-full text-base">
        {theme === "dark" ? "☼" : "☾"}
      </span>
    </button>
  );
};
