import { useState } from 'react';

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
      className="inline-block md:hidden cursor-pointer p-2 focus:outline-none focus:ring-0 z-100"
      onClick={handleClick}
    >
      <span
        className={`block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
          isOpen ? 'transform rotate-45 translate-y-2' : ''
        }`}
      ></span>
      <span
        className={`block w-6 h-0.5 bg-black dark:bg-white mt-1.5 transition-all duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}
      ></span>
      <span
        className={`block w-6 h-0.5 bg-black dark:bg-white mt-1.5 transition-all duration-300 ${
          isOpen ? 'transform -rotate-45 -translate-y-2' : ''
        }`}
      ></span>
    </button>
  );
};

export default BurgerButton;
