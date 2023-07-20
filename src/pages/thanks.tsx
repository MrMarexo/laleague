import { type NextPage } from "next/types";
import { Github } from "~/components/Icons/Github";
import { Instagram } from "~/components/Icons/Instagram";
import { Twitter } from "~/components/Icons/Twitter";
import Layout from "~/components/Layout";
import Link from "~/components/Link/Link";

const Thanks: NextPage = () => (
  <Layout>
    <div className="effect-container z-0 my-10">
      <h1 className="effect my-4 text-center font-league text-5xl">thanks</h1>
    </div>
    <p className="mt-4">
      Big thanks for helping with design and front-end to <b>Johana</b>.
    </p>
    <div className="flex flex-row gap-2">
      <Link isExternal href="https://github.com/johanarybarova">
        <Github />
      </Link>
      <Link isExternal href="https://twitter.com/JohanaRybarova">
        <Twitter />
      </Link>
    </div>
    <p className="mt-8">
      Thanks to <b>Juraj</b> for helping me coming up with the idea for this
      app.
    </p>
    <div className="flex flex-row gap-2">
      <Link isExternal href="https://github.com/JurajPalka">
        <Github />
      </Link>
      <Link isExternal href="https://www.instagram.com/juripalka">
        <Instagram />
      </Link>
    </div>
  </Layout>
);

export default Thanks;
