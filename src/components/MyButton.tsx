import { type ButtonHTMLAttributes } from "react";
import { type ReactFCC } from "~/types/types";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  //
};

export const MyButton: ReactFCC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="duration-400 rounded border  border-black bg-transparent px-3 py-1 text-xs font-semibold transition-all hover:bg-black hover:text-white dark:border-white hover:dark:bg-league-gray-6"
    >
      {children}
    </button>
  );
};
