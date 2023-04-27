import React from "react";
import { type ReactFCC } from "~/types/types";
import NextLink from "next/link";

interface ILinkProps {
  href: string;
}

const Link: ReactFCC<ILinkProps> = ({ children, href }) => {
  return (
    <NextLink href={href} className="effect-container">
      <span className="effect"> {children} </span>
    </NextLink>
  );
};

export default Link;
