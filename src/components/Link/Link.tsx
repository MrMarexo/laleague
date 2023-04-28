import React from "react";
import { type ReactFCC } from "~/types/types";
import NextLink from "next/link";

interface ILinkProps {
  href: string;
  className?: string;
}

const Link: ReactFCC<ILinkProps> = ({ children, href, className = "" }) => {
  return (
    <div className={className}>
      <NextLink href={href} className="effect-container">
        <span className="effect"> {children} </span>
      </NextLink>
    </div>
  );
};

export default Link;
