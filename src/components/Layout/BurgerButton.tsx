import { useState } from "react";

type BurgerButtonProps = {
  onToggle: (isOpen: boolean) => void;
};

const BurgerButton: React.FC<BurgerButtonProps> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  return (
    <button
      className="z-30 inline-block cursor-pointer p-2 focus:outline-none focus:ring-0 md:hidden"
      onClick={handleClick}
    >
      <span
        className={`block h-0.5 w-6 bg-black transition-all duration-300 dark:bg-white ${
          isOpen ? "translate-y-2 rotate-45 transform" : ""
        }`}
      ></span>
      <span
        className={`mt-1.5 block h-0.5 w-6 bg-black transition-all duration-300 dark:bg-white ${
          isOpen ? "opacity-0" : ""
        }`}
      ></span>
      <span
        className={`mt-1.5 block h-0.5 w-6 bg-black transition-all duration-300 dark:bg-white ${
          isOpen ? "-translate-y-2 -rotate-45 transform" : ""
        }`}
      ></span>
    </button>
  );
};

export default BurgerButton;
