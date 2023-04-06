import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import React from "react";
import { type ReactFCC } from "~/types/types";
import Link from "../Link/Link";

const Layout: ReactFCC = ({ children }) => {
  const user = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#f2f1ef] to-[#ffffff]"> */}
      <div className="position: fixed my-2 flex w-full flex-row justify-between px-20">
        <div className="flex flex-row gap-8">
          <nav className="font-extrabold">
            <Link href="/">League</Link>
          </nav>
          <nav>
            <Link href="/results">My results</Link>
          </nav>
          <nav>
            <Link href="/scoreboard">Scoreboard</Link>
          </nav>
        </div>
        {user.isSignedIn ? (
          <div className="flex flex-row gap-2">
            <div>
              Welcome, <span className="font-bold">{user.user.firstName}</span>
            </div>
            <div>|</div>
            <div className="transition duration-300 hover:text-pink-700">
              <SignOutButton />
            </div>
          </div>
        ) : (
          <SignInButton mode="modal">
            <button className="transition duration-300 hover:text-pink-700">
              Sign in
            </button>
          </SignInButton>
        )}
      </div>
      <div className="container flex flex-col items-center justify-center px-4 py-16 ">
        {children}
      </div>
    </main>
  );
};

export default Layout;
