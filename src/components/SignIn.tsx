import { signIn } from "next-auth/react";

export const SignIn = () => (
  <button
    className="effect-container text-base text-black transition duration-300 hover:text-pink-700 dark:text-white md:text-lg"
    onClick={() => void signIn()}
  >
    <span className="effect">Log in</span>
  </button>
);
