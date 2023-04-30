import { signOut } from "next-auth/react";

export const SignOut = () => (
  <button
    className="effect-container text-base text-black transition duration-300 hover:text-pink-700 dark:text-white md:text-lg"
    onClick={() => void signOut()}
  >
    <span className="effect">Log out</span>
  </button>
);
