import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { type ReactFCC } from "~/types/types";
import Link from "../Link/Link";

const Layout: ReactFCC = ({ children }) => {
  const { data } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="position: fixed my-2 flex w-full flex-row justify-between px-20">
        <nav className="flex flex-row gap-8">
          <div className="font-extrabold">
            <Link href="/">League</Link>
          </div>
          <Link href="/results">My results</Link>
          <Link href="/scoreboard">Scoreboard</Link>
        </nav>
        {data?.user?.name ? (
          <div className="flex flex-row gap-2">
            <div>
              Welcome, <span className="font-bold">{data.user.name}</span>
            </div>
            <div>|</div>
            <button
              className="transition duration-300 hover:text-pink-700"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            className="transition duration-300 hover:text-pink-700"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        )}
      </div>
      <div className="container flex flex-col items-center justify-center px-4 pt-16 ">
        {children}
      </div>
    </main>
  );
};

export default Layout;
