import React from "react";
import { type ReactFCC } from "~/types/types";
import NextLink from "next/link";

interface ILinkProps {
  href: string;
}

const Link: ReactFCC<ILinkProps> = ({ children, href }) => {
  return (
    <NextLink
      href={href}
      className="transition duration-300 hover:text-pink-700"
    >
      {children}
    </NextLink>
  );
};

export default Link;
