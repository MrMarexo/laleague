import React from "react";
import { type ReactFCC } from "~/types/types";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface ILinkProps {
  href: string;
}

const Link: ReactFCC<ILinkProps> = ({ children, href }) => {
  const { pathname } = useRouter();

  return (
    <NextLink
      href={href}
      className={
        pathname === href ? "effect-always-container" : "effect-container"
      }
    >
      <span className="effect"> {children} </span>
    </NextLink>
  );
};

export default Link;
